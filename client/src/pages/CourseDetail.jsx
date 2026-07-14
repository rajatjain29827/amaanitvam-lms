import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LessonList from '../components/LessonList';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/courses/${id}/lessons`),
        ]);
        setCourse(courseRes.data);
        setLessons(lessonsRes.data);

        if (user) {
          const [enrollRes, progressRes] = await Promise.all([
            api.get(`/enrollments/check/${id}`),
            api.get(`/progress/${id}`),
          ]);
          setEnrolled(enrollRes.data.enrolled);
          setProgress(progressRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleEnroll = async () => {
    try {
      await api.post('/enrollments', { courseId: id });
      setEnrolled(true);
      const { data } = await api.get(`/progress/${id}`);
      setProgress(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!course) {
    return <p className="text-center py-20 text-gray-500">Course not found.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-64 md:h-80 object-cover rounded-xl"
          />
          <h1 className="text-3xl font-bold mt-6">{course.title}</h1>
          <span className="inline-block mt-2 text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded">
            {course.category}
          </span>
          <p className="text-gray-600 mt-2">
            by <strong>{course.instructor?.name}</strong>
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed">{course.description}</p>

          {lessons.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">Course Content ({lessons.length} lessons)</h2>
              <LessonList
                lessons={lessons}
                courseId={id}
                completedLessons={progress?.progress || []}
              />
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md h-fit sticky top-24">
          <p className="text-3xl font-bold text-primary-600 mb-4">
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </p>
          {user ? (
            enrolled ? (
              <div>
                {progress && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{progress.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
                <button
                  onClick={() => navigate(`/courses/${id}/lessons/${lessons[0]?._id}`)}
                  className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  {progress?.completedCount === lessons.length && lessons.length > 0
                    ? 'Review Course'
                    : 'Continue Learning'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Enroll Now
              </button>
            )
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Login to Enroll
            </button>
          )}
          <div className="mt-4 text-sm text-gray-500 space-y-2">
            <p>📚 {lessons.length} Lessons</p>
            <p>👤 Instructor: {course.instructor?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
