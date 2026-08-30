import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Pencil, Trash2, Eye } from 'lucide-react';

function Licenses() {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [viewingLicense, setViewingLicense] = useState(null);

  const emptyForm = {
    licenseType: '',
    licenseNumber: '',
    issuingAuthority: '',
    issueDate: '',
    expiryDate: '',
  };
  const [formData, setFormData] = useState(emptyForm);

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
      if (editingId) {
        await api.put(`/licenses/${editingId}`, formData);
      } else {
        await api.post('/licenses', formData);
      }
      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchLicenses();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save license.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (license) => {
    setEditingId(license._id);
    setFormData({
      licenseType: license.licenseType || '',
      licenseNumber: license.licenseNumber || '',
      issuingAuthority: license.issuingAuthority || '',
      issueDate: license.issueDate ? license.issueDate.slice(0, 10) : '',
      expiryDate: license.expiryDate ? license.expiryDate.slice(0, 10) : '',
    });
    setShowForm(true);
  };
  const handleView = (license) => {
    setViewingLicense(license);
  };
  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setFormError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this license?')) return;

    try {
      await api.delete(`/licenses/${id}`);
      fetchLicenses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete license.');
    }
  };

  const canDelete = user?.role === 'Admin' || user?.role === 'Manager';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 px-6 py-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Licenses</h2>
          <button
            onClick={() => (showForm ? handleCancel() : setShowForm(true))}
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
            <h3 className="col-span-2 font-semibold text-gray-700">
              {editingId ? 'Edit License' : 'New License'}
            </h3>

            {formError && (
              <div className="col-span-2 bg-red-50 text-red-600 text-sm px-4 py-2 rounded">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Authority</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editingId ? 'Update License' : 'Save License'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {viewingLicense && (
  <div className="bg-white rounded-lg shadow p-6 mb-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-gray-700">License Details</h3>
      <button
        onClick={() => setViewingLicense(null)}
        className="text-gray-400 hover:text-gray-600 text-sm"
      >
        Close
      </button>
    </div>
    <div className="grid grid-cols-2 gap-3 text-sm">
      <p><span className="text-gray-500">Type:</span> {viewingLicense.licenseType}</p>
      <p><span className="text-gray-500">Number:</span> {viewingLicense.licenseNumber}</p>
      <p><span className="text-gray-500">Issuing Authority:</span> {viewingLicense.issuingAuthority || '—'}</p>
      <p><span className="text-gray-500">Holder:</span> {viewingLicense.holder?.name}</p>
      <p><span className="text-gray-500">Issue Date:</span> {new Date(viewingLicense.issueDate).toLocaleDateString()}</p>
      <p><span className="text-gray-500">Expiry Date:</span> {new Date(viewingLicense.expiryDate).toLocaleDateString()}</p>
      <p><span className="text-gray-500">Status:</span> {viewingLicense.status}</p>
    </div>
  </div>
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
                  <th className="px-4 py-3">Actions</th>
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
                    <td className="px-4 py-3 flex gap-3">
  <button
    onClick={() => handleView(license)}
    className="text-gray-500 hover:text-blue-600"
    title="View"
  >
    <Eye size={16} />
  </button> 
  <button
    onClick={() => handleEdit(license)}
    className="text-gray-500 hover:text-blue-600"
    title="Edit"
  >
    <Pencil size={16} />
  </button>
  {canDelete && (
    <button
      onClick={() => handleDelete(license._id)}
      className="text-gray-500 hover:text-red-600"
      title="Delete"
    >
      <Trash2 size={16} />
    </button>
  )}
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