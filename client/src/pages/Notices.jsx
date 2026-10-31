import React, { useState, useEffect } from 'react';
import { fetchNotices } from '../services/api';
import NoticeCard from '../components/NoticeCard';
import NoticeModal from '../components/NoticeModal';
import { Spinner } from '../components/Loader';
import { Search, Filter, Bell, AlertCircle, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Examination',
  'Holiday',
  'Academic',
  'Placement',
  'Sports',
  'Cultural',
  'General'
];

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedNotice, setSelectedNotice] = useState(null);

  const loadNotices = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (priorityFilter !== 'All') params.priority = priorityFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await fetchNotices(params);
      if (res.data.success) {
        setNotices(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search query changes
    const timer = setTimeout(() => {
      loadNotices();
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedCategory, priorityFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center space-x-2.5">
              <Bell className="w-7 h-7 text-sky-600" />
              <span>Institutional Notices & Circulars</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse official circulars, examination advisories, holiday decrees, and departmental memos.
            </p>
          </div>

          <button
            onClick={loadNotices}
            className="self-start md:self-auto flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          {/* Top row: Search input & Priority filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search circulars by keyword, reference code, or department..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="All">All Priorities</option>
                <option value="urgent">Urgent Only</option>
                <option value="high">High Priority</option>
                <option value="normal">Normal</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mr-1 shrink-0">
              Categories:
            </span>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full font-semibold transition-colors shrink-0 ${
                    active
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notices Grid */}
        {loading ? (
          <Spinner size="lg" className="py-20" />
        ) : notices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No matching notices found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your category filter or search query keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setPriorityFilter('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold text-sky-700 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {notices.map((notice) => (
              <NoticeCard
                key={notice._id}
                notice={notice}
                onClick={() => setSelectedNotice(notice)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <NoticeModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}
    </div>
  );
};

export default Notices;
