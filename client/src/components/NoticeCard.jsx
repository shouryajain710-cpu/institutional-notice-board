import React from 'react';
import { Pin, Calendar, Building, Eye, ChevronRight, AlertCircle } from 'lucide-react';

const categoryStyles = {
  Examination: 'bg-rose-50 text-rose-700 border-rose-200',
  Holiday: 'bg-amber-50 text-amber-700 border-amber-200',
  Academic: 'bg-sky-50 text-sky-700 border-sky-200',
  Placement: 'bg-purple-50 text-purple-700 border-purple-200',
  Sports: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cultural: 'bg-pink-50 text-pink-700 border-pink-200',
  General: 'bg-slate-50 text-slate-700 border-slate-200'
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const NoticeCard = ({ notice, onClick, onPinToggle, isAdmin = false }) => {
  const badgeClass = categoryStyles[notice.category] || categoryStyles.General;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-xl border transition-all duration-200 hover:shadow-md hover:border-sky-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
        notice.isPinned
          ? 'border-sky-300 ring-1 ring-sky-100 bg-gradient-to-b from-sky-50/30 to-white'
          : 'border-slate-200'
      }`}
    >
      {/* Pinned Accent Header Banner */}
      {notice.isPinned && (
        <div className="bg-sky-600 text-white text-[11px] font-semibold px-3 py-1 flex items-center space-x-1.5">
          <Pin className="w-3 h-3 rotate-45" />
          <span>PINNED NOTICE</span>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {/* Category & Date Header */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeClass}`}
          >
            {notice.category} Notice
          </span>

          <div className="flex items-center text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span>{formatDate(notice.createdAt)}</span>
          </div>
        </div>

        {/* Priority Banner (Urgent/High) */}
        {notice.priority === 'urgent' && (
          <div className="mb-2 flex items-center space-x-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md w-fit">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Urgent Circular</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2 mb-2">
          {notice.title}
        </h3>

        {/* Snippet */}
        <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
          {notice.content}
        </p>

        {/* Footer Meta: Department & View Count */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1 truncate max-w-[180px]" title={notice.department}>
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{notice.department || 'General'}</span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {notice.viewCount > 0 && (
              <span className="flex items-center text-slate-400">
                <Eye className="w-3.5 h-3.5 mr-1" />
                {notice.viewCount}
              </span>
            )}
            <span className="text-sky-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              Read <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeCard;
