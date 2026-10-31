# Institutional Event & Notice Board System

A full-stack institutional communication and event portal for colleges and universities. Built with **React** (Vite + Tailwind CSS) on the frontend and **Express** (Node.js + Mongoose) on the backend.

Includes instant zero-configuration database startup (automatic in-memory MongoDB fallback with pre-seeded data), role-based authentication, circular category tags, pinning, and an approval workflow for student club events.

---

## 🏛️ System Architecture & Directory Structure

```text
institutional-notice-board/
│
├── client/                         # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # College Portal navbar & 1-click test role switcher
│   │   │   ├── NoticeCard.jsx      # Categorized & pinned notice display card
│   │   │   ├── EventCard.jsx       # Event highlight card (Date • Venue)
│   │   │   ├── Loader.jsx          # Loading spinner & skeleton states
│   │   │   ├── NoticeModal.jsx     # Read circular modal with print & share
│   │   │   ├── EventModal.jsx      # Event schedule, venue & registration modal
│   │   │   └── ProposeEventModal.jsx # Club event proposal submission
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Matches ASCII mockup (Hero, Latest Notices, Events)
│   │   │   ├── Notices.jsx         # Searchable notice board with category pills
│   │   │   ├── Events.jsx          # Event calendar + proposal trigger
│   │   │   ├── Login.jsx           # Sign in with 1-click test credential presets
│   │   │   ├── Register.jsx        # Student & Club registration
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx   # Metrics, club approval queue, quick actions
│   │   │       ├── ManageNotices.jsx # Notice CRUD & top-board pinning
│   │   │       └── ManageEvents.jsx  # Event CRUD & Approve/Reject workflow
│   │   │
│   │   ├── services/
│   │   │   └── api.js              # Centralized Axios client with JWT interceptor
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # User auth & role state provider
│   │   │
│   │   ├── App.jsx                 # Route configurations & protected routes
│   │   ├── main.jsx                # Application root
│   │   └── index.css               # Tailwind CSS directives
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                         # Express Backend
│   ├── controllers/
│   │   ├── authController.js       # Register, login, session profile
│   │   ├── noticeController.js     # Notice CRUD, filtering, and pinning
│   │   └── eventController.js      # Event CRUD, club approvals, admin stats
│   │
│   ├── models/
│   │   ├── User.js                 # User schema (Student, Club Organizer, Admin)
│   │   ├── Notice.js               # Notice schema (category tags, priority, pin)
│   │   └── Event.js                # Event schema (club proposal status workflow)
│   │
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth endpoints
│   │   ├── noticeRoutes.js         # /api/notices endpoints
│   │   └── eventRoutes.js          # /api/events endpoints
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT validation & user attachment
│   │   └── adminMiddleware.js      # Admin authorization checks
│   │
│   ├── config/
│   │   └── db.js                   # Mongoose connection + auto memory fallback + seeder
│   │
│   ├── server.js                   # Express application entrypoint
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🚀 Key Features

### 🎓 Student Features
- **Notice Board**: View latest institutional notices with real-time text search and category filtering (`Examination`, `Holiday`, `Academic`, `Placement`, `Sports`, `Cultural`, `General`).
- **Urgent & Pinned Alerts**: Pinned notices appear at the top with distinguished high-visibility indicators.
- **Event Discovery**: View approved upcoming events (e.g. Hackathons, Workshops, Fests) with date, time, venue, and registration links.
- **Club Event Proposals**: Registered students and clubs can submit event proposals for administration review.
- **Notice & Event Details**: Read full notices, print circulars, or copy direct share links.

### 🛡️ Admin & Faculty Features
- **Admin Dashboard**: Live statistics for total notices, urgent circulars, active events, pending approvals, and user counts.
- **Notice Management**: Create, edit, delete, and pin/unpin circulars with audience targets (`All`, `Students`, `Faculty`, `Final Year`).
- **Event Management**: Create official institution-wide events and manage schedules.
- **Club Approval Workflow**: Review student-club submitted events in a dedicated queue with 1-click **Approve** or **Reject** actions (with optional feedback remarks).

---

## 🔑 Pre-Seeded Test Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@college.edu` | `Admin@123` | Full access to Admin Dashboard, Notice CRUD, Event review & approvals |
| **Club Organizer** | `club@college.edu` | `Club@123` | Can propose club events and browse portal |
| **Student** | `student@college.edu` | `Student@123` | Can browse notices, view events, register, and propose activities |

> 💡 *Note: The portal includes a **"Demo Roles"** quick-switcher in the navigation bar and 1-click credential buttons on the Login page for instant testing.*

---

## 💻 Installation & Setup

### 1. Prerequisites
- **Node.js** (v18 or newer)
- **npm**

### 2. Backend Setup (`server/`)
```bash
cd server
npm install
npm start
```
- The backend server runs on `http://localhost:5000`.
- If a local MongoDB daemon is running, it connects to `mongodb://127.0.0.1:27017/institutional-notice-board`.
- **Zero-Setup Guarantee**: If MongoDB is not installed or running, the server automatically starts an in-memory MongoDB instance and seeds demo data!

### 3. Frontend Setup (`client/`)
```bash
cd client
npm install
npm run dev
```
- The client app runs on `http://localhost:5173`.
- API calls are proxied to `http://localhost:5000/api`.

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new student or club account.
- `POST /api/auth/login` — Sign in and receive JWT token.
- `GET /api/auth/me` — Get profile of currently logged-in user (Protected).

### Notices (`/api/notices`)
- `GET /api/notices` — List all notices (Supports `?category=`, `?priority=`, `?search=`, `?limit=`).
- `GET /api/notices/:id` — Get single notice and increment view count.
- `POST /api/notices` — Publish a new notice (Admin only).
- `PUT /api/notices/:id` — Update an existing notice (Admin only).
- `DELETE /api/notices/:id` — Delete a notice (Admin only).
- `PATCH /api/notices/:id/pin` — Toggle notice pinned state (Admin only).

### Events (`/api/events`)
- `GET /api/events` — Get events (Public sees approved events; Admins can filter by `?status=`).
- `GET /api/events/:id` — Get event details.
- `POST /api/events` — Propose/create event (Admins auto-approved; Students/Clubs set to `'pending'`).
- `PUT /api/events/:id` — Update event details.
- `DELETE /api/events/:id` — Delete event.
- `PATCH /api/events/:id/review` — Approve or reject club proposals with remarks (Admin only).
- `GET /api/events/admin/stats` — Admin dashboard counters and analytics (Admin only).
