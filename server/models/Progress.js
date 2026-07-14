import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completed: { type: Boolean, default: true },
}, { timestamps: true });

progressSchema.index({ student: 1, lesson: 1 }, { unique: true });

export default mongoose.model('Progress', progressSchema);
