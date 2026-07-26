import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

function Licenses() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    licenseType: '',
    licenseNumber: '',
    issuingAuthority: '',
    issueDate: '',
    expiryDate: '',
  });

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const res = await api.get('/licenses');
      setLicenses(res.data);
    } catch (err) {
      setError('Failed to load licenses.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      await api.post('/licenses', formData);
      setFormData({
        licenseType: '',
        licenseNumber: '',
        issuingAuthority: '',
        issueDate: '',
        expiryDate: '',
      });
      setShowForm(false);
      fetchLicenses();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add license.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Licenses</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ Add License'}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-2 gap-4"
          >
            {formError && (
              <div className="col-span-2 bg-red-50 text-red-600 text-sm px-4 py-2 rounded">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Type
              </label>
              <input
                name="licenseType"
                value={formData.licenseType}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="e.g. Driving License"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number
              </label>
              <input
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="e.g. DL12345"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issuing Authority
              </label>
              <input
                name="issuingAuthority"
                value={formData.issuingAuthority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="e.g. RTO Chennai"
              />
            </div>

            <div></div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save License'}
              </button>
            </div>
          </form>
        )}

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && licenses.length === 0 && (
          <p className="text-gray-500">No licenses found.</p>
        )}

        {!loading && licenses.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Number</th>
                  <th className="px-4 py-3">Holder</th>
                  <th className="px-4 py-3">Expiry Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((license) => (
                  <tr key={license._id} className="border-t">
                    <td className="px-4 py-3">{license.licenseType}</td>
                    <td className="px-4 py-3">{license.licenseNumber}</td>
                    <td className="px-4 py-3">{license.holder?.name}</td>
                    <td className="px-4 py-3">
                      {new Date(license.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                        {license.status}
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

export default Licenses;