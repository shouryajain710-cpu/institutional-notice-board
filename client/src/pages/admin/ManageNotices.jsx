import React, { useState, useEffect } from 'react';
import {
  fetchNotices,
  createNoticeApi,
  updateNoticeApi,
  deleteNoticeApi,
  togglePinNoticeApi
} from '../../services/api';
import { Spinner } from '../../components/Loader';
import {
  Plus,
  Trash2,
  Edit2,
  Pin,
  Search,
  CheckCircle2,
  X,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [toast, setToast] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'normal',
    isPinned: false,
    targetAudience: 'All',
    department: 'Administration',
    referenceNumber: '',
    attachmentUrl: ''
  });

  const loadNotices = async () => {
    try {
      setLoading(true);
      const res = await fetchNotices({ limit: 100 });
      if (res.data.success) {
        setNotices(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const openCreateModal = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      content: '',
      category: 'General',
      priority: 'normal',
      isPinned: false,
      targetAudience: 'All',
      department: 'Administration',
      referenceNumber: `NOT-${Date.now().toString().slice(-5)}`,
      attachmentUrl: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      priority: notice.priority,
      isPinned: notice.isPinned,
      targetAudience: notice.targetAudience,
      department: notice.department,
      referenceNumber: notice.referenceNumber || '',
      attachmentUrl: notice.attachmentUrl || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNotice) {
        await updateNoticeApi(editingNotice._id, formData);
        setToast('Notice updated successfully');
      } else {
        await createNoticeApi(formData);
        setToast('New notice published successfully');
      }
      setModalOpen(false);
      loadNotices();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving notice');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this notice?')) return;
    try {
      await deleteNoticeApi(id);
      setToast('Notice deleted successfully');
      loadNotices();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert('Failed to delete notice');
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await togglePinNoticeApi(id);
      loadNotices();
    } catch (err) {
      alert('Failed to toggle pin');
    }
  };

  const filteredNotices = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl font-black text-slate-900">Manage Notices & Circulars</h1>
            <p className="text-xs text-slate-500">
              Create official notices, toggle pinned advisories, or edit existing posts.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center space-x-1.5 px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Notice</span>
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toast}</span>
          </div>
        )}

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter notices by title, category, or department..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Notice Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <Spinner size="lg" className="py-16" />
          ) : filteredNotices.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">No notices found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Pin</th>
                    <th className="py-3.5 px-4">Title & Ref</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Audience</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredNotices.map((notice) => (
                    <tr key={notice._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePin(notice._id)}
                          className={`p-1.5 rounded-md transition-colors ${
                            notice.isPinned
                              ? 'bg-amber-100 text-amber-800'
                              : 'text-slate-300 hover:text-slate-600'
                          }`}
                          title={notice.isPinned ? 'Pinned notice (Click to unpin)' : 'Click to pin'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 truncate" title={notice.title}>
                          {notice.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {notice.referenceNumber || 'CIR/2026'} &bull; {notice.department}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {notice.category}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            notice.priority === 'urgent'
                              ? 'bg-red-100 text-red-700'
                              : notice.priority === 'high'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {notice.priority}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600">{notice.targetAudience}</td>

                      <td className="py-3 px-4 text-slate-500">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => openEditModal(notice)}
                          className="p-1.5 text-slate-600 hover:text-sky-700 rounded hover:bg-slate-100"
                          title="Edit Notice"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(notice._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                          title="Delete Notice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal to Create / Edit Notice */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                {editingNotice ? 'Edit Notice' : 'Publish New Notice'}
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
                <label className="block font-semibold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. End Semester Examination Schedule - Autumn 2026"
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Examination">Examination</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Academic">Academic</option>
                    <option value="Placement">Placement</option>
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="All">All Campus</option>
                    <option value="Students">Students Only</option>
                    <option value="Faculty">Faculty Only</option>
                    <option value="Final Year">Final Year Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Examination Cell"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Content *</label>
                <textarea
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the complete circular advisory text..."
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ref Code</label>
                  <input
                    type="text"
                    value={formData.referenceNumber}
                    onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                    placeholder="e.g. EXAM/2026/089"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Attachment URL</label>
                  <input
                    type="url"
                    value={formData.attachmentUrl}
                    onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="isPinned" className="font-semibold text-slate-700 cursor-pointer">
                  Pin this notice to the top of the board
                </label>
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
                  className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-bold"
                >
                  {editingNotice ? 'Update Notice' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageNotices;
