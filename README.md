# CampusHub - University Student Portal

<div align="center">

![CampusHub](https://img.shields.io/badge/CampusHub-Student%20Portal-blue?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-21.1.0-red?style=flat-square&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?style=flat-square&logo=postgresql)
![Gemini AI API](https://img.shields.io/badge/Gemini-AI-purple?style=flat-square)

**A full-stack Learning Management System for BIS & FMI university students**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Project Structure](#-project-structure) • [API Endpoints](#-api-endpoints)

🌐 **Live Demo:** [campus-hub-bis.netlify.app](https://campus-hub-bis.netlify.app)

</div>

---

## 📋 Overview

**CampusHub** is a comprehensive university Learning Management System built for BIS & FMI students at Helwan University. It provides a centralized portal for managing courses, tracking academic tasks, calculating GPA, and staying up-to-date with announcements and events — all in one clean, modern interface.

The platform features two distinct panels: a **Student Panel** and an **Admin Panel**, each with dedicated dashboards, navigation, and functionality tailored to their respective roles.

---

## ✨ Features

### 🎓 Student Panel
- **Dashboard** — Welcome screen with GPA overview, enrolled courses count, task statistics, upcoming tasks, and latest announcements
- **My Courses** — View all enrolled courses with doctor, schedule, timeslot, and credit hours; click to see course-specific tasks and mark them done/undone
- **GPA Calculator** — Select expected grades per course and calculate your projected GPA against the BIS credit-hour grade scale (A+ to F); includes a compare card and a floating AI GPA Advisor chatbot
- **Announcements** — Timeline-style feed of department announcements
- **Events** — Card grid of upcoming university events with location and host details
- **Assign Doctors** — First-login flow to select a doctor, day, and timeslot for each course; edit mode for returning students
- **Feedback** — Submit feedback to administrators
- **Settings** — Edit profile info, change password, manage doctor selections, and delete account

### 🛠 Admin Panel
- **Dashboard** — System-wide stats (students, doctors, courses) with quick navigation cards
- **Academics** — 3-step wizard to add courses and assign doctors; delete courses with cascading FK cleanup
- **Publish** — Tabbed interface to create and manage announcements, events, and assignments; integrated with AI-generated HTML email notifications
- **Inbox** — View all student feedback submissions

### 🤖 AI Features
- **GPA Advisor** — Floating chatbot powered by Gemini AI (`gemini-2.0-flash`) that answers GPA-related questions, helps students estimate required grades, and gives study advice
- **Email Notifications** — When an assignment is published, Gemini AI generates a styled HTML email body that is sent to all registered students via Nodemailer

### 🔐 Authentication & Security
- **JWT Auth** — Access tokens (15m) and refresh tokens (7d) stored in `httpOnly` cookies
- **Silent Refresh** — Angular HTTP interceptor auto-refreshes expired access tokens on 401 errors
- **Auth Guards** — Route-level protection for all student and admin pages
- **Role-based Access** — Separate `admin` and `student` roles enforced on both frontend and backend
- **First-login Flow** — New students are redirected to the Assign Doctors page before accessing the main portal

---

## 🛠 Tech Stack

### Frontend
- **Angular 21.1.0** — Standalone components, signals, zoneless change detection
- **TailwindCSS 4** — Utility-first styling
- **RxJS** — `switchMap`, `forkJoin`, `catchError` for reactive HTTP patterns
- **TypeScript 5.9** — Strict mode

### Backend
- **Node.js** — Runtime environment
- **Express.js 5** — Web framework
- **PostgreSQL (Neon)** — Cloud-hosted relational database via `pg` connection pool
- **JWT** — `jsonwebtoken` for access/refresh token management
- **bcryptjs** — Password hashing (12 salt rounds)
- **Nodemailer** — Batch email notifications to all students
- **Helmet** — HTTP security headers
- **express-rate-limit** — Login and registration rate limiting
- **express-validator** — Input validation on auth routes

### AI & Services
- **Google Gemini AI (`gemini-2.0-flash`)** — GPA Advisor chatbot + HTML email generation
- **CORS** — Configured for Netlify + Railway cross-origin with `credentials: true`

### Deployment
- **Frontend** — Netlify (`netlify.toml` with `@netlify/angular-runtime`)
- **Backend** — Railway (env vars injected at runtime, no `.env` in production)
- **Database** — Neon (PostgreSQL, SSL enabled)

---

## 📦 Installation

### Prerequisites
- Node.js (v20 or higher)
- npm
- PostgreSQL database (local or Neon)
- Google Gemini API Key
- Gmail App Password (for Nodemailer)

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/Mohamed-tarek107/Campus-Hub.git
cd Campus-Hub
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
DATABASE_URL=your_postgresql_connection_string
JWT_AccessToken_SECRET=your_access_token_secret
JWT_Refresh_SECRET=your_refresh_token_secret
GEMINI_API_KEY=your_gemini_api_key
MYMAIL=your_gmail_address
APP_PASS=your_gmail_app_password
NODE_ENV=development
```

4. **Set up the PostgreSQL database**

Create the following tables:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR NOT NULL,
  bio TEXT,
  hashedpass VARCHAR NOT NULL,
  gpa DECIMAL(3,2) DEFAULT 0.00,
  department VARCHAR NOT NULL,
  year INTEGER NOT NULL,
  role VARCHAR DEFAULT 'student',
  is_firstlogin BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE doctors (id SERIAL PRIMARY KEY, name VARCHAR NOT NULL);
CREATE TABLE courses (id SERIAL PRIMARY KEY, course_name VARCHAR NOT NULL, department VARCHAR, year INTEGER, credit INTEGER);
CREATE TABLE coursedoctors (id SERIAL PRIMARY KEY, course_id INT REFERENCES courses(id), doctor_id INT REFERENCES doctors(id));
CREATE TABLE studentcourses (id SERIAL PRIMARY KEY, student_id INT REFERENCES users(id), course_id INT REFERENCES courses(id), doctor_id INT REFERENCES doctors(id), day VARCHAR, timeslot VARCHAR);
CREATE TABLE tasks (id SERIAL PRIMARY KEY, coursedoctor_id INT REFERENCES coursedoctors(id), type VARCHAR, title VARCHAR, details TEXT, deadline DATE);
CREATE TABLE studenttasks (id SERIAL PRIMARY KEY, student_id INT REFERENCES users(id), task_id INT REFERENCES tasks(id), status VARCHAR DEFAULT 'pending');
CREATE TABLE announcements (id SERIAL PRIMARY KEY, title VARCHAR, description TEXT, source VARCHAR, date DATE);
CREATE TABLE events (id SERIAL PRIMARY KEY, title VARCHAR, description TEXT, location VARCHAR, host VARCHAR, date DATE);
CREATE TABLE feedbacks (id SERIAL PRIMARY KEY, user_id INT REFERENCES users(id), feedback TEXT, rating INT, created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE refreshtokens (id SERIAL PRIMARY KEY, user_id INT REFERENCES users(id), refresh_token TEXT, ip_address VARCHAR);
```

5. **Start the backend server**
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```
Application runs on `http://localhost:4200`

---

## 🚀 Usage

### Student Flow
1. **Register** a new account (select department BIS/FMI and year)
2. **Assign Doctors** — on first login you will be redirected to choose a doctor, day, and timeslot for each course
3. **Explore the Dashboard** — see your GPA, enrolled courses, pending/done tasks, and announcements at a glance
4. **My Courses** — click "View Tasks" on any course card to see and mark tasks done
5. **GPA Calculator** — select expected grades to project your semester GPA; use the floating AI Advisor for personalized advice
6. **Stay updated** via Announcements and Events pages
7. **Submit feedback** through the Feedback page

### Admin Flow
1. **Login** with an admin account to be redirected to the Admin Dashboard
2. **Academics** — use the 3-step wizard to add courses and assign doctors; delete courses from the card grid
3. **Publish** — create announcements, events, and assignments; assignments trigger AI-generated email notifications to all students
4. **Inbox** — read student feedback submissions

---

## 📁 Project Structure

```
Campus-Hub/
├── backend/
│   ├── config/
│   │   └── db.js                   # PostgreSQL pool (Neon + SSL)
│   ├── controllers/
│   │   ├── admin.controller.js     # All admin CRUD operations
│   │   ├── auth.controller.js      # Register, login, refresh, logout
│   │   ├── userProfile.controller.js
│   │   ├── AI_gpaCalc.controller.js
│   │   └── students/
│   │       ├── assignDoctors.controller.js
│   │       ├── catalog.controller.js
│   │       ├── views.controller.js
│   │       └── feedback.controller.js
│   ├── middlewares/
│   │   └── authMiddleware.js       # JWT verify, requireAdmin, rate limiters
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── admin.routes.js
│   │   ├── students.routes.js
│   │   ├── user.routes.js
│   │   └── gpaCac.routes.js
│   ├── services/
│   │   ├── AI.service.js           # Gemini chatbot (GPA Advisor)
│   │   ├── mailerAI.service.js     # Gemini HTML email generation
│   │   └── notification.service.js # Nodemailer batch sender
│   └── server.js                   # Express app, CORS, routes
│
├── frontend/
│   └── src/
│       └── app/
│           ├── components/
│           │   ├── login-page/
│           │   ├── register-page/
│           │   ├── dashboard/
│           │   ├── mycourses/
│           │   ├── gpa-calculator.component/
│           │   ├── gpa-advisor/        # Floating AI chatbot widget
│           │   ├── announcements/
│           │   ├── events-component/
│           │   ├── assigndoctors/
│           │   ├── feedback.component/
│           │   ├── settings.component/
│           │   ├── sidenav/
│           │   ├── uppernav/
│           │   ├── not-found-page/
│           │   └── Admin/
│           │       ├── admin.dashboard/
│           │       ├── admin.academics/
│           │       ├── admin.publish/
│           │       ├── admin.feedbacks/
│           │       ├── admin.sidenav/
│           │       └── admin.topnav/
│           ├── services/
│           │   ├── auth/
│           │   │   ├── auth-service.ts
│           │   │   └── interceptor/    # JWT auto-refresh interceptor
│           │   ├── admin/admin-panel.ts
│           │   ├── studentRoute/student-service.ts
│           │   ├── userProfile/user-profile-service.ts
│           │   └── gpaCalc/gpa-calc-service.ts
│           ├── guards/
│           │   └── auth.guard.ts
│           ├── app.routes.ts
│           └── app.config.ts
│
├── netlify.toml
├── package.json
└── README.md
```

---

## 🔐 Security Features

### Authentication & Authorization
- **Password Hashing** — bcryptjs with 12 salt rounds
- **JWT Tokens** — Short-lived access tokens (15 min) + long-lived refresh tokens (7 days)
- **httpOnly Cookies** — Tokens stored in `httpOnly` cookies; inaccessible to JavaScript (XSS protection)
- **Refresh Token Rotation** — Every refresh generates a new token pair; old tokens are deleted from the database
- **Role Enforcement** — `requireAdmin` middleware on all admin routes; `ensureAuthenticated` on all protected routes

### Cookie Security
- `httpOnly: true` — Prevents XSS token theft
- `secure: true` (production) — HTTPS-only transmission
- `sameSite: 'none'` (production) / `'strict'` (development) — Configured for cross-origin Netlify → Railway setup

### API Protection
- **Rate Limiting** — 5 login attempts per 15 minutes; 3 registrations per hour
- **Input Validation** — `express-validator` on all auth routes
- **Helmet** — Secure HTTP headers on all responses
- **CORS Whitelist** — Only `localhost:4200`, `campus-hub-bis.netlify.app`, and Netlify preview URLs are allowed
- **Parameterized Queries** — All database queries use `$1, $2` placeholders (SQL injection prevention)

### Frontend Guards
- **`authGuard`** — Calls `/api/user/userInfo` on every protected route; redirects to `/login` on failure
- **HTTP Interceptor** — Transparently retries failed requests after refreshing the access token; redirects to `/login` on refresh failure

---

## 📝 API Endpoints

### Authentication — `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new student account |
| POST | `/login` | Login and receive JWT cookies |
| POST | `/refresh-token` | Rotate access and refresh tokens |
| POST | `/logout` | Clear cookies and delete refresh token |

### Admin — `/api/admin`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/addCourse` | Create a new course |
| GET | `/courses` | List all courses |
| DELETE | `/courses/:id` | Delete a course (cascading) |
| POST | `/addDoctor` | Assign a doctor to a course |
| GET | `/courses/:id/doctors` | List doctors for a course |
| POST | `/coursedoctor/:id/tasks` | Publish an assignment (triggers email) |
| GET/POST | `/listAllEvents` / `/addEvent` | Manage events |
| DELETE | `/events/:id` | Delete an event |
| GET/POST | `/listAllAnnounces` / `/addAnnouncment` | Manage announcements |
| DELETE | `/announcements/:id` | Delete an announcement |
| GET | `/listFeedbacks` | View all student feedback |
| GET | `/dashbordStats` | Dashboard counts (students, doctors, courses) |

### Student — `/api/student`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/available` | Courses available for the student's dept & year |
| GET | `/:course_id/doctors` | Doctors assigned to a course |
| POST | `/assignDoctors` | Submit doctor/day/timeslot selections |
| GET | `/viewAllStudentCourses` | All enrolled courses with schedule |
| GET | `/viewAllStudenttasks` | All tasks across enrolled courses |
| GET | `/viewCourseTasks/:coursedoctor_id` | Tasks for a specific course |
| POST | `/markTaskDone/:task_id` | Toggle task status (done ↔ pending) |
| GET | `/viewDoneTasks` | All completed tasks |
| POST | `/takeFeedback` | Submit feedback |

### User — `/api/user`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/userInfo` | Get current user profile |
| PATCH | `/editInfo` | Update username, email, year, bio |
| PATCH | `/changePassword` | Change password (requires current password) |
| DELETE | `/deleteAccount` | Permanently delete account |

### GPA — `/api/gpa`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/assginGpa` | Save a GPA value to the user record |
| POST | `/aiChat` | Chat with the Gemini GPA Advisor |

---

## 👤 Author

**Mohamed Tarek**

---

<div align="center">

**Built with ❤️ using Angular & Node.js**

⭐ Star this repo if you find it helpful!

</div>
