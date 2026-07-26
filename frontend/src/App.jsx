import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Licenses from './pages/Licenses';
import Policies from './pages/Policies';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/licenses"
            element={
           <ProtectedRoute>
              <Licenses />
           </ProtectedRoute>
                    }
                    />
                    <Route
                      path="/policies"
                      element={
                       <ProtectedRoute>
                          <Policies />
                        </ProtectedRoute>
  }
/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;