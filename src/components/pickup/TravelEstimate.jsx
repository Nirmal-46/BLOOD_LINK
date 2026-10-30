import React from 'react';
import { Clock, TrendingDown, ArrowRight, Zap, ShieldAlert, Sparkles } from 'lucide-react';
import { formatDuration } from '../../utils/pickupPoint';

export function TravelEstimate({
  directDistanceKm = 160,
  directTravelFormatted = '3h 10m',
  pickupPointName = 'Erode Government Hospital',
  donorTimeFormatted = '1h 05m',
  recipientTimeFormatted = '55 min',
  totalCoordinationFormatted = '1h 17m',
  timeSavedFormatted = '1h 53m'
}) {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">Logistical Efficiency Comparison</h4>
            <p className="text-[11px] text-slate-400">Direct Travel vs. Smart Midpoint Intercept</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Saves ~{timeSavedFormatted} in Transit</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        
        {/* Direct Travel Card (Traditional / High Burden) */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 opacity-80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Standard Direct Travel
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/60 text-rose-300 border border-rose-900">
              High Fatigue
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-300">Single party travels full {directDistanceKm} km:</span>
            <strong className="text-slate-100 font-mono text-sm">{directTravelFormatted}</strong>
          </div>

          {/* Progress bar comparison */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-slate-600 rounded-full w-full" />
          </div>
          <span className="text-[10px] text-slate-500 block">
            Requires one party to cross entire inter-city highway distance alone.
          </span>
        </div>

        {/* Smart Pickup Point (Parallel Dispatch) */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/60 space-y-2 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Smart Pickup Intercept</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700">
              Recommended
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-200">Synchronized Dual Departure:</span>
            <strong className="text-emerald-400 font-mono text-sm">{totalCoordinationFormatted}</strong>
          </div>

          {/* Split Progress bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2 flex gap-1">
            <div className="h-full bg-rose-500 rounded-full w-[45%]" title="Donor Travel (45%)" />
            <div className="h-full bg-amber-400 rounded-full w-[10%]" title="Handover Buffer (10%)" />
            <div className="h-full bg-blue-500 rounded-full w-[45%]" title="Recipient Travel (45%)" />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
            <span className="text-rose-300">Donor: {donorTimeFormatted}</span>
            <span className="text-blue-300">Recipient: {recipientTimeFormatted}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
