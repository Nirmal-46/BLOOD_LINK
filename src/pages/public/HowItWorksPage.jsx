import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  Heart, 
  Flame, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Users,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { CompatibilityMatrixModal } from '../../components/matching/CompatibilityMatrixModal';

export function HowItWorksPage() {
  const [matrixOpen, setMatrixOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <Breadcrumbs items={[{ label: 'How It Works' }]} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Matching Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          How BloodConnect Works
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Our intelligent, privacy-first algorithm balances urgent patient needs with donor safety, cooldown intervals, and strict consent safeguards.
        </p>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-card rounded-2xl p-6 border border-slate-200/90 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-base">
            1
          </div>
          <h3 className="text-lg font-bold text-slate-900">1. Requirement Triage & Classification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Requests are categorized into <strong>Normal (24-48h)</strong>, <strong>Urgent (6-12h)</strong>, and <strong>Emergency (Immediate)</strong>. Emergency requests trigger automated priority notifications to nearby eligible donors.
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hospital verification tagging</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Unit count and timeline validation</span>
            </li>
          </ul>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200/90 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-base">
            2
          </div>
          <h3 className="text-lg font-bold text-slate-900">2. Multi-Factor Compatibility Matching</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The system runs a multi-dimensional ranking algorithm assessing ABO/Rh biological rules, metropolitan proximity, self-reported health screening, and the 90-day cooldown interval.
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exact vs. Universal compatibility weighting</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>90-day whole blood interval verification</span>
            </li>
          </ul>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200/90 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base">
            3
          </div>
          <h3 className="text-lg font-bold text-slate-900">3. Voluntary Consent Gating</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Instead of displaying telephone numbers openly on public directories, candidate donors receive a notification summary. The donor reviews the hospital location and voluntarily taps "Accept & Share Contact".
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>No spam calls or unvetted directory crawling</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Right to withdraw or pause availability anytime</span>
            </li>
          </ul>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200/90 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base">
            4
          </div>
          <h3 className="text-lg font-bold text-slate-900">4. Final Clinical Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Direct coordination is initiated via hospital blood bank desks. Blood bank pathologists perform biological cross-matching and standard clinical tests on-site.
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cross-match confirmation before transfusion</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Donation logged to donor history for cooldown timer</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Compatibility Matrix Trigger Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Interested in the Biological Matching Rules?</h3>
          <p className="text-xs text-slate-600 mt-0.5">Explore the ABO and Rh compatibility matrix used by our algorithm.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setMatrixOpen(true)}>
          View Compatibility Table
        </Button>
      </div>

      {/* CTA Footer */}
      <div className="text-center pt-4">
        <Link to="/register/donor">
          <Button variant="primary" size="lg" icon={Heart}>
            Join as a Verified Donor Today
          </Button>
        </Link>
      </div>

      <CompatibilityMatrixModal isOpen={matrixOpen} onClose={() => setMatrixOpen(false)} />
    </div>
  );
}
