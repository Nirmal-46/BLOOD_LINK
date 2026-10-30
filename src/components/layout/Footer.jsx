import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Lock, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      {/* Top Banner Notice */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold text-slate-200">Privacy Guarantee:</span>
            <span>Donor phone numbers and exact addresses are never displayed publicly without explicit consent.</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero Unwanted Marketing • Masked Coordinates</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Problem Statement */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                Blood<span className="text-rose-500">Connect</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Match blood requirements with eligible donors while protecting sensitive personal information.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-rose-400 text-xs font-semibold border border-slate-700/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fast matching. Safer sharing.</span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition">How Matching Works</Link>
              </li>
              <li>
                <Link to="/safety-privacy" className="hover:text-white transition">Privacy Architecture</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">About the Initiative</Link>
              </li>
              <li>
                <Link to="/recipient/emergency" className="text-rose-400 hover:text-rose-300 font-semibold transition">
                  Emergency Request Broadcast
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Donor & Recipient Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">User Workflows</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/register/donor" className="hover:text-white transition">Register as a Donor</Link>
              </li>
              <li>
                <Link to="/recipient/request" className="hover:text-white transition">Submit Blood Requirement</Link>
              </li>
              <li>
                <Link to="/recipient/match" className="hover:text-white transition">Donor Search & Compatibility</Link>
              </li>
              <li>
                <Link to="/donor/dashboard" className="hover:text-white transition">Donor Availability Portal</Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition">Hackathon Admin Oversight</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Safety & Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Medical Disclaimer</h4>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <strong className="text-slate-200 block mb-1">Important Health Notice:</strong>
              Eligibility information in BloodConnect is self-reported for triage estimation. Final medical eligibility and biological cross-matching must be confirmed by an authorized blood bank and registered medical professional.
            </p>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 BloodConnect Initiative. Built for Hackathon Demo & Rapid Response.</p>
          <div className="flex items-center gap-4">
            <Link to="/safety-privacy" className="hover:text-slate-400 transition">Consent Policy</Link>
            <span className="text-slate-700">•</span>
            <Link to="/safety-privacy" className="hover:text-slate-400 transition">Data Minimization</Link>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400">Prototype Demo v2.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
