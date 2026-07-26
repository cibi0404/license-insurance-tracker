import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">Role: {user?.role}</p>
      </div>
    </div>
  );
}

export default Dashboard;