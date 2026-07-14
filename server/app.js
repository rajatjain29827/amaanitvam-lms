import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import lessonRoutes from './routes/lessons.js';
import enrollmentRoutes from './routes/enrollments.js';
import progressRoutes from './routes/progress.js';
import quizRoutes from './routes/quizzes.js';
import seedRoutes from './routes/seed.js';

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
app.use('/api/seed', seedRoutes);

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
