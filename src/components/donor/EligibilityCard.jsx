import React from 'react';
import { ShieldCheck, AlertCircle, Clock, Calendar, Check, Info } from 'lucide-react';
import { getDaysSinceDate, checkEligibilityStatus } from '../../utils/bloodCompatibility';
import { formatDate } from '../../utils/formatters';

export function EligibilityCard({ donor }) {
  if (!donor) return null;

  const daysSince = getDaysSinceDate(donor.lastDonationDate);
  const cooldownDays = 90;
  const daysRemaining = Math.max(0, cooldownDays - daysSince);
  const eligibility = checkEligibilityStatus(donor);

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-200/90 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Donation Readiness</h3>
            <p className="text-xs text-slate-500">Self-reported health & cooldown metrics</p>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${eligibility.badgeClass}`}>
          {eligibility.label}
        </span>
      </div>

      {/* Cooldown Tracker */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <Clock className="w-4 h-4 text-rose-500" />
            <span>90-Day Clinical Interval Interval</span>
          </div>
          <span className="font-bold text-slate-900">
            {daysSince >= 90 ? 'Interval Satisfied' : `${daysRemaining} days remaining`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              daysSince >= 90 ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(100, (daysSince / cooldownDays) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>Last Donated: {formatDate(donor.lastDonationDate)}</span>
          <span>{daysSince} days elapsed</span>
        </div>
      </div>

      {/* Self-Reported Health Indicators */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Screening Checkpoints (Self-Reported)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Body Weight ≥ 50 kg</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>No tattoo in last 6 mos</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>No major surgeries</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>General wellness confirmed</span>
          </div>
        </div>
      </div>

      {/* Legal & Medical Verification Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs leading-relaxed">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Clinical Verification Note:</strong> Final medical suitability (hemoglobin test, blood pressure, and infectious disease screening) is conducted at the donation site by authorized healthcare staff.
        </p>
      </div>
    </div>
  );
}
