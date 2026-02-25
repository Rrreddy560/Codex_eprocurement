# E-Procurement DSS Web App

A runnable e-procurement platform with a Decision Support System (DSS) to evaluate bids and recommend winners.

## What is included

- Web dashboard for procurement operations.
- Tender management (create/list/view).
- Bid submission per tender.
- DSS ranking page for bid scoring.
- REST APIs for integrations.
- SQLite persistence for quick production-like behavior.
- GitHub Actions CI pipeline for tests.

## Architecture

- **Backend/UI:** FastAPI + Jinja templates
- **Database:** SQLite (`eprocurement.db`)
- **DSS Engine:** Weighted normalized scoring
- **Container:** Dockerfile + docker-compose

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open:
- UI: http://localhost:8000/
- API docs: http://localhost:8000/docs

## Run with helper commands

```bash
make install
make run
make test
```

## Run with Docker

```bash
docker build -t eproc-dss .
docker run --rm -p 8000:8000 eproc-dss
# or
docker compose up --build
```

## Core pages

- `/` dashboard
- `/tenders/new` create tender
- `/tenders/{id}` tender details + bid form
- `/tenders/{id}/ranking` DSS ranking

## Core APIs

- `GET /health`
- `POST /tenders`
- `GET /tenders`
- `POST /bids`
- `POST /dss/rank/{tender_id}`

## Upload this to your GitHub repository

```bash
git init
git add .
git commit -m "Initial eprocurement DSS app"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

If this repo already exists remotely:

```bash
git add .
git commit -m "Update eprocurement DSS app"
git push
```

## Launch checklist

1. Add authentication and role permissions.
2. Add approval workflow states (draft/review/approved/awarded).
3. Add audit logs and policy checks.
4. Move SQLite to PostgreSQL for scale.
5. Add CI/CD and production deployment.
