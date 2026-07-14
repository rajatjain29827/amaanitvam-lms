import { useState } from 'react';
import api from '../api/axios';

export default function SeedPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSeed = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await api.get('/seed');
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to seed database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Database Setup</h1>
      <p className="text-gray-600 mb-8">
        Click the button below to populate the database with sample courses, lessons, quizzes, and demo accounts.
      </p>

      <button
        onClick={handleSeed}
        disabled={loading}
        className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50"
      >
        {loading ? 'Seeding...' : 'Seed Demo Data'}
      </button>

      {error && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-800 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 p-6 rounded-lg text-left">
          <p className="text-green-800 font-semibold mb-3">{result.message}</p>
          <div className="space-y-2 text-sm">
            <p className="font-medium">Demo Accounts:</p>
            {Object.entries(result.accounts).map(([role, creds]) => (
              <div key={role} className="bg-white p-2 rounded">
                <span className="capitalize font-medium">{role}:</span> {creds.email} / {creds.password}
              </div>
            ))}
            <p className="font-medium mt-3">Stats:</p>
            <p>{result.stats.users} users, {result.stats.courses} courses, {result.stats.lessons} lessons, {result.stats.quizzes} quizzes</p>
          </div>
        </div>
      )}
    </div>
  );
}
