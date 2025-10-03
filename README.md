# LUCT Reporting (Full-stack demo)

This repository contains a minimal, ready-to-run full-stack reporting application for the LUCT assignment.

## Backend
- Node.js + Express + Sequelize (SQLite)
- Features: auth (register/login), reports CRUD, search, export to Excel.

Run:
```
cd backend
npm install
npm start
```
Default admin created: admin@luct.edu / password (role PL)

## Frontend
- React + Bootstrap
Run:
```
cd frontend
npm install
npm start
```
Edit `src/services/api.js` if backend runs on a different host/port.

## Notes
- Uses SQLite (no XAMPP required). If you need MySQL (XAMPP), I can provide migration instructions.
- The project includes role-based abilities in the backend; adjust as needed for UI.

## Using with XAMPP (MySQL)
1. Start Apache & MySQL in XAMPP.
2. Create database `luct_reporting` in phpMyAdmin.
3. Configure database in `backend/.env` if needed (user/password/host).
4. Run backend:
   ```
   cd backend
   npm install
   npm start
   ```
5. Sequelize will auto-create tables in MySQL.