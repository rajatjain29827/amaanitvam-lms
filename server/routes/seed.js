import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return res.status(400).json({
        message: 'Database already has data. Clear your MongoDB collection first if you want to re-seed.',
        hint: 'Drop the database from MongoDB Atlas and try again.',
      });
    }

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@lms.com',
      password: 'password123',
      role: 'admin',
    });

    const instructor = await User.create({
      name: 'John Instructor',
      email: 'instructor@lms.com',
      password: 'password123',
      role: 'instructor',
    });

    const student = await User.create({
      name: 'Jane Student',
      email: 'student@lms.com',
      password: 'password123',
      role: 'student',
    });

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

    const lessonData = [];
    courses.forEach((course) => {
      for (let i = 1; i <= 4; i++) {
        lessonData.push({
          course: course._id,
          title: `${course.title.split(' ').slice(0, 2).join(' ')} - Lesson ${i}`,
          content: `This is lesson ${i} of "${course.title}".\n\nIn this lesson, we will cover important concepts and practical examples.\n\nKey topics covered:\n- Core concepts overview\n- Practical examples\n- Hands-on exercises\n- Review and summary`,
          videoUrl: '',
          duration: `${10 + i * 5}:00`,
          order: i,
        });
      }
    });
    await Lesson.insertMany(lessonData);

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
          question: 'Which best describes the main topic?',
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
    await Quiz.insertMany(quizData);

    res.json({
      message: 'Database seeded successfully!',
      accounts: {
        admin: { email: 'admin@lms.com', password: 'password123' },
        instructor: { email: 'instructor@lms.com', password: 'password123' },
        student: { email: 'student@lms.com', password: 'password123' },
      },
      stats: {
        users: 3,
        courses: courses.length,
        lessons: lessonData.length,
        quizzes: quizData.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
