# Amaanitvam Learning Management System

A full-featured LMS built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Authentication** - Register/Login with JWT (Student, Instructor, Admin roles)
- **Courses** - Browse, search, and filter courses by category
- **Lessons** - Structured lesson content with video embedding
- **Enrollments** - Enroll in courses, track progress
- **Progress Tracking** - Mark lessons complete, view percentage
- **Quizzes** - Take quizzes, auto-graded results (pass/fail)
- **Admin Dashboard** - Manage courses, toggle publish status
- **Responsive UI** - Built with Tailwind CSS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcrypt |

## Project Structure

```
lms/
├── client/           # React frontend
│   └── src/
│       ├── api/          # Axios configuration
│       ├── components/   # Reusable UI components
│       ├── context/      # Auth context
│       └── pages/        # Route pages
├── server/           # Express backend
│   ├── config/       # Database connection
│   ├── middleware/    # Auth middleware
│   ├── models/       # Mongoose schemas
│   └── routes/       # API endpoints
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - List courses (`?all=true` for all)
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (instructor/admin)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Lessons
- `GET /api/courses/:courseId/lessons` - List lessons
- `GET /api/courses/:courseId/lessons/:id` - Get lesson
- `POST /api/courses/:courseId/lessons` - Add lesson
- `PUT /api/courses/:courseId/lessons/:id` - Update lesson
- `DELETE /api/courses/:courseId/lessons/:id` - Delete lesson

### Enrollments
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/my` - My enrollments
- `GET /api/enrollments/check/:courseId` - Check enrollment
- `DELETE /api/enrollments/:courseId` - Unenroll

### Progress
- `GET /api/progress/:courseId` - Get progress
- `POST /api/progress` - Mark lesson complete

### Quizzes
- `GET /api/courses/:courseId/quizzes` - List quizzes
- `POST /api/courses/:courseId/quizzes` - Create quiz
- `POST /api/courses/:courseId/quizzes/:id/attempt` - Submit attempt
- `GET /api/courses/:courseId/quizzes/:id/attempts` - Get attempts

## Deployment

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Render account (free tier)
- Vercel account (free tier)

### Deploy to Render (Free - Single Service)
1. Push code to GitHub
2. Go to https://render.com → Sign up with GitHub
3. Click **New +** → **Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Name:** `amaanitvam-lms`
   - **Root Directory:** (leave blank - use repo root)
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free
6. Add environment variables:
   - `MONGO_URI` — Your MongoDB Atlas connection string
   - `JWT_SECRET` — Any random string (e.g., `mysecret123`)
7. Click **Deploy Web Service**
8. Wait ~5 minutes for build & deploy
9. Your app is live at `https://amaanitvam-lms.onrender.com`

### Seed Sample Data
After deploying, in Render dashboard → **Shell** tab:
```bash
cd server && node seed.js
```

### Local Development
```bash
# Install dependencies (from root)
cd client && npm install
cd ../server && npm install

# Start backend (from root)
cd server && npm run dev

# Start frontend (from root, separate terminal)
cd client && npm run dev

# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```
