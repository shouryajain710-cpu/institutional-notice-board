import React from 'react';
import { X, Calendar, Building, Pin, Share2, Printer, AlertTriangle } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const NoticeModal = ({ notice, onClose }) => {
  if (!notice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Notice link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
              {notice.category} Notice
            </span>
            {notice.isPinned && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center">
                <Pin className="w-3 h-3 mr-1" /> Pinned
              </span>
            )}
            {notice.priority === 'urgent' && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" /> Urgent
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <div className="text-xs font-mono text-slate-400 mb-1">
            Ref: {notice.referenceNumber || 'CIR/INST/2026'}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
            {notice.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-4 mb-5 border-b border-slate-100">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-slate-400" />
              <span>Published: {formatDate(notice.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Building className="w-4 h-4 mr-1 text-slate-400" />
              <span>Issued By: {notice.department || 'Administration'}</span>
            </div>
            <div className="text-slate-500">
              Audience: <b className="text-slate-700">{notice.targetAudience || 'All'}</b>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {notice.content}
          </div>

          {notice.attachmentUrl && (
            <div className="mt-6 p-4 bg-sky-50 rounded-xl border border-sky-100 flex items-center justify-between">
              <span className="text-xs font-medium text-sky-800">
                Official Attachment / Link Available
              </span>
              <a
                href={notice.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-sky-700 hover:underline"
              >
                View Attachment &rarr;
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeModal;
