from __future__ import annotations

from app.database import get_conn
from app.models import Bid, BidCreate, Tender, TenderCreate


def create_tender(payload: TenderCreate) -> Tender:
    with get_conn() as conn:
        cursor = conn.execute(
            "INSERT INTO tenders(title, description, budget, deadline) VALUES (?, ?, ?, ?)",
            (payload.title, payload.description, payload.budget, payload.deadline),
        )
        tender_id = cursor.lastrowid
        row = conn.execute("SELECT * FROM tenders WHERE id = ?", (tender_id,)).fetchone()
    return Tender(**dict(row))


def list_tenders() -> list[Tender]:
    with get_conn() as conn:
        rows = conn.execute("SELECT * FROM tenders ORDER BY id DESC").fetchall()
    return [Tender(**dict(row)) for row in rows]


def get_tender(tender_id: int) -> Tender | None:
    with get_conn() as conn:
        row = conn.execute("SELECT * FROM tenders WHERE id = ?", (tender_id,)).fetchone()
    return Tender(**dict(row)) if row else None


def create_bid(payload: BidCreate) -> Bid:
    with get_conn() as conn:
        cursor = conn.execute(
            """
            INSERT INTO bids(
                tender_id, vendor_name, price, delivery_days,
                vendor_score, compliance_score, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload.tender_id,
                payload.vendor_name,
                payload.price,
                payload.delivery_days,
                payload.vendor_score,
                payload.compliance_score,
                payload.notes,
            ),
        )
        bid_id = cursor.lastrowid
        row = conn.execute("SELECT * FROM bids WHERE id = ?", (bid_id,)).fetchone()
    return Bid(**dict(row))


def list_bids_for_tender(tender_id: int) -> list[Bid]:
    with get_conn() as conn:
        rows = conn.execute("SELECT * FROM bids WHERE tender_id = ? ORDER BY id DESC", (tender_id,)).fetchall()
    return [Bid(**dict(row)) for row in rows]


def dashboard_stats() -> dict[str, int]:
    with get_conn() as conn:
        tenders = conn.execute("SELECT COUNT(*) AS c FROM tenders").fetchone()["c"]
        bids = conn.execute("SELECT COUNT(*) AS c FROM bids").fetchone()["c"]
        open_tenders = conn.execute("SELECT COUNT(*) AS c FROM tenders WHERE status = 'open'").fetchone()["c"]
    return {"tenders": tenders, "bids": bids, "open_tenders": open_tenders}
