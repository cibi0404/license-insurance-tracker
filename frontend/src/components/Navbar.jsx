import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <h1 className="text-lg font-bold text-blue-700">License & Insurance Tracker</h1>

      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
          Dashboard
        </Link>
        <Link to="/licenses" className="text-gray-600 hover:text-blue-600">
          Licenses
        </Link>
        <Link to="/policies" className="text-gray-600 hover:text-blue-600">
          Policies
        </Link>

        <div className="flex items-center gap-3 border-l pl-6">
          <span className="text-sm text-gray-700">
            {user?.name} <span className="text-gray-400">({user?.role})</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white text-sm px-3 py-1.5 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;