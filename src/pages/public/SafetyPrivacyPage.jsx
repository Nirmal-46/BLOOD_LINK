import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  MapPin, 
  UserCheck, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Activity
} from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

export function SafetyPrivacyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <Breadcrumbs items={[{ label: 'Safety & Privacy Architecture' }]} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero-Leak Privacy Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Safety & Privacy by Design
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          How BloodConnect reconciles rapid blood requirement matching with the absolute protection of personal data, medical privacy, and donor peace of mind.
        </p>
      </div>

      {/* Interactive 4-Stage Visual Diagram */}
      <div className="glass-card rounded-3xl p-8 border border-slate-200/90 shadow-md">
        <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">
          The 4-Stage Privacy Pipeline: Request → Matching → Consent → Contact
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          {/* Stage 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stage 1</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700">Intake</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">1. Requirement Intake</h4>
            <p className="text-xs text-slate-600">
              Only required blood group, hospital facility, units, and urgency level are collected.
            </p>
            <div className="text-[11px] font-mono text-emerald-600 font-semibold pt-1">
              ✓ Data Minimized
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stage 2</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700">Internal</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">2. Blind Algorithmic Match</h4>
            <p className="text-xs text-slate-600">
              Matches are computed using masked IDs. No public database or raw list is exposed to the web.
            </p>
            <div className="text-[11px] font-mono text-emerald-600 font-semibold pt-1">
              ✓ Zero Public Directory
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stage 3</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-700">Gating</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">3. Voluntary Consent Gating</h4>
            <p className="text-xs text-slate-600">
              Candidate donor gets a private ping. Donor explicitly chooses whether to accept and unlock details.
            </p>
            <div className="text-[11px] font-mono text-emerald-600 font-semibold pt-1">
              ✓ Explicit Consent
            </div>
          </div>

          {/* Stage 4 */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Stage 4</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-200 text-emerald-800">Secure</span>
            </div>
            <h4 className="text-sm font-bold text-emerald-950">4. Mutual Contact Release</h4>
            <p className="text-xs text-emerald-800">
              Verified hospital coordinator and donor coordinate donation specifics directly.
            </p>
            <div className="text-[11px] font-mono text-emerald-700 font-bold pt-1">
              ✓ Safe Transfusion
            </div>
          </div>

        </div>
      </div>

      {/* Deep-Dive Privacy Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-card rounded-2xl p-6 border border-slate-200/90 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Approximate Proximity Only</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We only index city and metropolitan zone (e.g., "Coimbatore, Tamil Nadu"). Precise residential street addresses or GPS coordinates are never requested or stored.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200/90 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Identity Shielding</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Donors are presented as "Karthik S." or masked tokens until mutual confirmation. Personal phone numbers and emails remain encrypted and invisible to third parties.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200/90 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Right to Erasure & Stealth</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Users retain instantaneous toggle control over availability, stealth mode, or permanent account deletion directly from the Profile & Privacy panel.
          </p>
        </div>

      </div>

      {/* Clinical Disclaimer Callout */}
      <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span>Medical Screening & Clinical Disclaimer</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          Screening questions on BloodConnect (weight, recent tattoos, health wellness, cooldown intervals) are self-reported by donors to assist triage estimation. They do not constitute certified medical diagnosis. Mandatory laboratory testing, hemoglobin analysis, and blood group cross-matching must always be conducted by authorized blood transfusion officers before any clinical procedure.
        </p>
      </div>

    </div>
  );
}
