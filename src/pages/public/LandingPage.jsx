import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShieldCheck, 
  Flame, 
  Clock, 
  Search, 
  Users, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Building2, 
  Sparkles, 
  PhoneOff, 
  Activity,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { BloodGroupBadge } from '../../components/common/BloodGroupBadge';
import { CompatibilityMatrixModal } from '../../components/matching/CompatibilityMatrixModal';
import { BLOOD_GROUPS } from '../../utils/constants';
import { useBloodData } from '../../context/BloodDataContext';

export function LandingPage() {
  const { stats, requests } = useBloodData();
  const [matrixOpen, setMatrixOpen] = useState(false);
  const [selectedQuickGroup, setSelectedQuickGroup] = useState('O+');

  const emergencyRequests = requests.filter((r) => r.urgency === 'Emergency' && r.status !== 'Completed');

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 pb-12 sm:pb-20 overflow-hidden">
        {/* Background Subtle Gradient Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-red-100/50 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-bold tracking-wide shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-rose-600 animate-ping" />
              <span>Privacy-Aware Blood Matching Network</span>
            </div>
          </div>

          {/* Main Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Find the Right Blood Donor,{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-red-600 to-rose-700">
                Faster.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed font-normal">
              Connect blood recipients with compatible donors instantly while keeping personal phone numbers, addresses, and private data strictly protected.
            </p>

            {/* Main CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/recipient/request" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-base shadow-lg shadow-rose-600/25 px-8" icon={ArrowRight}>
                  Request Blood Now
                </Button>
              </Link>
              <Link to="/register/donor" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base border-slate-300" icon={Heart}>
                  Become a Donor
                </Button>
              </Link>
            </div>

            {/* Value Props Bar */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-semibold">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Consent-Gated Contact</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-600" />
                <span>Zero Delay Triage</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <PhoneOff className="w-4 h-4 text-slate-600" />
                <span>Zero Spam Guarantee</span>
              </div>
            </div>

          </div>

          {/* Quick Emergency Ticker Banner if Active Emergency */}
          {emergencyRequests.length > 0 && (
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-900 via-red-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-rose-700/50 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white flex-shrink-0">
                    <Flame className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-extrabold tracking-wider text-rose-400">
                        Critical Emergency Alert
                      </span>
                      <BloodGroupBadge group={emergencyRequests[0].bloodGroup} size="sm" />
                    </div>
                    <p className="text-xs text-slate-200 mt-0.5">
                      {emergencyRequests[0].units} units needed at {emergencyRequests[0].hospitalName} ({emergencyRequests[0].city})
                    </p>
                  </div>
                </div>

                <Link to={`/recipient/match?requestId=${emergencyRequests[0].id}`}>
                  <Button variant="secondary" size="sm" className="whitespace-nowrap bg-white text-rose-900 font-bold hover:bg-rose-50 border-0">
                    Coordinate Match
                  </Button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 2. DEMO METRICS & STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 border border-slate-200/80 shadow-md">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Platform Reliability
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              Engineered for Rapid Response
            </h3>
            <p className="text-xs text-slate-500 mt-1">(Simulation values calibrated for hackathon demo)</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-black text-rose-600 mb-1">
                {stats.totalDonationsCompleted}+
              </div>
              <div className="text-xs font-bold text-slate-800">Donations Completed</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Simulated Life Impacts</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 mb-1">
                {stats.activeDonorsCount}+
              </div>
              <div className="text-xs font-bold text-slate-800">Active Donors</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Verified Blood Groups</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-black text-rose-600 mb-1">
                &lt; {stats.emergencyResponseAvgMins} min
              </div>
              <div className="text-xs font-bold text-slate-800">Avg. Match Speed</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Automated Broadcast</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 mb-1">
                100%
              </div>
              <div className="text-xs font-bold text-slate-800">Privacy Shielded</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Zero Public Numbers</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW BLOODCONNECT WORKS (4 STAGES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
            Intuitive Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            How BloodConnect Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            A seamless 4-step workflow ensuring blood is mobilized quickly without exposing private personal details.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200/90 relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-lg mb-4">
                01
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Create Requirement</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hospital or recipient specifies required blood group, units, urgency tier, and clinical location.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-rose-600">
              ✓ Step-by-Step Wizard
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200/90 relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-lg mb-4">
                02
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Scientific Matching</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                System evaluates ABO/Rh biological compatibility, proximity radius, 90-day cooldown, and donor availability.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-red-600">
              ✓ Transparent Scoring
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200/90 relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-lg mb-4">
                03
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Consent Verification</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Potential donors receive an alert with hospital info. Donor reviews the request and voluntarily grants contact consent.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-900">
              ✓ Zero Data Leak
            </div>
          </div>

          {/* Step 4 */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200/90 relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg mb-4">
                04
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Secure Coordination</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Once mutual consent is established, coordinated communication channels unlock for safe, timely donation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-600">
              ✓ Life Saved Safely
            </div>
          </div>

        </div>
      </section>

      {/* 4. PRIVACY-FIRST SPOTLIGHT WITH ARCHITECTURE DIAGRAM PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Privacy Architecture by Design</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                No Public Phone Lists. No Address Leaks. Total Peace of Mind.
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Traditional blood groups and message boards inadvertently post donor cell numbers across social media, leading to spam and privacy infringement. BloodConnect prevents this with <strong>Consent-Gated Matching</strong>.
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <span>Approximate city/area location matching instead of GPS home pinpointing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <span>Masked phone numbers until explicit donor acceptance</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <span>Full donor control: instant availability toggle & right to delete</span>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/safety-privacy">
                  <Button variant="emergency" size="md">
                    Explore Privacy Architecture
                  </Button>
                </Link>
              </div>
            </div>

            {/* Interactive Visual Diagram */}
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                Simulated Privacy Filter
              </div>

              {/* Step Flow Card */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-6 h-6 rounded bg-rose-600 text-white flex items-center justify-center font-bold text-[10px]">1</span>
                  <span>Requirement Posted</span>
                </div>
                <span className="text-[11px] text-slate-400">Hospital Request</span>
              </div>

              <div className="text-center text-xs text-rose-400 font-bold">↓ Matching Engine (Anonymized)</div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-6 h-6 rounded bg-amber-600 text-white flex items-center justify-center font-bold text-[10px]">2</span>
                  <span>Candidate: Karthik S. (O+)</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">•••• •••• 34</span>
              </div>

              <div className="text-center text-xs text-emerald-400 font-bold">↓ Mutual Consent Granted</div>

              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/60 flex items-center justify-between text-emerald-300">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">3</span>
                  <span className="font-bold">Contact Channel Unlocked</span>
                </div>
                <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded font-mono font-bold">+91 98452 11234</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE BLOOD GROUP COMPATIBILITY EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 border border-slate-200/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                Biological Matrix
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                ABO & Rh Factor Compatibility Helper
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Understand which blood groups can donate to and receive from each other
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMatrixOpen(true)}
              icon={Sparkles}
            >
              Open Full 8x8 Compatibility Matrix
            </Button>
          </div>

          {/* Quick selection chips */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-6">
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => setSelectedQuickGroup(bg)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  selectedQuickGroup === bg
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-105'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>

          {/* Quick Summary Pill */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BloodGroupBadge group={selectedQuickGroup} size="lg" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Transfusion profile for {selectedQuickGroup}
                </h4>
                <p className="text-xs text-slate-600">
                  {selectedQuickGroup === 'O-'
                    ? 'Universal Red Cell Donor: Can donate to all 8 blood groups!'
                    : selectedQuickGroup === 'AB+'
                    ? 'Universal Red Cell Recipient: Can receive from all 8 blood groups!'
                    : `Can safely donate to designated compatible ABO/Rh groups.`}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setMatrixOpen(true)}
              className="whitespace-nowrap text-xs"
            >
              View Full Rules
            </Button>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Ready to Build a Safer Blood Donation Network?
          </h2>
          <p className="text-sm sm:text-base text-rose-100 max-w-2xl mx-auto">
            “Fast matching. Safer sharing. Better coordination.” Experience the prototype today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/register/donor">
              <Button variant="secondary" size="lg" className="bg-white text-rose-700 font-bold hover:bg-rose-50 border-0">
                Register as a Donor
              </Button>
            </Link>
            <Link to="/recipient/request">
              <Button variant="secondary" size="lg" className="bg-rose-800 text-white font-bold hover:bg-rose-900 border-rose-600">
                Create Blood Requirement
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Compatibility Matrix Modal */}
      <CompatibilityMatrixModal
        isOpen={matrixOpen}
        onClose={() => setMatrixOpen(false)}
      />

    </div>
  );
}
