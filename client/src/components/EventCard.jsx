import React from 'react';
import { Calendar, MapPin, Clock, Users, ArrowUpRight, CheckCircle2, Clock3, XCircle } from 'lucide-react';

const categoryColorMap = {
  Hackathon: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Technical: 'bg-sky-50 text-sky-700 border-sky-200',
  Workshop: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cultural: 'bg-rose-50 text-rose-700 border-rose-200',
  Sports: 'bg-amber-50 text-amber-700 border-amber-200',
  Seminar: 'bg-purple-50 text-purple-700 border-purple-200',
  Other: 'bg-slate-50 text-slate-700 border-slate-200'
};

const formatEventDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const EventCard = ({ event, onClick, showStatus = false }) => {
  const categoryBadge = categoryColorMap[event.category] || categoryColorMap.Technical;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-sky-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Badges: Category & Organizer / Approval Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryBadge}`}>
            {event.category}
          </span>

          {showStatus ? (
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                event.status === 'approved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : event.status === 'pending'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {event.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
              {event.status === 'pending' && <Clock3 className="w-3 h-3" />}
              {event.status === 'rejected' && <XCircle className="w-3 h-3" />}
              <span className="capitalize">{event.status}</span>
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[150px]">
              {event.organizerClub || 'College Event'}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors mb-2 line-clamp-1">
          {event.title}
        </h3>

        {/* Key Highlight: Date • Venue (Matching ASCII mockup pattern) */}
        <div className="flex items-center text-sm font-semibold text-sky-800 bg-sky-50/70 border border-sky-100 px-3 py-1.5 rounded-lg mb-3">
          <Calendar className="w-4 h-4 mr-1.5 text-sky-600 shrink-0" />
          <span className="truncate">
            {formatEventDate(event.date)} &bull; {event.venue}
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {event.description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{event.time || '10:00 AM'}</span>
        </div>

        {event.capacity && (
          <div className="flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Capacity: {event.capacity}</span>
          </div>
        )}

        <span className="text-sky-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
          Details <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
        </span>
      </div>
    </div>
  );
};

export default EventCard;
