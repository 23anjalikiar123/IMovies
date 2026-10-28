# IMovies — MERN Movie Ticket Booking

A full-stack starter project built with React + Vite, Express, MongoDB, JWT authentication, and seat booking.

## Features
- Movie catalogue and movie search
- Register/login with hashed passwords and JWT
- View showtimes and available seats
- Book seats with server-side availability checks
- View and cancel your bookings
- Admin-only movie creation and showtime management endpoints
- Demo seed script, responsive UI, API error handling

> Payments are simulated for this learning project. Do not collect real card details or use this as a production ticketing system without adding a payment provider, transaction-safe booking logic, tests, and deployment hardening.

## Requirements
- Node.js 18+ (recommended)
- npm
- MongoDB Community Server or a MongoDB Atlas database

## 1. Start MongoDB
Make sure MongoDB is running locally, or create a MongoDB Atlas database and copy its connection string.

## 2. Configure backend
```bash
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```
On macOS/Linux, use `cp .env.example .env` instead of `copy`.

Backend runs at `http://localhost:5000`. The seed command creates demo movies and an admin account if they do not already exist.

Demo admin:
- Email: `admin@imovies.local`
- Password: `Admin123!`

Change these credentials and `JWT_SECRET` before using the project beyond local evaluation.

## 3. Start frontend (in a second terminal)
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Environment variables
Backend `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/imovies
JWT_SECRET=replace-this-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

## API overview
- `GET /api/health`
- `GET /api/movies`
- `GET /api/movies/:id`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (JWT)
- `GET /api/shows?movieId=<id>`
- `GET /api/shows/:id/seats`
- `POST /api/bookings` (JWT)
- `GET /api/bookings/my` (JWT)
- `PATCH /api/bookings/:id/cancel` (JWT)
- `POST /api/admin/movies` (admin JWT)
- `POST /api/admin/shows` (admin JWT)

## GitHub upload
1. Create a new **empty** repository on GitHub named `imovies-mern` (do not add a README if you plan to push this folder as-is).
2. Extract the ZIP.
3. Open a terminal in the extracted `IMovies-MERN` folder:
```bash
git init
git add .
git commit -m "Initial IMovies MERN project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/imovies-mern.git
git push -u origin main
```
Replace `YOUR-USERNAME` with your GitHub username. Never commit `.env`, passwords, or API secrets. `.gitignore` is included.
4. After deployment, add the live demo URL and GitHub repository URL to your project portal. A GitHub repository URL alone is not a live demo.

## Troubleshooting
- `ECONNREFUSED` / MongoDB connection error: start MongoDB or correct `MONGODB_URI`.
- Port in use: change `PORT` in backend `.env`.
- Frontend API errors: ensure backend is running on port 5000 and `VITE_API_URL` is not set to a wrong URL.
- Admin routes return 403: sign in with the seeded admin account.
