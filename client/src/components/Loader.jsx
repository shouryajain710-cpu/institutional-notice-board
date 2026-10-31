import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-sky-600`} />
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 bg-slate-200 rounded-full w-24"></div>
        <div className="h-4 bg-slate-200 rounded w-20"></div>
      </div>
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
      </div>
      <div className="h-8 bg-slate-100 rounded w-full"></div>
    </div>
  );
};

export default Spinner;
