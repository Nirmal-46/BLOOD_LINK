import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Clock, 
  Flame, 
  Sparkles, 
  Layers, 
  Radio,
  CheckCircle2,
  Car,
  Compass
} from 'lucide-react';
import { formatDuration } from '../../utils/pickupPoint';

export function PickupPointMap({
  donorLocation = 'Coimbatore, Tamil Nadu',
  recipientLocation = 'Salem, Tamil Nadu',
  pickupPoint,
  donorTimeFormatted = '1h 05m',
  recipientTimeFormatted = '55 min',
  totalCoordinationFormatted = '1h 17m',
  activeStage = 'SUGGESTED' // SUGGESTED, ACCEPTED, TRAVELLING, HANDOVER, COMPLETED
}) {
  const [interactiveMode, setInteractiveMode] = useState('STANDARD'); // STANDARD, SATELLITE_SIM

  const isTravelling = activeStage === 'TRAVELLING';
  const isHandover = activeStage === 'HANDOVER' || activeStage === 'COMPLETED';

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-700 bg-slate-950 text-white shadow-2xl select-none">
      
      {/* Top Map HUD Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-extrabold tracking-wide uppercase text-slate-300">
            Live Transit & Intercept Radar
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800">
            NH-544 Highway Corridor
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">
            Estimated Handover Window: <strong className="text-white">{totalCoordinationFormatted}</strong>
          </span>
        </div>
      </div>

      {/* Main Stylized Map Canvas */}
      <div className="relative p-6 sm:p-10 min-h-[360px] sm:min-h-[380px] flex flex-col justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        
        {/* Radar background grid lines */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#e11d48 1px, transparent 1px), linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
            backgroundSize: '40px 40px, 40px 40px, 40px 40px'
          }}
        />

        {/* Ambient background glow behind pickup point */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* SVG Route Connection Line with animated dash stroke */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path
            d="M 120 190 Q 360 140 480 190 T 840 190"
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="3.5"
            strokeDasharray="8,6"
            className="animate-pulse"
          />
        </svg>

        {/* 3-Node Transit Corridor Layout */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-4 items-center max-w-5xl mx-auto w-full">
          
          {/* 1. DONOR NODE (Origin) */}
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg relative group hover:border-rose-500/80 transition-all">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-700 text-[10px] font-bold uppercase tracking-wider mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>Donor Origin</span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/40 mb-3 group-hover:scale-105 transition-transform">
              <Car className="w-7 h-7" />
            </div>

            <h4 className="text-sm font-black text-white">{donorLocation.split(',')[0]}</h4>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Eligible & Available Donor</p>

            <div className="mt-3 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] font-semibold text-rose-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>Travel: ~{donorTimeFormatted}</span>
            </div>
          </div>

          {/* Directional Arrow on Mobile */}
          <div className="flex md:hidden items-center justify-center text-rose-400 text-xs font-bold gap-1 -my-2">
            <span>↓ Departs towards Midpoint ({donorTimeFormatted}) ↓</span>
          </div>

          {/* 2. SMART PICKUP POINT (Central Handover Hub) */}
          <div className="flex flex-col items-center text-center p-5 rounded-3xl bg-gradient-to-b from-slate-900 via-rose-950/40 to-slate-900 border-2 border-rose-500 shadow-2xl shadow-rose-950/60 relative transform md:-translate-y-2">
            <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 text-white font-black text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Smart Handover Point</span>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-600 via-red-600 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-rose-600/50 mb-3 mt-1 relative">
              <div className="absolute inset-0 rounded-3xl bg-rose-500 animate-ping opacity-30" />
              <Building2 className="w-8 h-8 relative z-10" />
            </div>

            <h3 className="text-sm sm:text-base font-black text-white px-2">
              {pickupPoint?.name || 'Central Transit Hospital Blood Bank'}
            </h3>
            <p className="text-[11px] text-amber-300/90 font-medium mt-0.5 flex items-center gap-1 justify-center">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>{pickupPoint?.address || 'Midpoint Highway Corridor'}</span>
            </p>

            {pickupPoint?.isColdChainReady && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold mt-2">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>24/7 Cold Chain Verified</span>
              </span>
            )}

            <div className="w-full mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">From Donor:</span>
                <strong className="text-rose-300 font-bold">{donorTimeFormatted}</strong>
              </div>
              <div className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">From Recipient:</span>
                <strong className="text-blue-300 font-bold">{recipientTimeFormatted}</strong>
              </div>
            </div>
          </div>

          {/* Directional Arrow on Mobile */}
          <div className="flex md:hidden items-center justify-center text-blue-400 text-xs font-bold gap-1 -my-2">
            <span>↑ Recipient Ambulance Travels ({recipientTimeFormatted}) ↑</span>
          </div>

          {/* 3. RECIPIENT NODE (Destination Hospital) */}
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg relative group hover:border-blue-500/80 transition-all">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-700 text-[10px] font-bold uppercase tracking-wider mb-2.5">
              <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
              <span>Hospital Patient</span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/40 mb-3 group-hover:scale-105 transition-transform">
              <Building2 className="w-7 h-7" />
            </div>

            <h4 className="text-sm font-black text-white">{recipientLocation.split(',')[0]}</h4>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Emergency Surgical Triage</p>

            <div className="mt-3 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] font-semibold text-blue-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Travel: ~{recipientTimeFormatted}</span>
            </div>
          </div>

        </div>

        {/* Bottom Safety & Privacy Note */}
        <div className="relative z-10 mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Exact personal residential addresses are never shared. Only the public medical handover landmark is used.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-slate-300">
              Safe Intercept Protocol v2.4
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
