import express from 'express';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Course from '../models/Course.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('course', 'title');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const quiz = await Quiz.create({ ...req.body, course: req.params.courseId });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/attempt', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    const { answers } = req.body;
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });
    const total = quiz.questions.length;
    const passed = score / total >= 0.5;
    const attempt = await QuizAttempt.create({
      student: req.user._id,
      quiz: quiz._id,
      answers,
      score,
      total,
      passed,
    });
    res.json({ attempt, score, total, passed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/attempts', protect, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ quiz: req.params.id, student: req.user._id })
      .sort('-createdAt');
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
