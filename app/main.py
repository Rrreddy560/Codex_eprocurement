from __future__ import annotations

from fastapi import FastAPI, Form, HTTPException, Request
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.database import init_db
from app.engine import rank_bids
from app.models import Bid, BidCreate, RankedBid, RankingRequest, Tender, TenderCreate
from app.store import (
    create_bid,
    create_tender,
    dashboard_stats,
    get_tender,
    list_bids_for_tender,
    list_tenders,
)

app = FastAPI(title="E-Procurement DSS", version="1.0.0")
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        request,
        "index.html",
        {"stats": dashboard_stats(), "tenders": list_tenders()[:5]},
    )


@app.get("/tenders/new")
def new_tender_page(request: Request):
    return templates.TemplateResponse(request, "new_tender.html", {})


@app.post("/tenders/new")
def create_tender_form(
    title: str = Form(...),
    description: str = Form(...),
    budget: float | None = Form(default=None),
    deadline: str | None = Form(default=None),
):
    tender = create_tender(TenderCreate(title=title, description=description, budget=budget, deadline=deadline))
    return RedirectResponse(url=f"/tenders/{tender.id}", status_code=303)


@app.get("/tenders/{tender_id}")
def tender_detail(request: Request, tender_id: int):
    tender = get_tender(tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
    bids = list_bids_for_tender(tender_id)
    return templates.TemplateResponse(request, "tender_detail.html", {"tender": tender, "bids": bids})


@app.post("/tenders/{tender_id}/bids")
def create_bid_form(
    tender_id: int,
    vendor_name: str = Form(...),
    price: float = Form(...),
    delivery_days: int = Form(...),
    vendor_score: float = Form(...),
    compliance_score: float = Form(...),
    notes: str | None = Form(default=None),
):
    if not get_tender(tender_id):
        raise HTTPException(status_code=404, detail="Tender not found")
    create_bid(
        BidCreate(
            tender_id=tender_id,
            vendor_name=vendor_name,
            price=price,
            delivery_days=delivery_days,
            vendor_score=vendor_score,
            compliance_score=compliance_score,
            notes=notes,
        )
    )
    return RedirectResponse(url=f"/tenders/{tender_id}", status_code=303)


@app.get("/tenders/{tender_id}/ranking")
def ranking_page(request: Request, tender_id: int):
    tender = get_tender(tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
    bids = list_bids_for_tender(tender_id)
    ranked = rank_bids(
        bids,
        {
            "price": 0.35,
            "delivery_days": 0.25,
            "vendor_score": 0.2,
            "compliance_score": 0.2,
        },
    ) if bids else []
    return templates.TemplateResponse(request, "ranking.html", {"tender": tender, "ranked": ranked})


@app.post("/tenders", response_model=Tender)
def create_tender_api(payload: TenderCreate) -> Tender:
    return create_tender(payload)


@app.get("/tenders", response_model=list[Tender])
def list_tenders_api() -> list[Tender]:
    return list_tenders()


@app.post("/bids", response_model=Bid)
def submit_bid_api(payload: BidCreate) -> Bid:
    if not get_tender(payload.tender_id):
        raise HTTPException(status_code=404, detail="Tender not found")
    return create_bid(payload)


@app.post("/dss/rank/{tender_id}", response_model=list[RankedBid])
def rank_tender_bids_api(tender_id: int, payload: RankingRequest) -> list[RankedBid]:
    tender_bids = list_bids_for_tender(tender_id)
    if not tender_bids:
        raise HTTPException(status_code=404, detail="No bids for this tender")

    try:
        ranked = rank_bids(tender_bids, payload.weights)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    return [
        RankedBid(bid_id=bid.id, vendor_name=bid.vendor_name, total_score=score)
        for bid, score in ranked
    ]
