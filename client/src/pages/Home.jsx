import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchNotices, fetchEvents } from '../services/api';
import NoticeCard from '../components/NoticeCard';
import EventCard from '../components/EventCard';
import NoticeModal from '../components/NoticeModal';
import EventModal from '../components/EventModal';
import { Spinner } from '../components/Loader';
import { Bell, Calendar, ArrowRight, ShieldCheck, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

const Home = () => {
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [noticesRes, eventsRes] = await Promise.all([
          fetchNotices({ limit: 4 }),
          fetchEvents({ limit: 3, upcomingOnly: 'true' })
        ]);

        if (noticesRes.data.success) {
          setNotices(noticesRes.data.data);
        }
        if (eventsRes.data.success) {
          setEvents(eventsRes.data.data);
        }
      } catch (err) {
        console.error('Error loading home feed:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section matching the ASCII diagram header */}
      <section className="bg-gradient-to-b from-sky-900 via-sky-800 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-sky-950/40 relative overflow-hidden">
        {/* Background decorative blur shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-sky-700/60 border border-sky-400/30 text-xs font-semibold text-sky-200 mb-4 tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Official University Communication Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            Institutional Notice Board
          </h1>

          <p className="text-base sm:text-lg text-sky-100/90 max-w-2xl mx-auto font-normal">
            Stay updated with college activities, academic circulars, exam schedules, and club events in real time.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/notices"
              className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-md hover:bg-sky-50 transition-all flex items-center space-x-2"
            >
              <Bell className="w-4 h-4 text-sky-600" />
              <span>Browse All Circulars</span>
            </Link>

            <Link
              to="/events"
              className="px-5 py-2.5 rounded-xl bg-sky-700/80 hover:bg-sky-700 text-white font-semibold text-sm border border-sky-500/40 shadow-sm transition-all flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4 text-sky-200" />
              <span>Upcoming Events</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-12">
        {loading ? (
          <Spinner size="lg" className="py-20" />
        ) : (
          <>
            {/* Latest Notices Section (ASCII Mockup: Exam Notice, Holiday, etc.) */}
            <section>
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-sky-100 text-sky-700 rounded-lg">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Latest Notices
                    </h2>
                    <p className="text-xs text-slate-500">
                      Official administrative notifications, exam schedules, and circulars
                    </p>
                  </div>
                </div>

                <Link
                  to="/notices"
                  className="text-xs sm:text-sm font-semibold text-sky-700 hover:text-sky-800 flex items-center space-x-1 group"
                >
                  <span>View all</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {notices.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                  No notices published at the moment.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {notices.map((notice) => (
                    <NoticeCard
                      key={notice._id}
                      notice={notice}
                      onClick={() => setSelectedNotice(notice)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Upcoming Events Section (ASCII Mockup: Hackathon 2026, 25 September • Seminar Hall) */}
            <section>
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Upcoming Events
                    </h2>
                    <p className="text-xs text-slate-500">
                      Workshops, hackathons, seminars, and campus cultural festivals
                    </p>
                  </div>
                </div>

                <Link
                  to="/events"
                  className="text-xs sm:text-sm font-semibold text-sky-700 hover:text-sky-800 flex items-center space-x-1 group"
                >
                  <span>View all events</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {events.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                  No upcoming events scheduled right now.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      onClick={() => setSelectedEvent(event)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Institutional Information & Quick Links Strip */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Centralized Registry</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Verified communications directly vetted and released by Examination Cell, Registrar, and Deans.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Approval Workflow</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Student clubs and societies submit proposals that undergo review before appearing on the public calendar.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Role-Based Access</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Granular rights for Students, Club Organizers, Faculty, and System Administrators.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Modals */}
      {selectedNotice && (
        <NoticeModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
      )}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 Institutional Event & Notice Board System. All rights reserved.</span>
          <span className="text-slate-400">Authorized Academic Portal</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
