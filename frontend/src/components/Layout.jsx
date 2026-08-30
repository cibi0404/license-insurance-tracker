import { useState } from 'react';
import Sidebar from './Sidebar';

function Layout({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onHoverChange={setSidebarExpanded} />
      <main 
        className={`flex-1 transition-all duration-200 ease-in-out ${
          sidebarExpanded ? 'ml-64' : 'ml-16'
        } p-6`}
      >
        {children}
      </main>
    </div>
  );
}

export default Layout;