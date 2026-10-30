import React, { useState, useEffect } from 'react';
import { Flame, Mail, X, ArrowRight, ShieldCheck, Volume2 } from 'lucide-react';
import { BloodGroupBadge } from '../common/BloodGroupBadge';

export function PushNotificationBanner({ onOpenEmail }) {
  const [activeAlert, setActiveAlert] = useState(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const handlePushEvent = (e) => {
      const { title, body, timestamp } = e.detail || {};
      setActiveAlert({
        title: title || '🚨 Emergency Blood Request Dispatched',
        body: body || 'Blood requirement alert has been sent to matching donors.',
        timestamp: timestamp || new Date().toISOString()
      });
      setFading(false);

      // Auto dismiss after 7 seconds
      const timeout = setTimeout(() => {
        dismissAlert();
      }, 7000);

      return () => clearTimeout(timeout);
    };

    window.addEventListener('bloodlink:push-alert', handlePushEvent);
    return () => window.removeEventListener('bloodlink:push-alert', handlePushEvent);
  }, []);

  const dismissAlert = () => {
    setFading(true);
    setTimeout(() => {
      setActiveAlert(null);
      setFading(false);
    }, 300);
  };

  if (!activeAlert) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] max-w-md w-[calc(100vw-32px)] bg-slate-900/95 backdrop-blur-md border border-rose-500/50 rounded-2xl p-4 text-white shadow-2xl transition-all duration-300 ${
        fading ? 'opacity-0 translate-y-[-10px]' : 'opacity-100 translate-y-0 animate-in slide-in-from-top-4'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Animated Blood Pulse Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-rose-600/40">
          <Flame className="w-5 h-5 animate-bounce" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400">
                Push & Email Alert
              </span>
            </div>
            <button
              onClick={dismissAlert}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h4 className="text-xs sm:text-sm font-black text-white leading-tight mb-1">
            {activeAlert.title}
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {activeAlert.body}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                dismissAlert();
                if (onOpenEmail) onOpenEmail();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>View Dispatched Email</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={dismissAlert}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
