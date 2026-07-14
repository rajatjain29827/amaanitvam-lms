import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/my')
      .then(({ data }) => setEnrollments(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const progressMap = {};
  enrollments.forEach((enrollment) => {
    progressMap[enrollment.course._id] = enrollment;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, {user?.name}!</p>

      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-primary-600">{enrollments.length}</p>
            <p className="text-sm text-gray-600">Enrolled Courses</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {enrollments.filter((e) => e.completed).length}
            </p>
            <p className="text-sm text-gray-600">Completed Courses</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{user?.role}</p>
            <p className="text-sm text-gray-600">Account Role</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">My Courses</h2>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border">
          <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
          <Link
            to="/courses"
            className="text-primary-600 font-semibold hover:underline"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment._id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-1">{enrollment.course.title}</h3>
                <p className="text-sm text-gray-500 mb-3">by {enrollment.course.instructor?.name}</p>
                {enrollment.completed && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                    Completed
                  </span>
                )}
                <Link
                  to={`/courses/${enrollment.course._id}`}
                  className="mt-3 inline-block text-sm text-primary-600 hover:underline"
                >
                  Go to Course →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {user?.role === 'instructor' && (
        <div className="mt-10 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">Instructor Tools</h2>
          <Link
            to="/admin"
            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            Manage Courses
          </Link>
        </div>
      )}
    </div>
  );
}
