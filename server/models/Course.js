import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnail: { type: String, default: 'https://via.placeholder.com/640x360?text=Course' },
  category: { type: String, required: true, trim: true },
  price: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
}, { timestamps: true });

courseSchema.virtual('lessonCount', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'course',
  count: true,
});

courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

export default mongoose.model('Course', courseSchema);
