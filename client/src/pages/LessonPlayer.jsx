import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import QuizComponent from '../components/QuizComponent';

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonRes, lessonsRes, quizRes] = await Promise.all([
          api.get(`/courses/${courseId}/lessons/${lessonId}`),
          api.get(`/courses/${courseId}/lessons`),
          api.get(`/courses/${courseId}/quizzes`),
        ]);
        setLesson(lessonRes.data);
        setLessons(lessonsRes.data);
        setQuizzes(quizRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, lessonId]);

  const handleComplete = async () => {
    setMarking(true);
    try {
      await api.post('/progress', { lessonId, courseId });
    } catch (err) {
      console.error(err);
    } finally {
      setMarking(false);
    }
  };

  const currentIndex = lessons.findIndex((l) => l._id === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!lesson) {
    return <p className="text-center py-20 text-gray-500">Lesson not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to={`/courses/${courseId}`} className="text-primary-600 hover:underline text-sm">
        ← Back to Course
      </Link>

      <h1 className="text-2xl font-bold mt-4">{lesson.title}</h1>

      {lesson.videoUrl && (
        <div className="mt-6 aspect-video bg-black rounded-xl overflow-hidden">
          <iframe
            src={lesson.videoUrl.replace('watch?v=', 'embed/')}
            title={lesson.title}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      )}

      {lesson.content && (
        <div className="mt-6 prose max-w-none">
          <h2 className="text-lg font-semibold mb-2">Lesson Content</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            {lesson.content.split('\n').map((line, i) => (
              <p key={i} className="mb-2 text-gray-700">{line}</p>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-4">
        {prevLesson && (
          <Link
            to={`/courses/${courseId}/lessons/${prevLesson._id}`}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            ← Previous
          </Link>
        )}
        <button
          onClick={handleComplete}
          disabled={marking}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50"
        >
          {marking ? 'Saving...' : 'Mark as Complete'}
        </button>
        {nextLesson && (
          <Link
            to={`/courses/${courseId}/lessons/${nextLesson._id}`}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm"
          >
            Next →
          </Link>
        )}
      </div>

      {quizzes.length > 0 && (
        <div className="mt-10 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">Course Quizzes</h2>
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white p-6 rounded-xl shadow-sm border mb-4">
              <QuizComponent quiz={quiz} courseId={courseId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
