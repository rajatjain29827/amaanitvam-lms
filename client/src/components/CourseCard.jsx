import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
          {course.category}
        </span>
        <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2">
          {course.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          by {course.instructor?.name || 'Unknown'}
        </p>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {course.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </span>
          <Link
            to={`/courses/${course._id}`}
            className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
}
