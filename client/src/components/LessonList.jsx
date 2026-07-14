import { Link } from 'react-router-dom';

export default function LessonList({ lessons, courseId, completedLessons = [] }) {
  return (
    <div className="space-y-2">
      {lessons.map((lesson, index) => {
        const isCompleted = completedLessons.some(
          (p) => p.lesson === lesson._id && p.completed
        );
        return (
          <Link
            key={lesson._id}
            to={`/courses/${courseId}/lessons/${lesson._id}`}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              isCompleted
                ? 'bg-green-50 hover:bg-green-100'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              {isCompleted ? '✓' : index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {lesson.title}
              </p>
            </div>
            <span className="text-xs text-gray-500">{lesson.duration}</span>
          </Link>
        );
      })}
    </div>
  );
}
