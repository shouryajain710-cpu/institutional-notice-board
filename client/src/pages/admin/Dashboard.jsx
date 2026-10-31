import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminStats, fetchEvents, reviewEventApi } from '../../services/api';
import { Spinner } from '../../components/Loader';
import {
  Bell,
  Calendar,
  Clock3,
  Users,
  Plus,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes] = await Promise.all([
        fetchAdminStats(),
        fetchEvents({ status: 'pending' })
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (pendingRes.data.success) {
        setPendingEvents(pendingRes.data.data);
      }
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleReview = async (eventId, action) => {
    const promptRemarks =
      action === 'rejected'
        ? window.prompt('Provide rejection feedback / reason to club organizer:', 'Requires venue rescheduling')
        : 'Approved by Administration';

    if (action === 'rejected' && promptRemarks === null) {
      return; // Cancelled
    }

    try {
      setReviewingId(eventId);
      const res = await reviewEventApi(eventId, {
        action,
        remarks: promptRemarks
      });

      if (res.data.success) {
        setActionMessage(`Event proposal ${action} successfully!`);
        setTimeout(() => setActionMessage(''), 4000);
        loadDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to review event');
    } finally {
      setReviewingId(null);
    }
  };

  if (loading) {
    return <Spinner size="lg" className="py-24" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Institutional Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage official circulars, campus events, and review club proposals.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2.5">
            <Link
              to="/admin/notices"
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Post Notice</span>
            </Link>

            <Link
              to="/admin/events"
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </Link>
          </div>
        </div>

        {/* Action Message Toast */}
        {actionMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Analytics Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Notices
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {stats?.totalNotices || 0}
              </p>
              <span className="text-[11px] font-medium text-red-600 mt-1 block">
                {stats?.urgentNotices || 0} marked urgent
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Events
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {stats?.approvedEvents || 0}
              </p>
              <span className="text-[11px] font-medium text-emerald-600 mt-1 block">
                Published to portal
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                Pending Approvals
              </p>
              <p className="text-2xl font-black text-amber-900 mt-1">
                {pendingEvents.length}
              </p>
              <span className="text-[11px] font-medium text-amber-700 mt-1 block">
                Requires admin action
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock3 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Registered Users
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {stats?.totalUsers || 0}
              </p>
              <span className="text-[11px] font-medium text-purple-600 mt-1 block">
                {stats?.totalClubs || 0} club leads &bull; {stats?.totalStudents || 0} students
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Club Event Approval Workflow Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Clock3 className="w-5 h-5 text-amber-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Club Event Approval Queue
              </h2>
              {pendingEvents.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  {pendingEvents.length} Pending
                </span>
              )}
            </div>

            <Link
              to="/admin/events"
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center space-x-1"
            >
              <span>Manage all events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingEvents.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs sm:text-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All club submissions have been reviewed. No pending approvals in queue.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingEvents.map((event) => (
                <div
                  key={event._id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        {event.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        Submitted by: <b className="text-slate-700">{event.organizerClub || event.postedByName}</b>
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {event.title}
                    </h3>

                    <p className="text-xs text-slate-600">
                      📅 {new Date(event.date).toLocaleDateString()} &bull; ⏰ {event.time} &bull; 📍 {event.venue}
                    </p>

                    <p className="text-xs text-slate-600 italic line-clamp-2 mt-1">
                      "{event.description}"
                    </p>
                  </div>

                  {/* Approve / Reject Actions */}
                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                    <button
                      onClick={() => handleReview(event._id, 'approved')}
                      disabled={reviewingId === event._id}
                      className="flex items-center space-x-1 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => handleReview(event._id, 'rejected')}
                      disabled={reviewingId === event._id}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Nav Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link
            to="/admin/notices"
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 group-hover:text-sky-700 flex items-center space-x-2">
                <Bell className="w-5 h-5 text-sky-600" />
                <span>Notice Management</span>
              </h3>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-500">
              Create new circulars, publish exam notices, toggle pinned updates, or delete expired memos.
            </p>
          </Link>

          <Link
            to="/admin/events"
            className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Event & Club Proposals</span>
              </h3>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-500">
              Publish official institutional events, monitor registrations, and process club submission workflows.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
