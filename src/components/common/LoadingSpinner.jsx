import React from 'react';

export function LoadingSpinner({ text = 'Loading data...', size = 'md', className = '' }) {
  const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';

  return (
    <div className={`flex flex-col items-center justify-center p-8 gap-3 ${className}`}>
      <div
        className={`${sizeClass} border-3 border-rose-200 border-t-rose-600 rounded-full animate-spin`}
      />
      {text && <p className="text-xs font-semibold text-slate-500 tracking-wide">{text}</p>}
    </div>
  );
}
