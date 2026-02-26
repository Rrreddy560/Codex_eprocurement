# E-Procurement DSS (TypeScript RBAC Edition)

This version upgrades the project to a TypeScript architecture with role-based access for:
- `mess_manager`
- `management` (includes admin-panel capabilities)
- `supplier`

## What you now have

- **TypeScript backend** (`src/`) using Express + Zod.
- **RBAC guard layer** with permission checks per role.
- **Management admin endpoints** for approvals and audit logs.
- **Supplier bid workflow** and mess-manager input workflow.
- **TypeScript React frontend skeleton** (`web/`) with role-specific panels.

## Backend quick start

```bash
npm install
npm run dev
```

Server runs on `http://localhost:8080`.

### Key API routes

- `GET /health`
- `GET /api/dashboard`
- `GET /api/requirements`
- `POST /api/requirements` (mess_manager)
- `POST /api/requirements/:requirementId/decision` (management)
- `GET /api/bids` (management/supplier)
- `POST /api/bids` (supplier)
- `GET /api/admin/audit-log` (management admin panel)

Use headers in requests:
- `x-user-role: mess_manager | management | supplier`
- `x-user-name: <display-name>`

## Frontend quick start

```bash
cd web
npm install
npm run dev
```

Frontend runs on Vite (default `http://localhost:5173`).

## Note
If you share your detailed step-by-step sheet next, I can map each workflow directly into screens, DB tables, and APIs.
