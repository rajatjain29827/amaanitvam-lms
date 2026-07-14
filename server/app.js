import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import User from './models/User.js';
import Course from './models/Course.js';
import Lesson from './models/Lesson.js';
import Enrollment from './models/Enrollment.js';
import Progress from './models/Progress.js';
import Quiz from './models/Quiz.js';
import QuizAttempt from './models/QuizAttempt.js';
import courseRoutes from './routes/courses.js';
import lessonRoutes from './routes/lessons.js';
import enrollmentRoutes from './routes/enrollments.js';
import progressRoutes from './routes/progress.js';
import quizRoutes from './routes/quizzes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LMS API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/courses/:courseId/lessons', lessonRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/courses/:courseId/quizzes', quizRoutes);
app.get('/api/seed', async (req, res) => {
  try {
    await Promise.all([
      User.deleteMany({}), Course.deleteMany({}), Lesson.deleteMany({}),
      Enrollment.deleteMany({}), Progress.deleteMany({}), Quiz.deleteMany({}), QuizAttempt.deleteMany({}),
    ]);
    const admin = await User.create({ name: 'Admin User', email: 'admin@lms.com', password: 'password123', role: 'admin' });
    const instructor = await User.create({ name: 'John Instructor', email: 'instructor@lms.com', password: 'password123', role: 'instructor' });
    const student = await User.create({ name: 'Jane Student', email: 'student@lms.com', password: 'password123', role: 'student' });
    const courses = await Course.insertMany([
      { title: 'Introduction to Web Development', description: 'Learn HTML, CSS, and JavaScript fundamentals.', instructor: instructor._id, category: 'Web Development', price: 0, published: true },
      { title: 'Python Programming Masterclass', description: 'Comprehensive Python course from basics to advanced.', instructor: instructor._id, category: 'Programming', price: 49.99, published: true },
      { title: 'Data Science & Machine Learning', description: 'Learn pandas, numpy, matplotlib, and ML models.', instructor: instructor._id, category: 'Data Science', price: 79.99, published: true },
      { title: 'React.js for Beginners', description: 'Master React components, hooks, and state management.', instructor: instructor._id, category: 'Web Development', price: 39.99, published: true },
    ]);
    const lessonData = [];
    courses.forEach(course => { for (let i = 1; i <= 4; i++) { lessonData.push({ course: course._id, title: `${course.title.split(' ').slice(0, 2).join(' ')} - Lesson ${i}`, content: `Lesson ${i} content covering core concepts and practical examples.`, duration: `${10 + i * 5}:00`, order: i }); } });
    await Lesson.insertMany(lessonData);
    const quizData = courses.map(course => ({ course: course._id, title: `${course.title} - Quiz`, questions: [
      { question: 'What is the primary purpose?', options: ['Entertainment', 'Education and skill building', 'Gaming', 'Social networking'], correctAnswer: 1 },
      { question: 'How to approach exercises?', options: ['Skip them', 'Only read', 'Practice hands-on', 'Watch only'], correctAnswer: 2 },
      { question: 'Recommended learning method?', options: ['Cramming', 'Consistent practice', 'Only theory', 'Memorization'], correctAnswer: 1 },
    ] }));
    await Quiz.insertMany(quizData);
    res.json({ message: 'Database seeded!', accounts: { admin: { email: 'admin@lms.com', password: 'password123' }, instructor: { email: 'instructor@lms.com', password: 'password123' }, student: { email: 'student@lms.com', password: 'password123' } }, stats: { users: 3, courses: courses.length, lessons: lessonData.length, quizzes: quizData.length } });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

const frontendPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;
