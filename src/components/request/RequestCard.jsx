import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Droplet, 
  ShieldCheck, 
  Clock, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  AlertCircle
} from 'lucide-react';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { UrgencyBadge } from '../common/UrgencyBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

export function RequestCard({
  request,
  userRole = 'donor',
  onAccept,
  onDecline,
  onStatusChange,
  isMatchingDonor = false
}) {
  const isEmergency = request.urgency === 'Emergency';

  return (
    <div
      className={`glass-card rounded-2xl p-5 border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
        isEmergency
          ? 'border-rose-300 shadow-md shadow-rose-500/5 hover:border-rose-400'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Top emergency pulse stripe if critical */}
      {isEmergency && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-600" />
      )}

      <div>
        {/* Header: Blood Group, ID, Urgency & Status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <BloodGroupBadge group={request.bloodGroup} size="lg" className="shadow-sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-500">{request.id}</span>
                <UrgencyBadge urgency={request.urgency} />
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">
                {request.units} {request.units > 1 ? 'Units' : 'Unit'} Required
              </div>
            </div>
          </div>

          <StatusBadge status={request.status} />
        </div>

        {/* Hospital & Location */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-xs font-bold text-slate-800">
            <Building2 className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{request.hospitalName}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{request.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>Needed: {formatDate(request.requiredDate)}</span>
            </div>
          </div>
        </div>

        {/* Clinical Note / Purpose */}
        {request.purpose && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-4 leading-relaxed">
            <span className="font-semibold text-slate-700">Clinical Purpose: </span>
            {request.purpose}
          </div>
        )}

        {/* Consent & Privacy Status Pill */}
        <div className="flex items-center justify-between text-[11px] py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-100 mb-4">
          <div className="flex items-center gap-1.5 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Contact Shielding</span>
          </div>
          <span className="font-semibold text-slate-800">
            {request.contactConsentGranted ? 'Consent Granted' : 'Shielded'}
          </span>
        </div>
      </div>

      {/* Action Footer depending on Role */}
      <div className="pt-2 border-t border-slate-100">
        {userRole === 'donor' && (
          <div>
            {request.status === 'Confirmed' ? (
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-emerald-800">
                ✓ Donation Accepted & Confirmed
              </div>
            ) : request.status === 'Completed' ? (
              <div className="p-2 rounded-xl bg-slate-100 text-center text-xs font-bold text-slate-600">
                Fulfillment Completed
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDecline && onDecline(request.id)}
                  className="text-xs py-2"
                >
                  Decline
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAccept && onAccept(request.id)}
                  className="text-xs py-2 shadow-xs"
                >
                  Accept & Share Info
                </Button>
              </div>
            )}
          </div>
        )}

        {(userRole === 'recipient' || userRole === 'hospital' || userRole === 'admin') && (
          <div className="flex items-center justify-between gap-2">
            <Link to={`/recipient/match?requestId=${request.id}`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full text-xs" icon={Users}>
                View Matched Donors
              </Button>
            </Link>

            {request.status !== 'Completed' && request.status !== 'Cancelled' && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs whitespace-nowrap"
                onClick={() => onStatusChange && onStatusChange(request.id, 'Completed')}
              >
                Mark Done
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
