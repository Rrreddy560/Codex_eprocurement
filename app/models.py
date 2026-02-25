from pydantic import BaseModel, Field


class TenderCreate(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=10)
    budget: float | None = Field(default=None, gt=0)
    deadline: str | None = None


class Tender(BaseModel):
    id: int
    title: str
    description: str
    budget: float | None = None
    deadline: str | None = None
    status: str = "open"


class BidCreate(BaseModel):
    tender_id: int
    vendor_name: str
    price: float = Field(..., gt=0)
    delivery_days: int = Field(..., gt=0)
    vendor_score: float = Field(..., ge=0, le=100)
    compliance_score: float = Field(..., ge=0, le=100)
    notes: str | None = None


class Bid(BidCreate):
    id: int


class RankingRequest(BaseModel):
    weights: dict[str, float]


class RankedBid(BaseModel):
    bid_id: int
    vendor_name: str
    total_score: float
