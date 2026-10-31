import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogIn, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-700 text-white shadow-md mb-3">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Sign in to College Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access notices, event approvals, and institutional circulars
          </p>
        </div>

        {/* Demo Credentials Helper Box */}
        <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Click Test Credentials</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin@college.edu', 'Admin@123')}
              className="px-2 py-1.5 bg-white hover:bg-sky-50 border border-slate-200 rounded-lg text-left transition-colors shadow-2xs"
            >
              <div className="text-[11px] font-bold text-red-700">Admin</div>
              <div className="text-[10px] text-slate-400 truncate">Dean Office</div>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('club@college.edu', 'Club@123')}
              className="px-2 py-1.5 bg-white hover:bg-sky-50 border border-slate-200 rounded-lg text-left transition-colors shadow-2xs"
            >
              <div className="text-[11px] font-bold text-purple-700">Club Lead</div>
              <div className="text-[10px] text-slate-400 truncate">ACM Society</div>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('student@college.edu', 'Student@123')}
              className="px-2 py-1.5 bg-white hover:bg-sky-50 border border-slate-200 rounded-lg text-left transition-colors shadow-2xs"
            >
              <div className="text-[11px] font-bold text-blue-700">Student</div>
              <div className="text-[10px] text-slate-400 truncate">IT Dept</div>
            </button>
          </div>
        </div>

        {/* Main Login Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center space-x-2 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-sky-700 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
