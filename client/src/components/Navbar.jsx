import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Bell,
  Calendar,
  ShieldAlert,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleQuickLogin = async (email, password) => {
    try {
      await login(email, password);
      setDemoMenuOpen(false);
      if (email.includes('admin')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Quick login failed:', err);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-lg bg-sky-700 text-white flex items-center justify-center shadow-sm group-hover:bg-sky-800 transition-colors">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors">
                  College Portal
                </span>
                <span className="text-xs text-slate-500 font-medium tracking-wide -mt-1">
                  Institutional Notice & Events
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/notices"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/notices')
                  ? 'bg-sky-50 text-sky-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notices</span>
            </Link>

            <Link
              to="/events"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/events')
                  ? 'bg-sky-50 text-sky-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-amber-50 text-amber-800 font-semibold border border-amber-200'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* Desktop Right Actions (Auth & Quick Switcher) */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1.5 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
                title="Quick switch role for demo"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Demo Roles</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 text-xs"
                  onMouseLeave={() => setDemoMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-slate-400 uppercase tracking-wider font-semibold">
                    1-Click Fast Login
                  </div>
                  <button
                    onClick={() => handleQuickLogin('admin@college.edu', 'Admin@123')}
                    className="w-full text-left px-3 py-2 hover:bg-sky-50 flex items-center justify-between text-slate-800"
                  >
                    <span>🛡️ Login as <b>Admin</b></span>
                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Full</span>
                  </button>
                  <button
                    onClick={() => handleQuickLogin('club@college.edu', 'Club@123')}
                    className="w-full text-left px-3 py-2 hover:bg-sky-50 flex items-center justify-between text-slate-800"
                  >
                    <span>🎯 Login as <b>Club Lead</b></span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Propose</span>
                  </button>
                  <button
                    onClick={() => handleQuickLogin('student@college.edu', 'Student@123')}
                    className="w-full text-left px-3 py-2 hover:bg-sky-50 flex items-center justify-between text-slate-800"
                  >
                    <span>🎓 Login as <b>Student</b></span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">View</span>
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 uppercase">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-sky-700 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-sky-700 hover:bg-sky-800 rounded-lg shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <Link
            to="/notices"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            <Bell className="w-5 h-5 text-sky-600" />
            <span>Notices</span>
          </Link>

          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>Events</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-amber-800 bg-amber-50"
            >
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <div className="pt-3 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-3">
                  <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{user?.name}</div>
                    <div className="text-xs text-slate-500 uppercase">{user?.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-sky-700 border border-sky-700 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-white bg-sky-700 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
