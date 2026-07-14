import express from 'express';
import Progress from '../models/Progress.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:courseId', protect, async (req, res) => {
  try {
    const progress = await Progress.find({
      student: req.user._id,
      course: req.params.courseId,
    });
    const lessons = await Lesson.find({ course: req.params.courseId }).sort('order');
    const completedCount = progress.filter(p => p.completed).length;
    const totalCount = lessons.length;
    res.json({
      progress,
      completedCount,
      totalCount,
      percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { lessonId, courseId } = req.body;
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrollment) {
      return res.status(400).json({ message: 'Not enrolled in this course' });
    }
    const existing = await Progress.findOne({ student: req.user._id, lesson: lessonId });
    if (existing) {
      return res.json(existing);
    }
    const progress = await Progress.create({
      student: req.user._id,
      lesson: lessonId,
      course: courseId,
    });
    const allLessons = await Lesson.find({ course: courseId }).sort('order');
    const completedLessons = await Progress.find({ student: req.user._id, course: courseId });
    if (completedLessons.length === allLessons.length) {
      enrollment.completed = true;
      await enrollment.save();
    }
    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
