import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Course from './models/Course.js';
import Lesson from './models/Lesson.js';
import Quiz from './models/Quiz.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Lesson.deleteMany({}),
      Quiz.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@lms.com',
      password: 'password123',
      role: 'admin',
    });
    console.log('Created admin: admin@lms.com / password123');

    // Create instructor
    const instructor = await User.create({
      name: 'John Instructor',
      email: 'instructor@lms.com',
      password: 'password123',
      role: 'instructor',
    });
    console.log('Created instructor: instructor@lms.com / password123');

    // Create student
    const student = await User.create({
      name: 'Jane Student',
      email: 'student@lms.com',
      password: 'password123',
      role: 'student',
    });
    console.log('Created student: student@lms.com / password123');

    // Create courses
    const courses = await Course.insertMany([
      {
        title: 'Introduction to Web Development',
        description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Build your first website from scratch.',
        instructor: instructor._id,
        category: 'Web Development',
        price: 0,
        published: true,
      },
      {
        title: 'Python Programming Masterclass',
        description: 'Comprehensive Python course covering everything from basics to advanced topics like OOP, APIs, and data structures.',
        instructor: instructor._id,
        category: 'Programming',
        price: 49.99,
        published: true,
      },
      {
        title: 'Data Science & Machine Learning',
        description: 'Dive into data science with Python. Learn pandas, numpy, matplotlib, and build ML models with scikit-learn.',
        instructor: instructor._id,
        category: 'Data Science',
        price: 79.99,
        published: true,
      },
      {
        title: 'React.js for Beginners',
        description: 'Master React.js from the ground up. Components, hooks, state management, routing, and building real-world apps.',
        instructor: instructor._id,
        category: 'Web Development',
        price: 39.99,
        published: true,
      },
    ]);
    console.log(`Created ${courses.length} courses`);

    // Create lessons for each course
    const lessonData = [];
    courses.forEach((course) => {
      for (let i = 1; i <= 4; i++) {
        lessonData.push({
          course: course._id,
          title: `${course.title.split(' ').slice(0, 2).join(' ')} - Lesson ${i}`,
          content: `This is lesson ${i} of "${course.title}".\n\nIn this lesson, we will cover important concepts and practical examples.\n\nMake sure to take notes and practice along with the exercises.\n\nKey topics covered:\n- Core concepts overview\n- Practical examples\n- Hands-on exercises\n- Review and summary`,
          videoUrl: '',
          duration: `${10 + i * 5}:00`,
          order: i,
        });
      }
    });
    const lessons = await Lesson.insertMany(lessonData);
    console.log(`Created ${lessons.length} lessons`);

    // Create quizzes
    const quizData = courses.map((course) => ({
      course: course._id,
      title: `${course.title} - Final Quiz`,
      questions: [
        {
          question: 'What is the primary purpose of this course?',
          options: ['Entertainment', 'Education and skill building', 'Gaming', 'Social networking'],
          correctAnswer: 1,
        },
        {
          question: 'Which of the following best describes the main topic?',
          options: ['Advanced mathematics', 'The subject covered in the course', 'History', 'Geography'],
          correctAnswer: 1,
        },
        {
          question: 'How should you approach the exercises?',
          options: ['Skip them', 'Only read the solutions', 'Practice hands-on', 'Watch without doing'],
          correctAnswer: 2,
        },
        {
          question: 'What is the recommended way to learn?',
          options: ['Cramming', 'Consistent practice', 'Only theory', 'Memorization without understanding'],
          correctAnswer: 1,
        },
      ],
    }));
    const quizzes = await Quiz.insertMany(quizData);
    console.log(`Created ${quizzes.length} quizzes`);

    console.log('\n✅ Seed completed successfully!');
    console.log('\nDemo Accounts:');
    console.log('  Admin:      admin@lms.com / password123');
    console.log('  Instructor: instructor@lms.com / password123');
    console.log('  Student:    student@lms.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
