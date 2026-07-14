import express from 'express';
import Enrollment from '../models/Enrollment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (existing) {
      return res.status(400).json({ message: 'Already enrolled' });
    }
    const enrollment = await Enrollment.create({ student: req.user._id, course: courseId });
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name' },
      })
      .sort('-createdAt');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/check/:courseId', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });
    res.json({ enrolled: !!enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:courseId', protect, async (req, res) => {
  try {
    await Enrollment.findOneAndDelete({
      student: req.user._id,
      course: req.params.courseId,
    });
    res.json({ message: 'Unenrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
