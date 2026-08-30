import { Link, useLocation } from 'react-router-dom';
import { Home, Settings } from 'lucide-react';

// Slim utility rail, far left. This is NOT the page nav (that lives in the
// top TopBar as tabs) -- it mirrors the "always-there" utility icons pattern
// (home / settings) seen in dashboard products like this one.
function IconRail() {
  const location = useLocation();
  const isHome = location.pathname === '/dashboard';

  return (
    <aside className="w-16 shrink-0 h-screen sticky top-0 flex flex-col items-center py-4 gap-2 border-r border-gray-200 bg-white">
      <Link
        to="/dashboard"
        title="Dashboard"
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
          isHome ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
        }`}
      >
        <Home size={20} strokeWidth={isHome ? 2.4 : 2} />
      </Link>

      <div className="flex-1" />

      <button
        type="button"
        title="Settings (coming soon)"
        disabled
        className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-300 cursor-not-allowed"
      >
        <Settings size={20} />
      </button>
    </aside>
  );
}

export default IconRail;