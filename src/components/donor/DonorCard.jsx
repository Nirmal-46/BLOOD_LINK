import React from 'react';
import { Shield, ShieldCheck, MapPin, Calendar, Heart, CheckCircle2, Phone, Mail, Sparkles, AlertCircle } from 'lucide-react';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { PrivacyBadge } from '../common/PrivacyBadge';
import { Button } from '../common/Button';
import { anonymizeName, maskPhoneNumber, maskEmail, formatDate } from '../../utils/formatters';
import { checkEligibilityStatus } from '../../utils/bloodCompatibility';

export function DonorCard({
  donor,
  matchResult,
  onRequestConsent,
  consentGranted = false,
  showActions = true,
  actionLoading = false
}) {
  const eligibility = checkEligibilityStatus(donor);

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200/90 transition-all hover:shadow-md hover:border-slate-300 relative overflow-hidden flex flex-col justify-between">
      
      {/* Top Banner if High Match */}
      {matchResult && matchResult.score >= 80 && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>{matchResult.tierBadge}</span>
        </div>
      )}

      <div>
        {/* Header: Blood Group + Name + City */}
        <div className="flex items-start gap-3.5 mb-4">
          <BloodGroupBadge group={donor.bloodGroup} size="lg" className="shadow-md" />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-bold text-slate-900 leading-tight">
                {consentGranted ? donor.name : anonymizeName(donor.name)}
              </h4>
              <PrivacyBadge text={consentGranted ? 'Consent Granted' : 'Identity Shielded'} />
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{donor.city} (Approximate)</span>
            </div>
          </div>
        </div>

        {/* Match Scoring Breakdown if available */}
        {matchResult && (
          <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">System Compatibility Match</span>
              <span className="font-extrabold text-slate-900">{matchResult.score}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  matchResult.score >= 80
                    ? 'bg-emerald-500'
                    : matchResult.score >= 60
                    ? 'bg-blue-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${matchResult.score}%` }}
              />
            </div>
            <div className="space-y-1 pt-1">
              {matchResult.reasons.slice(0, 2).map((reason, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Health Screening & Availability Badges */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  donor.availability ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
              <span>{donor.availability ? 'Available' : 'Resting'}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Screening Check</span>
            <div className="text-[11px] font-bold text-slate-800 truncate mt-0.5" title={eligibility.details}>
              {eligibility.label}
            </div>
          </div>
        </div>

        {/* Contact Status (Consent Protected vs Unlocked) */}
        <div className="p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 mb-4 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">Protected Direct Contact</span>
            {consentGranted ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Unlocked
              </span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Shielded
              </span>
            )}
          </div>

          {consentGranted ? (
            <div className="space-y-1 text-slate-900 font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{donor.phone || '+91 98452 11234'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span>{donor.email}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-3.5 h-3.5" />
              <span>{maskPhoneNumber(donor.phone)}</span>
              <span className="text-[10px] text-slate-400 italic">(Requires donor consent)</span>
            </div>
          )}
        </div>
      </div>

      {/* Action CTA */}
      {showActions && (
        <div className="pt-2">
          {consentGranted ? (
            <Button
              variant="secondary"
              className="w-full text-xs"
              onClick={() => window.open(`tel:${donor.phone || '0000000000'}`)}
            >
              Direct Coordinate Call
            </Button>
          ) : (
            <Button
              variant="primary"
              className="w-full text-xs"
              loading={actionLoading}
              onClick={onRequestConsent}
            >
              Request Contact Consent
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
