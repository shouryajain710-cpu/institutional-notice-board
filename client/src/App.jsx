import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Notices from './pages/Notices';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import ManageNotices from './pages/admin/ManageNotices';
import ManageEvents from './pages/admin/ManageEvents';
import { useAuth } from './context/AuthContext';
import { Spinner } from './components/Loader';

// Protected Route for Admin area
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <Spinner size="lg" className="min-h-[50vh]" />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-sky-500 selection:text-white">
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* Public & Student Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/notices"
            element={
              <AdminRoute>
                <ManageNotices />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <AdminRoute>
                <ManageEvents />
              </AdminRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
