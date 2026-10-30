import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  Car, 
  Zap, 
  Building2 
} from 'lucide-react';
import { Button } from '../common/Button';

export function SmartPickupCard({
  donorLocation = 'Coimbatore',
  recipientLocation = 'Salem',
  timeSaved = '1h 50m',
  onRequestPickup
}) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white p-6 sm:p-7 border border-rose-800/60 shadow-xl space-y-4">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Smart Emergency Pickup Point</span>
        </div>

        <div className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
          <Zap className="w-3 h-3" />
          <span>Cuts Transit Burden by 50%</span>
        </div>
      </div>

      {/* Main Pitch */}
      <div className="relative z-10 space-y-1.5">
        <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
          Synchronized Midpoint Handover Intercept
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
          When donor and recipient are located far apart during an emergency, our intelligent algorithm calculates a safe, certified healthcare meeting location between them to save critical time.
        </p>
      </div>

      {/* Corridor Visual Indicator */}
      <div className="relative z-10 p-4 rounded-2xl bg-slate-950/70 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-600/30 text-rose-400 border border-rose-500/40 flex items-center justify-center font-bold">
            D
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block font-semibold">Donor Origin</span>
            <span className="font-bold text-white">{donorLocation}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-rose-400 font-extrabold text-xs">
          <span>➔</span>
          <div className="px-2 py-0.5 rounded-md bg-rose-950 text-amber-300 border border-rose-800 flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            <span>Midpoint Meeting Point</span>
          </div>
          <span>➔</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold">
            R
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block font-semibold">Recipient Hospital</span>
            <span className="font-bold text-white">{recipientLocation}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 pt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Zero home address exposure • 24/7 Verified Blood Banks only</span>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/smart-pickup')}
            className="text-xs font-bold bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 cursor-pointer"
          >
            <span>Launch Smart Pickup Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

    </div>
  );
}
