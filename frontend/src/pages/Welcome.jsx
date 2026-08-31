// frontend/src/pages/Welcome.jsx
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, ShieldCheck, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Welcome() {
  const { user } = useAuth();

  // Sample stats - replace with real data from your API
  const stats = [
    { label: 'Active Licenses', value: 2, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Expiring Soon', value: 0, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Pending Verification', value: 0, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const quickActions = [
    { to: '/dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, description: 'View all your records at a glance', color: 'blue' },
    { to: '/licenses', label: 'Manage Licenses', icon: FileText, description: 'View and manage your licenses', color: 'purple' },
    { to: '/policies', label: 'Manage Policies', icon: ShieldCheck, description: 'View and manage your insurance policies', color: 'green' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your licenses and insurance policies today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
              purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200',
              green: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200',
            };
            
            return (
              <Link
                key={action.to}
                to={action.to}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${colorClasses[action.color]}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <div>
                    <p className="font-medium">{action.label}</p>
                    <p className="text-xs opacity-75">{action.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity or Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Quick Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Keep your licenses updated to avoid compliance issues</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Review your insurance policies regularly for coverage gaps</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Set reminders for renewal dates to avoid lapses</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">📋 Need Help?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Check your <Link to="/licenses" className="text-blue-600 hover:underline">licenses</Link> for renewal dates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Review your <Link to="/policies" className="text-blue-600 hover:underline">policies</Link> for coverage details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Contact support for any questions or issues</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Welcome;