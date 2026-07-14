import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import QuizComponent from '../components/QuizComponent';

export default function QuizPage() {
  const { courseId, quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/courses/${courseId}/quizzes/${quizId}`)
      .then(({ data }) => setQuiz(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId, quizId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!quiz) {
    return <p className="text-center py-20 text-gray-500">Quiz not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <QuizComponent quiz={quiz} courseId={courseId} />
    </div>
  );
}
