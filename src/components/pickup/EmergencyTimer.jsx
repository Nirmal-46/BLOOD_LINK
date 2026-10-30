import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, Flame, ShieldAlert } from 'lucide-react';

export function EmergencyTimer({ initialMinutes = 95, onExpire, urgency = 'Emergency' }) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onExpire]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const pad = (num) => String(num).padStart(2, '0');
  const isUrgent = secondsLeft < 1800; // Under 30 mins
  const isCritical = secondsLeft < 600; // Under 10 mins

  return (
    <div
      className={`inline-flex flex-col sm:flex-row items-center gap-3 p-3.5 sm:px-5 sm:py-2.5 rounded-2xl border transition-all ${
        isCritical
          ? 'bg-rose-950/90 text-white border-rose-600 shadow-lg shadow-rose-900/30'
          : isUrgent
          ? 'bg-amber-50 text-amber-900 border-amber-300'
          : 'bg-slate-900 text-white border-slate-700'
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-xl flex items-center justify-center ${
            isCritical
              ? 'bg-rose-600 text-white animate-pulse'
              : isUrgent
              ? 'bg-amber-500 text-white'
              : 'bg-rose-600/30 text-rose-400 border border-rose-500/30'
          }`}
        >
          {isCritical ? (
            <Flame className="w-4 h-4" />
          ) : isUrgent ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <Clock className="w-4 h-4" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400">
            {isCritical ? 'Critical Triage Window' : isUrgent ? 'Urgent Coordination Required' : 'Emergency Time Window'}
          </span>
          <span className="text-xs font-semibold opacity-80">Blood required in:</span>
        </div>
      </div>

      <div className="flex items-center gap-1 font-mono text-lg sm:text-xl font-black tracking-tight">
        <span className="px-2 py-0.5 rounded-lg bg-black/30 border border-white/10">{pad(hours)}</span>
        <span className="text-rose-400 animate-pulse">:</span>
        <span className="px-2 py-0.5 rounded-lg bg-black/30 border border-white/10">{pad(minutes)}</span>
        <span className="text-rose-400 animate-pulse">:</span>
        <span className="px-2 py-0.5 rounded-lg bg-black/30 border border-white/10">{pad(seconds)}</span>
      </div>
    </div>
  );
}
