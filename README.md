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

### Deploy Backend (Render)
1. Push code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set root directory to `server`
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Add environment variables:
   - `MONGO_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Any secure string
8. Deploy

### Deploy Frontend (Vercel)
1. Push code to GitHub
2. Import repository in Vercel
3. Set root directory to `client`
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variable:
   - `VITE_API_URL` - Your Render backend URL
7. Deploy

### Local Development
```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Start backend (from server directory)
npm run dev

# Start frontend (from client directory)
npm run dev

# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```
