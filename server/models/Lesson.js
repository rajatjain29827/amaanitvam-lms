import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true, trim: true },
  content: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  duration: { type: String, default: '0:00' },
  order: { type: Number, required: true },
}, { timestamps: true });

lessonSchema.index({ course: 1, order: 1 });

export default mongoose.model('Lesson', lessonSchema);
