import React from 'react';
import { AlertTriangle, Clock, Flame } from 'lucide-react';
import { URGENCY_LEVELS } from '../../utils/constants';

export function UrgencyBadge({ urgency, className = '' }) {
  const isEmergency = urgency === 'Emergency';
  const isUrgent = urgency === 'Urgent';

  let config = URGENCY_LEVELS.NORMAL;
  if (isEmergency) config = URGENCY_LEVELS.EMERGENCY;
  else if (isUrgent) config = URGENCY_LEVELS.URGENT;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badgeClass} ${className}`}
    >
      {isEmergency && <Flame className="w-3.5 h-3.5 text-rose-600 animate-bounce" />}
      {isUrgent && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
      {!isEmergency && !isUrgent && <Clock className="w-3.5 h-3.5 text-emerald-600" />}
      {urgency}
    </span>
  );
}
