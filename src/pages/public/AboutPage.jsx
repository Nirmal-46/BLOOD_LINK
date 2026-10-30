import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Sparkles, Target, Users, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

export function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <Breadcrumbs items={[{ label: 'About BloodConnect' }]} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
          <Heart className="w-3.5 h-3.5" />
          <span>Our Mission & Vision</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Solving the Blood Coordination Crisis with Privacy-First Tech
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          In medical emergencies, every second counts. BloodConnect was built to replace chaotic social media requests and exposed personal phone lists with a safe, dignified, consent-driven network.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-200/90 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            ⚡
          </div>
          <h3 className="text-base font-bold text-slate-900">Fast Matching</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminate frantic calling trees. Automated algorithms rank ABO/Rh compatibility, local proximity, and donor cooldown in under a second.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200/90 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            🛡️
          </div>
          <h3 className="text-base font-bold text-slate-900">Safer Sharing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Protect donors from harassment and spam. Mutual consent is strictly required before telephone coordinates are disclosed.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-200/90 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            🤝
          </div>
          <h3 className="text-base font-bold text-slate-900">Better Coordination</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Direct synchronization between hospital transfusion desks, recipients, and willing donors with live status tracking.
          </p>
        </div>
      </div>

      {/* Prototype Context */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-4 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Hackathon Prototype</span>
        <h2 className="text-2xl font-black">Built for Rapid Hackathon Demonstration</h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-xl mx-auto">
          BloodConnect utilizes state-of-the-art frontend engineering with persistent demo states, accessible WCAG color contrast, and zero external telemetry to demonstrate a production-grade healthcare paradigm.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/register/donor">
            <Button variant="primary" size="md">
              Test Donor Registration
            </Button>
          </Link>
          <Link to="/recipient/request">
            <Button variant="secondary" size="md" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
              Create Test Requirement
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
