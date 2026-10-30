import React from 'react';

export function BloodGroupBadge({ group, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-bold',
    md: 'text-sm px-2.5 py-1 font-bold',
    lg: 'text-base px-3.5 py-1.5 font-extrabold',
    xl: 'text-xl px-4 py-2 font-black'
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-sm shadow-rose-900/10 tracking-wide ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      <span className="drop-shadow-xs">{group}</span>
    </span>
  );
}
