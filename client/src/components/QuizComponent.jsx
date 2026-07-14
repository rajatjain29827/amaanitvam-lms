import { useState } from 'react';
import api from '../api/axios';

export default function QuizComponent({ quiz, courseId }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAnswer = (questionIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const answerArray = quiz.questions.map((_, i) =>
        answers[i] !== undefined ? answers[i] : -1
      );
      const { data } = await api.post(
        `/courses/${courseId}/quizzes/${quiz._id}/attempt`,
        { answers: answerArray }
      );
      setResult(data);
    } catch (err) {
      console.error('Quiz submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className={`p-6 rounded-xl ${result.passed ? 'bg-green-50' : 'bg-red-50'}`}>
        <h3 className="text-xl font-bold mb-2">Quiz Result</h3>
        <p className="text-lg">
          Score: <strong>{result.score}</strong> / {result.total}
        </p>
        <p className="text-lg">
          Percentage: <strong>{Math.round((result.score / result.total) * 100)}%</strong>
        </p>
        <p className={`text-lg font-semibold mt-2 ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
          {result.passed ? 'Passed!' : 'Failed'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold">{quiz.title}</h3>
      {quiz.questions.map((q, qIdx) => (
        <div key={qIdx} className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-3">
            {qIdx + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((option, oIdx) => (
              <label
                key={oIdx}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                  answers[qIdx] === oIdx
                    ? 'bg-primary-100 border border-primary-400'
                    : 'bg-white border border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="radio"
                  name={`q-${qIdx}`}
                  checked={answers[qIdx] === oIdx}
                  onChange={() => handleAnswer(qIdx, oIdx)}
                  className="accent-primary-600"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        type="submit"
        disabled={submitting || Object.keys(answers).length < quiz.questions.length}
        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Quiz'}
      </button>
    </form>
  );
}
