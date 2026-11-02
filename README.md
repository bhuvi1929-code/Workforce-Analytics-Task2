# Workforce Analytics Platform — Task 2

A full-stack Task 2 implementation based on the supplied Task 1 project.

## Technology
- Frontend: React 18, TypeScript (strict), Vite, Material UI, Recharts
- Backend: Node.js (22.13+), TypeScript, Express
- Database: SQLite using Node's built-in `node:sqlite`
- Architecture: reusable UI components, API service layer, runtime response guards, service layer, repository interfaces and SQLite repositories

## Run on Windows (PowerShell)

Use **two separate terminals**. Keep both open while using the dashboard.

### 1. Start the backend (Terminal 1)
```powershell
cd "C:\Users\Bhuvanesh S\Downloads\wfa-platform-task2-complete\server"
npm install
npm run dev
```
Expected message: `WFA API listening on http://localhost:4000/api`

On first start, the server creates `server/data/wfa.db` and seeds sample data when the database is empty.

### 2. Start the frontend (Terminal 2)
```powershell
cd "C:\Users\Bhuvanesh S\Downloads\wfa-platform-task2-complete\client"
npm install
npm run dev
```
Open `http://localhost:5173/`.

**Important:** There is intentionally no root `package.json`. Run commands inside `client` or `server`, not the repository root.

## Useful commands
Run these from the corresponding folder:
- Frontend: `npm run dev`, `npm run build`, `npm run typecheck`, `npm test`
- Backend: `npm run dev`, `npm start`, `npm run typecheck`, `npm test`, `npm run seed`

Node.js 22.13+ is required because the backend uses the built-in `node:sqlite` module.

## Features
- Responsive sidebar, header, profile display and light/dark theme
- KPI cards: Total Employees, Present, Absent, On Leave, Attendance Rate
- Attendance trend and employee distribution charts
- Shared department, location, date-range and employee-status filters
- Employee directory with search, sorting and pagination
- Loading skeletons, retryable errors and empty states
- API response guards and input validation

## API endpoints
- `GET /api/health`
- `GET /api/lookups`
- `GET /api/dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /api/employees?search=&sortBy=name&order=asc&page=1&pageSize=10`

Additional filters are supported by the API; see `server/src/validation/filters.ts` and `server/src/routes/api.ts`.

## Database and architecture
Schema: `server/src/db/schema.sql`. Tables include departments, employees and attendance. SQL queries live in SQLite repository classes. Services depend on repository interfaces, and `server/src/container.ts` wires concrete implementations. Parameterized SQL and a sort-field whitelist are used.

## Submission checklist
- [ ] Add your own Figma design URL.
- [ ] Push the code to your assigned GitHub repository/branch.
- [ ] Run the frontend production build and server tests locally.
- [ ] Capture actual dashboard screenshots (desktop/tablet/mobile and light/dark).
- [ ] Prepare a short demo explaining filters, API requests, repository pattern and SQLite schema.

## Verification note
Local verification completed: frontend production build passed, backend TypeScript typecheck passed, all 7 backend automated tests passed, and health, lookups, dashboard and employee APIs were tested successfully. Frontend dashboard filters and employee search were also verified in the browser. Add your actual Figma URL and dashboard screenshots before final submission.

