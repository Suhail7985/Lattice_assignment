<div align="center">

# 🎟️ EventPro: Scalable Event Booking System

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)

*A production-grade, full-stack application built to demonstrate advanced system design, concurrency management, and modern UI/UX principles.*

</div>

---

## 🚀 Overview

The **Event Booking System** is a comprehensive solution designed to handle high-stakes event ticketing. It was built from the ground up to solve the classic "Double Booking" problem encountered in high-traffic ticketing systems, ensuring absolute data integrity using database-level transaction locks.

This project features a robust **Node.js/Express** backend serving a sleek, dark-mode **React** frontend. 

### ✨ Core Features
- **Concurrency Bulletproof**: Uses `SELECT ... FOR UPDATE` row-level locking to prevent race conditions during ticket booking.
- **RESTful Architecture**: Clean, scalable separation of Routes, Controllers, and Services.
- **Interactive Documentation**: Beautiful Swagger UI for easy API exploration.
- **Modern Glassmorphism UI**: A premium user interface built with Vite, Tailwind CSS, and Framer Motion.
- **Role Simulation**: Fully modeled database schema to handle Users, Events, Bookings, and Attendance Check-ins.

---

## 🏗️ System Architecture

The project is structured as a monorepo containing both the backend API and the frontend client.

```text
📦 Event-Booking-System
 ┣ 📂 backend/               # Express API Source
 ┃ ┣ 📂 src/
 ┃ ┃ ┣ 📂 config/            # DB Connection & Env
 ┃ ┃ ┣ 📂 controllers/       # Route Logic & Request Handling
 ┃ ┃ ┣ 📂 middlewares/       # Validation (express-validator)
 ┃ ┃ ┣ 📂 models/            # SQL Initializers
 ┃ ┃ ┣ 📂 routes/            # API Endpoints
 ┃ ┃ ┗ 📂 services/          # Business Logic (Transactions)
 ┃ ┣ 📂 scripts/             # DB Init & Concurrency Test Scripts
 ┃ ┗ 📜 swagger.yaml         # OpenAPI Specification
 ┃
 ┣ 📂 frontend/              # React SPA Source
 ┃ ┣ 📂 src/
 ┃ ┃ ┣ 📂 components/        # Reusable UI (Navbar, etc.)
 ┃ ┃ ┣ 📂 pages/             # Route Views (Home, Bookings, Attendance)
 ┃ ┃ ┣ 📂 services/          # API Client (Axios)
 ┃ ┃ ┗ 📜 index.css          # Tailwind Custom Utilities
 ┃ ┗ 📜 tailwind.config.js
 ┃
 ┗ 📜 docker-compose.yml     # (Optional) Containerized Setup
```

---

## 🚦 Getting Started

Follow these instructions to run the application locally on your machine.

### Prerequisites
- **Node.js** (v18+)
- **MySQL** (Running locally on port `3306`)

### 1. Database Setup
1. In the `backend/` directory, locate or create your `.env` file based on `.env.example`.
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=event_booking_db
   PORT=5000
   ```
2. Initialize the schema and seed data automagically:
   ```bash
   cd backend
   node scripts/init-db.js
   ```

### 2. Launch the Backend API
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Start the server (Dev mode):
   ```bash
   npm run dev
   ```
   > The API is now up at `http://localhost:5000`. You can view the docs at `http://localhost:5000/api-docs`.

### 3. Launch the Frontend UI
1. Open a new terminal and navigate to the frontend:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > The application is now live at `http://localhost:3000`.

---

## 🧪 Validating the Concurrency Logic

To prove that the system safely handles high load and prevents overselling, we have provided an automated test script. This script simulates 105 asynchronous requests attempting to book tickets for an event that only has 100 available seats.

1. Ensure your backend server is running.
2. In a new terminal, run the test script:
   ```bash
   cd backend
   npm run test:concurrency
   ```

**Expected Result:** You will witness exactly 100 successful bookings and exactly 5 rejections. Because of the transactional row-level lock (`FOR UPDATE`), the database guarantees that no two requests read the same "remaining_tickets" value simultaneously, preserving absolute data integrity.

---

## 🤝 Project Submission Notes
Created by a Senior-Level Developer to demonstrate best-in-class, interview-ready engineering standards.
