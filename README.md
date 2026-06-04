# Online Travel Package Booking System

Premium TypeScript implementation for MDA523 Assignment 2.

## Stack

- Frontend: React + Vite + TypeScript + Ant Design v5
- Backend: NestJS + TypeScript
- Database: SQLite + TypeORM

SQLite is used for easy local execution. The same entity design can be moved to PostgreSQL or MySQL later.

## Demo Accounts

Customer:
- Email: user@travel.com
- Password: password

Admin:
- Email: admin@travel.com
- Password: password

## Run Backend

```bash
cd backend
npm install
npm run start:dev
```

API runs at `http://localhost:3000`.

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Implemented Features

- Customer/admin login and registration
- Professional dashboard UI
- Toast notifications for all success and error states
- Destination search and package cards
- Booking drawer with validation
- Simulated payment success/failure
- Customer booking history
- Admin package creation
- Admin booking status management
- Role-based backend checks
- TypeScript used in frontend and backend source code
