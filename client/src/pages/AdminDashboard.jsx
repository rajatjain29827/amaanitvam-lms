import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', price: 0, published: false });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cRes] = await Promise.all([
          api.get('/courses?all=true'),
        ]);
        setCourses(cRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleEdit = (course) => {
    setEditing(course._id);
    setForm({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
      published: course.published,
    });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditing(null);
    setForm({ title: '', description: '', category: '', price: 0, published: false });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const { data } = await api.put(`/courses/${editing}`, form);
        setCourses((prev) => prev.map((c) => (c._id === editing ? data : c)));
      } else {
        const { data } = await api.post('/courses', form);
        setCourses((prev) => [data, ...prev]);
      }
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePublish = async (course) => {
    try {
      const { data } = await api.put(`/courses/${course._id}`, {
        published: !course.published,
      });
      setCourses((prev) => prev.map((c) => (c._id === course._id ? data : c)));
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage courses and users</p>

      <button
        onClick={handleNew}
        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition mb-6"
      >
        + Create New Course
      </button>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border mb-8">
          <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Course' : 'New Course'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" placeholder="Course Title" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <textarea name="description" placeholder="Description" required rows={3} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <div className="grid grid-cols-3 gap-4">
              <input name="category" placeholder="Category" required value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input name="price" type="number" placeholder="Price (0 = Free)" value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                Published
              </label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
                {editing ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-semibold text-sm">Title</th>
              <th className="text-left p-4 font-semibold text-sm">Category</th>
              <th className="text-left p-4 font-semibold text-sm">Price</th>
              <th className="text-left p-4 font-semibold text-sm">Status</th>
              <th className="text-left p-4 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {courses.map((course) => (
              <tr key={course._id}>
                <td className="p-4 font-medium">{course.title}</td>
                <td className="p-4 text-sm text-gray-600">{course.category}</td>
                <td className="p-4 text-sm">{course.price === 0 ? 'Free' : `$${course.price}`}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleTogglePublish(course)}
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      course.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {course.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="p-4">
                  <button onClick={() => handleEdit(course)}
                    className="text-sm text-primary-600 hover:underline mr-3">Edit</button>
                  <button onClick={() => handleDelete(course._id)}
                    className="text-sm text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
