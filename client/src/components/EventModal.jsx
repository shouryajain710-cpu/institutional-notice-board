import React, { useState } from 'react';
import { X, Calendar, MapPin, Clock, Users, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

const formatFullDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const EventModal = ({ event, onClose }) => {
  const [registered, setRegistered] = useState(false);

  if (!event) return null;

  const handleRegister = () => {
    if (event.registrationLink) {
      window.open(event.registrationLink, '_blank');
    } else {
      setRegistered(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Category & Close */}
        <div className="bg-sky-900 text-white px-6 py-5 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-800 border border-sky-700 text-sky-200">
              {event.category} Event
            </span>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-sky-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">{event.title}</h2>
          <p className="text-sky-200 text-xs mt-1">
            Organized by: <b className="text-white">{event.organizerClub || 'College'}</b>
          </p>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
          {/* Key Schedule Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm">
            <div className="flex items-start space-x-2.5">
              <Calendar className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-slate-500 font-medium block">Date</span>
                <span className="font-semibold text-slate-800">{formatFullDate(event.date)}</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <Clock className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-slate-500 font-medium block">Time</span>
                <span className="font-semibold text-slate-800">{event.time || '10:00 AM onwards'}</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 sm:col-span-2">
              <MapPin className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-slate-500 font-medium block">Venue</span>
                <span className="font-semibold text-slate-800">{event.venue}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              About The Event
            </h4>
            <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </div>
          </div>

          {/* Attendance Capacity */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span>Available Capacity: <b>{event.capacity || 100} attendees</b></span>
            </div>
            {event.registeredCount > 0 && (
              <span className="text-emerald-700 font-medium">
                {event.registeredCount} already registered
              </span>
            )}
          </div>

          {/* If reviewed remarks exist */}
          {event.reviewRemarks && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
              <b>Review Remarks:</b> {event.reviewRemarks}
            </div>
          )}

          {registered && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You have registered for this event! A confirmation email has been logged.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            Close
          </button>

          <button
            onClick={handleRegister}
            disabled={registered}
            className={`flex items-center space-x-1.5 px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
              registered
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-sky-700 text-white hover:bg-sky-800'
            }`}
          >
            {registered ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Registered</span>
              </>
            ) : (
              <>
                <span>Register Now</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
