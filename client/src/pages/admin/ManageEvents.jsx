import React, { useState, useEffect } from 'react';
import {
  fetchEvents,
  createEventApi,
  updateEventApi,
  deleteEventApi,
  reviewEventApi
} from '../../services/api';
import { Spinner } from '../../components/Loader';
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock3,
  Search,
  X,
  ArrowLeft,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'approved'
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [toast, setToast] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    date: '',
    time: '10:00 AM - 04:00 PM',
    venue: '',
    organizerClub: 'College Administration',
    registrationLink: '',
    capacity: 150
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await fetchEvents({
        status: 'all',
        upcomingOnly: 'false',
        limit: 100
      });
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      category: 'Technical',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '10:00 AM - 04:00 PM',
      venue: '',
      organizerClub: 'College Administration',
      registrationLink: '',
      capacity: 150
    });
    setModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      time: event.time || '10:00 AM',
      venue: event.venue,
      organizerClub: event.organizerClub || 'College Administration',
      registrationLink: event.registrationLink || '',
      capacity: event.capacity || 100
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateEventApi(editingEvent._id, formData);
        setToast('Event updated successfully');
      } else {
        await createEventApi(formData);
        setToast('Event created and published successfully');
      }
      setModalOpen(false);
      loadEvents();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save event');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteEventApi(id);
      setToast('Event deleted successfully');
      loadEvents();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  const handleReview = async (id, action) => {
    let remarks = 'Approved by Administration';
    if (action === 'rejected') {
      remarks = window.prompt('Reason for rejection:', 'Does not adhere to guidelines');
      if (remarks === null) return;
    }

    try {
      await reviewEventApi(id, { action, remarks });
      setToast(`Event proposal ${action}!`);
      loadEvents();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert('Failed to review event');
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.organizerClub && e.organizerClub.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeTab === 'pending') return matchesSearch && e.status === 'pending';
    if (activeTab === 'approved') return matchesSearch && e.status === 'approved';
    return matchesSearch;
  });

  const pendingCount = events.filter((e) => e.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl font-black text-slate-900">Manage Events & Club Proposals</h1>
            <p className="text-xs text-slate-500">
              Schedule official campus events and review club event approval requests.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Institutional Event</span>
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toast}</span>
          </div>
        )}

        {/* Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
          <div className="flex items-center space-x-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Events ({events.length})
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                activeTab === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              <Clock3 className="w-3.5 h-3.5" />
              <span>Club Approvals</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-amber-900 text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('approved')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'approved'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Published ({events.filter((e) => e.status === 'approved').length})
            </button>
          </div>

          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, venue, club..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <Spinner size="lg" className="py-16" />
          ) : filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No events found under this view.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Event & Organizer</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Venue</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions / Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvents.map((event) => (
                    <tr key={event._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 truncate">{event.title}</div>
                        <div className="text-[10px] text-slate-400">
                          {event.organizerClub || 'Admin'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {event.category}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] text-slate-400">{event.time}</div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 truncate max-w-[150px]">
                        {event.venue}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            event.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : event.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {event.status === 'pending' ? (
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleReview(event._id, 'approved')}
                              className="px-2.5 py-1 bg-emerald-700 text-white rounded hover:bg-emerald-800 font-semibold text-[11px] flex items-center space-x-1"
                              title="Approve Event"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleReview(event._id, 'rejected')}
                              className="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded hover:bg-rose-100 font-semibold text-[11px]"
                              title="Reject Event"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => openEditModal(event)}
                              className="p-1.5 text-slate-600 hover:text-sky-700 rounded hover:bg-slate-100"
                              title="Edit Event"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(event._id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal to Create / Edit Event */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                {editingEvent ? 'Edit Event Details' : 'Create Official Institutional Event'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Hackathon 2026 - CodeCraft 36-Hour Hack"
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organizer</label>
                  <input
                    type="text"
                    value={formData.organizerClub}
                    onChange={(e) => setFormData({ ...formData, organizerClub: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time *</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g. 10:00 AM - 04:00 PM"
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Venue *</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. Seminar Hall & Innovation Lab"
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Event details, rules, registration requirements..."
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration URL</label>
                  <input
                    type="url"
                    value={formData.registrationLink}
                    onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold"
                >
                  {editingEvent ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
