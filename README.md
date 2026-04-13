🎓 CampusHub - Smart Academic Management Platform
<div align="center">

![Angular](https://img.shields.io/badge/Angular-20.3.0-red?style=flat-square&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![Gemini AI API](https://img.shields.io/badge/Gemini-AI-purple?style=flat-square)


A full-stack, AI-powered university portal designed to centralize and optimize academic workflows

Features
 • Tech Stack
 • Installation
 • Usage
 • Project Structure

</div>
📋 Overview

CampusHub is a comprehensive academic platform that simplifies how students and administrators manage university life.

It replaces fragmented systems with a single, centralized solution for:

Course management
GPA tracking
Task organization
Announcements & events
Student feedback

Built with a scalable architecture and enhanced with AI-powered features, CampusHub delivers a modern, efficient academic experience.

✨ Features
🎯 Core Functionality
Role-Based Access Control (Student / Admin)
Secure Authentication System using JWT
Real-time Academic Dashboard
RESTful API Architecture
Automated Email Notifications
👨‍🎓 Student Features
Smart Dashboard
GPA overview
Enrolled courses
Task progress tracking
GPA Management
GPA Calculator for projections
AI-powered GPA Advisor (Google Gemini)
Course & Task Management
View courses & assigned doctors
Track assignments, exams, projects
Mark tasks as completed
Announcements & Events
Stay updated with university updates
Feedback System
Submit feedback directly to administration
Profile Settings
Edit personal data
Change password
🛠 Admin Features
Admin Dashboard
System-wide statistics (students, courses, doctors)
Academic Management
Add / delete courses
Assign doctors to courses
Content Publishing
Create announcements, events, and tasks
Feedback Management
View and manage student feedback
Automated Notifications
Email alerts triggered on:
New tasks
Announcements
Events
AI-generated email templates (Gemini API)
🤖 AI Capabilities
GPA improvement suggestions
Study strategies & academic advice
Smart email content generation for notifications
🛠 Tech Stack
Frontend
Angular - Modern SPA framework
TypeScript - Type-safe development
TailwindCSS - Utility-first styling
Chart.js - Data visualization
Backend
Node.js - Runtime environment
Express.js - API framework
PostgreSQL - Relational database
Authentication & Security
JWT (Access & Refresh Tokens)
bcrypt.js - Password hashing
Services & Integrations
Google Gemini API - AI features
Nodemailer - Email notifications
Deployment
Frontend → Netlify
Backend → Railway
📦 Installation
Prerequisites
Node.js (v18+)
npm (v10+)
PostgreSQL
Gemini API Key
🔧 Backend Setup
git clone https://github.com/Mohamed-tarek107/Campus-Hub.git
cd Campus-Hub
npm install
Configure .env (inside backend)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

JWT_AccessToken_SECRET=your_secret
JWT_Refresh_SECRET=your_secret

GEMINI_API_KEY=your_api_key

MYMAIL=your_email@gmail.com
APP_PASS=your_app_password

FRONTEND_URL=http://localhost:4200
Run Backend
npm run dev

Server runs on: http://localhost:8080

🎨 Frontend Setup
cd frontend
npm install
npm start

App runs on: http://localhost:4200

🚀 Usage
Getting Started
Register or login
Complete first-time setup (course + doctor selection)
Access dashboard for academic overview
Track tasks and GPA
Use AI advisor for study help
Stay updated via announcements
📁 Project Structure
CampusHub/
├── backend/
│   ├── auth/              # Authentication logic
│   ├── user/              # User management
│   ├── student/           # Student features
│   ├── admin/             # Admin features
│   ├── gpa/               # GPA + AI logic
│   ├── services/          # Email & external services
│   ├── db/                # Database config
│   └── server.js
│
├── frontend/
│   └── src/app/
│       ├── components/
│       │   ├── dashboard/
│       │   ├── courses/
│       │   ├── tasks/
│       │   ├── auth/
│       │   ├── admin/
│       │   └── ai-chat/
│       ├── services/
│       └── models/
│
└── dump.sql
🔐 Security Features
JWT Authentication
Access & Refresh token flow
Token expiration & renewal
Password Protection
bcrypt hashing with salt
API Security
Input validation
Parameterized queries (SQL injection protection)
Email Security
App passwords for SMTP
Secure environment variables
📡 API Endpoints
Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
User
GET /api/user/userInfo
PATCH /api/user/editInfo
PATCH /api/user/changePassword
DELETE /api/user/deleteAccount
Student
GET /api/student/available
POST /api/student/assignDoctors
GET /api/student/viewAllStudentCourses
GET /api/student/viewAllStudenttasks
POST /api/student/markTaskDone/:task_id
POST /api/student/takeFeedback
GPA & AI
GET /api/gpa/aiChat
POST /api/gpa/assginGpa
Admin
POST /api/admin/addCourse
POST /api/admin/addDoctor
POST /api/admin/addEvent
POST /api/admin/addAnnouncment
POST /api/admin/coursedoctor/:id/tasks
GET /api/admin/dashbordStats
GET /api/admin/listFeedbacks
DELETE /api/admin/courses/:id
👤 Author

Mohamed Tarek

<div align="center">

🚀 Built with Angular, Node.js & AI
⭐ Star this repo if you found it useful!

</div>
