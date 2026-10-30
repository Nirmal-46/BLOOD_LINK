import React from 'react';
import { Bell, Heart, ShieldCheck, CheckCircle2, AlertTriangle, Flame } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

export function NotificationItem({ notification, onMarkRead }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'request':
        return <Flame className="w-4 h-4 text-rose-600" />;
      case 'consent':
        return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
      case 'match':
        return <Heart className="w-4 h-4 text-emerald-600" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-teal-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const getBgClass = () => {
    switch (notification.type) {
      case 'request':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'consent':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'match':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'success':
        return 'bg-teal-50 text-teal-600 border-teal-100';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div
      onClick={() => onMarkRead && onMarkRead(notification.id)}
      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
        notification.read
          ? 'bg-white border-slate-100 hover:border-slate-200 opacity-80'
          : 'bg-rose-50/20 border-rose-200/60 shadow-xs hover:border-rose-300'
      }`}
    >
      <div className={`p-2.5 rounded-xl border flex-shrink-0 ${getBgClass()}`}>
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="text-xs font-bold text-slate-900 truncate">
            {notification.title}
          </h4>
          <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {notification.message}
        </p>

        {notification.requestId && (
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
              {notification.requestId}
            </span>
            {!notification.read && (
              <span className="text-[10px] font-bold text-rose-600">● Unread</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
