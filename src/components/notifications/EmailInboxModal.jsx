import React, { useState } from 'react';
import { 
  Mail, 
  X, 
  Clock, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  ExternalLink, 
  Copy, 
  Check, 
  Flame, 
  Droplet 
} from 'lucide-react';
import { Button } from '../common/Button';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { formatRelativeTime } from '../../utils/formatters';

export function EmailInboxModal({ email, isOpen, onClose, onRespond }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !email) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Blood Request Alert:\n${email.subject}\nHospital: ${email.hospitalName}\nBlood Group: ${email.bloodGroup}\nUnits: ${email.units}\nUrgency: ${email.urgency}\nLocation: ${email.city}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMailto = () => {
    const mailtoLink = `mailto:${email.to}?subject=${encodeURIComponent(
      email.subject
    )}&body=${encodeURIComponent(
      `Hello ${email.recipientName},\n\nThis is an urgent notification regarding blood requirement for ${email.bloodGroup} at ${email.hospitalName}, ${email.city}.\n\nReference: ${email.requestId}\nPlease coordinate through BloodConnect.`
    )}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Email Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 sm:p-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/40 text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Email Push Notification
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(email.timestamp)}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white truncate mt-1">
                {email.subject}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Meta Details */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-slate-400 font-semibold">To:</span>{' '}
            <span className="font-bold text-slate-800">{email.to}</span>{' '}
            <span className="text-slate-500">({email.recipientName})</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold">From:</span>{' '}
            <span className="font-mono text-rose-600 font-bold">{email.from || 'bloodlink112@gmail.com'}</span>
          </div>
        </div>

        {/* Email Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Urgent Alert Banner */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-rose-600 text-white flex-shrink-0">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black text-rose-900">
                Blood is urgently needed at {email.hospitalName}
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Hospital trauma triage dispatched this high-priority matching alert to eligible {email.bloodGroup} donors in the area.
              </p>
            </div>
          </div>

          {/* Structured Requirement Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Hospital / Facility
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <Building2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{email.hospitalName}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{email.city}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Required Blood Group
              </span>
              <div className="flex items-center justify-between">
                <BloodGroupBadge group={email.bloodGroup} size="lg" />
                <span className="font-bold text-slate-900 text-sm">
                  {email.units} Unit(s) Needed
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Context */}
          {email.purpose && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                Clinical Requirement / Purpose
              </span>
              <p className="text-slate-700 font-medium">
                {email.purpose}
              </p>
            </div>
          )}

          {/* Privacy Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900">
            <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Privacy Protection:</strong> Phone numbers are never exposed in email notifications. You can respond directly on the portal to coordinate donation securely.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={copied ? Check : Copy}
              onClick={handleCopy}
              className="text-xs"
            >
              {copied ? 'Copied Alert' : 'Copy Details'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={ExternalLink}
              onClick={handleOpenMailto}
              className="text-xs"
            >
              Open in Mail App
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                if (onRespond) onRespond(email);
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
            >
              Respond & Donate at {email.hospitalName.split(' ')[0]} →
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
