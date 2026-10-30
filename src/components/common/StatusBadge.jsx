import React from 'react';
import { REQUEST_STATUS } from '../../utils/constants';

export function StatusBadge({ status, className = '' }) {
  const config = Object.values(REQUEST_STATUS).find((s) => s.value === status) || {
    label: status,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide ${config.badgeClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 animate-pulse" />
      {config.label}
    </span>
  );
}
