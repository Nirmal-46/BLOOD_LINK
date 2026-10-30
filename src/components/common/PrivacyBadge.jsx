import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export function PrivacyBadge({ text = 'Consent Protected', variant = 'shield', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80 ${className}`}
      title="Personal contact details are withheld until explicit mutual consent"
    >
      {variant === 'shield' ? (
        <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
      ) : (
        <Lock className="w-3 h-3 text-slate-500" />
      )}
      <span>{text}</span>
    </span>
  );
}
