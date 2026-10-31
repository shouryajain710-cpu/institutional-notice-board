import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../services/api';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import ProposeEventModal from '../components/ProposeEventModal';
import { Spinner } from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { Calendar, PlusCircle, Search, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const EVENT_CATEGORIES = [
  'All',
  'Technical',
  'Workshop',
  'Hackathon',
  'Cultural',
  'Sports',
  'Seminar',
  'Webinar'
];

const Events = () => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [upcomingOnly, setUpcomingOnly] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [proposeModalOpen, setProposeModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const loadEvents = async () => {
    try {
      setLoading(true);
      const params = {
        upcomingOnly: upcomingOnly ? 'true' : 'false'
      };
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await fetchEvents(params);
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEvents();
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, upcomingOnly]);

  const handleProposalSuccess = (msg) => {
    setProposeModalOpen(false);
    setSuccessToast(msg || 'Event proposal submitted successfully for admin review!');
    setTimeout(() => setSuccessToast(''), 6000);
    loadEvents();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Success Alert Banner */}
        {successToast && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-800 flex items-center justify-between shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast('')}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-4"
            >
              &times;
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center space-x-2.5">
              <Calendar className="w-7 h-7 text-emerald-600" />
              <span>Institutional & Club Events</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore university hackathons, technical workshops, cultural fests, and guest lectures.
            </p>
          </div>

          {/* Action to Propose Club Event */}
          {isAuthenticated ? (
            <button
              onClick={() => setProposeModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Propose Club Event</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Login to Propose Event</span>
            </Link>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, venue, or organizing club..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={upcomingOnly}
                  onChange={(e) => setUpcomingOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Upcoming Events Only</span>
              </label>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mr-1 shrink-0">
              Track:
            </span>
            {EVENT_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full font-semibold transition-colors shrink-0 ${
                    active
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <Spinner size="lg" className="py-20" />
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No events found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your track filter or unchecking "Upcoming Events Only".
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setUpcomingOnly(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Show All Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onClick={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {proposeModalOpen && (
        <ProposeEventModal
          onClose={() => setProposeModalOpen(false)}
          onSuccess={handleProposalSuccess}
        />
      )}
    </div>
  );
};

export default Events;
