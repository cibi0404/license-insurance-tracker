import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

function Policies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await api.get('/policies');
      setPolicies(res.data);
    } catch (err) {
      setError('Failed to load policies.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Insurance Policies</h2>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && policies.length === 0 && (
          <p className="text-gray-500">No policies found.</p>
        )}

        {!loading && policies.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Policy Number</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Coverage</th>
                  <th className="px-4 py-3">Expiry Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr key={policy._id} className="border-t">
                    <td className="px-4 py-3">{policy.policyNumber}</td>
                    <td className="px-4 py-3">{policy.provider}</td>
                    <td className="px-4 py-3">{policy.coverageType}</td>
                    <td className="px-4 py-3">
                      {new Date(policy.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                        {policy.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Policies;