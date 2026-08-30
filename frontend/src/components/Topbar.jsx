import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, FileText, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { to: '/dashboard', label: 'Dashboard', icon: Building2 },
  { to: '/licenses', label: 'Licenses', icon: FileText },
  { to: '/policies', label: 'Policies', icon: ShieldCheck },
];

function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

function TopBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 shrink-0 flex items-center justify-between gap-4 px-5 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
          <ShieldCheck size={18} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-sm leading-none truncate">
              License &amp; Insurance Tracker
            </span>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              LIVE
            </span>
          </div>
          <p className="text-[11px] text-gray-400 tracking-wide uppercase truncate">
            Compliance Management System
          </p>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
        {TABS.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 shrink-0">
        <span className="hidden sm:inline text-xs font-medium text-gray-400 border border-gray-200 rounded-full px-2.5 py-1">
          {user?.role}
        </span>
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
            {initials(user?.name)}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

export default TopBar;