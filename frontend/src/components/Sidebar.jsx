// frontend/src/components/Sidebar.jsx (updated NAV_ITEMS)
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, ShieldCheck, LogOut, ChevronUp, ChevronDown, Mail, BadgeCheck, Fingerprint, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/welcome', label: 'Home', icon: Home },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/licenses', label: 'Licenses', icon: FileText },
  { to: '/policies', label: 'Policies', icon: ShieldCheck },
];

// ... rest of the Sidebar component remains the same

function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

function Sidebar({ onHoverChange }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      className="group fixed left-0 top-0 h-screen z-30 flex flex-col border-r border-gray-200 bg-white
                 w-16 hover:w-64 overflow-hidden transition-all duration-200 ease-in-out
                 shadow-none hover:shadow-xl"
    >
      <div className="h-17 px-5 py-5 border-b border-gray-100 flex items-center shrink-0">
        <h1 className="text-base font-bold text-blue-700 leading-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-75">
          License &amp; Insurance
          <br />
          Tracker
        </h1>
        <span className="text-lg font-bold text-blue-700 absolute left-5 group-hover:opacity-0 transition-opacity duration-100">
          L&amp;I
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              title={label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.4 : 2} className="shrink-0" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-75">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-gray-100">
        {detailsOpen && (
          <div className="mb-2 px-3 py-3 rounded-lg bg-gray-50 border border-gray-100 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-75 whitespace-nowrap">
            <div className="flex items-center gap-2">
              <Fingerprint size={14} className="text-gray-400 shrink-0" />
              <span className="text-[11px] text-gray-500 truncate">{user?._id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-400 shrink-0" />
              <span className="text-xs text-gray-700 truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck size={14} className="text-gray-400 shrink-0" />
              <span className="text-xs text-gray-700">{user?.role}</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setDetailsOpen((v) => !v)}
          title={user?.name}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center shrink-0">
            {initials(user?.name)}
          </div>
          <div className="flex-1 min-w-0 text-left whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-75">
            <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
          {detailsOpen ? (
            <ChevronUp size={16} className="text-gray-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
          ) : (
            <ChevronDown size={16} className="text-gray-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
          )}
        </button>

        <button
          onClick={handleLogout}
          title="Logout"
          className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap"
        >
          <LogOut size={16} className="shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-75">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;