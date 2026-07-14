import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import CourseCard from '../components/CourseCard';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);

  useEffect(() => {
    api.get('/courses')
      .then(({ data }) => setCourses(data.slice(0, 6)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Learn Without Limits
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Amaanitvam Learning Management System — empowering learners with quality education
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/courses"
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              Browse Courses
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Courses</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-500">No courses available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
        {courses.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to="/courses"
              className="text-primary-600 font-semibold hover:text-primary-700"
            >
              View All Courses →
            </Link>
          </div>
        )}
      </section>

      <section className="bg-gray-100 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">First time here?</h2>
          <p className="text-gray-600 mb-6">
            Populate the database with sample courses, lessons, quizzes and demo accounts
            to explore the platform.
          </p>
          <button
            onClick={async () => {
              setSeeding(true);
              setSeedResult(null);
              try {
                const accounts = [
                  { name: 'Admin User', email: 'admin@lms.com', password: 'password123', role: 'admin' },
                  { name: 'John Instructor', email: 'instructor@lms.com', password: 'password123', role: 'instructor' },
                  { name: 'Jane Student', email: 'student@lms.com', password: 'password123', role: 'student' },
                ];
                for (const acc of accounts) {
                  await api.post('/auth/register', acc).catch(() => {});
                }
                const instRes = await api.post('/auth/login', {
                  email: 'instructor@lms.com', password: 'password123',
                });
                const instToken = instRes.data.token;
                const prevToken = localStorage.getItem('token');
                localStorage.setItem('token', instToken);
                const courseData = [
                  { title: 'Introduction to Web Development', description: 'Learn HTML, CSS, and JavaScript fundamentals. Build your first website from scratch.', category: 'Web Development', price: 0, published: true },
                  { title: 'Python Programming Masterclass', description: 'Comprehensive Python course from basics to OOP, APIs, and data structures.', category: 'Programming', price: 49.99, published: true },
                  { title: 'Data Science & Machine Learning', description: 'Learn pandas, numpy, matplotlib, and build ML models with scikit-learn.', category: 'Data Science', price: 79.99, published: true },
                  { title: 'React.js for Beginners', description: 'Master React components, hooks, state management, routing, and real-world apps.', category: 'Web Development', price: 39.99, published: true },
                ];
                const courses = [];
                for (const cd of courseData) {
                  const { data: course } = await api.post('/courses', cd);
                  courses.push(course);
                  for (let i = 1; i <= 4; i++) {
                    await api.post(`/courses/${course._id}/lessons`, {
                      title: `${cd.title.split(' ').slice(0, 2).join(' ')} - Lesson ${i}`,
                      content: `Lesson ${i} of "${cd.title}".\n\nCore concepts overview.\nPractical examples.\nHands-on exercises.`,
                      duration: `${10 + i * 5}:00`,
                    });
                  }
                  await api.post(`/courses/${course._id}/quizzes`, {
                    title: `${cd.title} - Quiz`,
                    questions: [
                      { question: 'What is the primary purpose of this course?', options: ['Entertainment', 'Education and skill building', 'Gaming', 'Social networking'], correctAnswer: 1 },
                      { question: 'How should you approach the exercises?', options: ['Skip them', 'Only read', 'Practice hands-on', 'Watch only'], correctAnswer: 2 },
                      { question: 'What is the recommended learning method?', options: ['Cramming', 'Consistent practice', 'Only theory', 'Memorization'], correctAnswer: 1 },
                    ],
                  });
                }
                if (prevToken) { localStorage.setItem('token', prevToken); } else { localStorage.removeItem('token'); }
                const { data: coursesData } = await api.get('/courses');
                setCourses(coursesData.slice(0, 6));
                setSeedResult({
                  message: 'Demo data created successfully!',
                  accounts: {
                    admin: { email: 'admin@lms.com', password: 'password123' },
                    instructor: { email: 'instructor@lms.com', password: 'password123' },
                    student: { email: 'student@lms.com', password: 'password123' },
                  },
                });
              } catch (err) {
                const msg = err.response?.data?.message || err.message || 'Failed';
                if (msg.includes('already exists')) {
                  setSeedResult({
                    message: 'Demo accounts already exist! Try logging in.',
                    accounts: {
                      admin: { email: 'admin@lms.com', password: 'password123' },
                      instructor: { email: 'instructor@lms.com', password: 'password123' },
                      student: { email: 'student@lms.com', password: 'password123' },
                    },
                  });
                } else {
                  setSeedResult({ error: msg });
                }
              } finally {
                setSeeding(false);
              }
            }}
            disabled={seeding}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50"
          >
            {seeding ? 'Setting up...' : 'Setup Demo Data'}
          </button>

          {seedResult && !seedResult.error && (
            <div className="mt-6 bg-green-50 border border-green-200 p-6 rounded-lg text-left">
              <p className="text-green-800 font-semibold mb-3">{seedResult.message}</p>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Demo Accounts:</p>
                {Object.entries(seedResult.accounts).map(([role, creds]) => (
                  <div key={role} className="bg-white p-2 rounded flex justify-between">
                    <span className="capitalize font-medium">{role}:</span>
                    <span>{creds.email} / {creds.password}</span>
                  </div>
                ))}
                <p className="mt-3 text-gray-500">
                  <Link to="/login" className="text-primary-600 hover:underline font-medium">Go to Login →</Link>
                </p>
              </div>
            </div>
          )}

          {seedResult?.error && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-800 text-sm">
              {seedResult.error}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
