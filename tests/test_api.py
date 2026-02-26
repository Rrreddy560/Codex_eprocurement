from pathlib import Path

from fastapi.testclient import TestClient

from app.database import init_db
from app.main import app


DB_FILE = Path(__file__).resolve().parent.parent / "eprocurement.db"


def reset_db() -> None:
    if DB_FILE.exists():
        DB_FILE.unlink()
    init_db()


def test_health() -> None:
    reset_db()
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_e2e_ranking() -> None:
    reset_db()
    client = TestClient(app)
    tender = client.post(
        "/tenders",
        json={"title": "IT Equipment", "description": "Procurement for laptops and peripherals."},
    )
    tender_id = tender.json()["id"]

    client.post(
        "/bids",
        json={
            "tender_id": tender_id,
            "vendor_name": "Vendor A",
            "price": 900,
            "delivery_days": 7,
            "vendor_score": 85,
            "compliance_score": 95,
        },
    )
    client.post(
        "/bids",
        json={
            "tender_id": tender_id,
            "vendor_name": "Vendor B",
            "price": 1100,
            "delivery_days": 9,
            "vendor_score": 95,
            "compliance_score": 91,
        },
    )

    ranking = client.post(
        f"/dss/rank/{tender_id}",
        json={
            "weights": {
                "price": 0.4,
                "delivery_days": 0.2,
                "vendor_score": 0.2,
                "compliance_score": 0.2,
            }
        },
    )
    assert ranking.status_code == 200
    assert ranking.json()[0]["vendor_name"] == "Vendor A"
