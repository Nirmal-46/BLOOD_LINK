import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Building2, 
  UserCheck, 
  Car, 
  HeartHandshake, 
  Check, 
  Radio, 
  Sparkles 
} from 'lucide-react';

export const PICKUP_STAGES = [
  { key: 'REQUEST_CREATED', label: 'Blood Request Created', icon: Radio },
  { key: 'DONOR_MATCHED', label: 'Compatible Donor Found', icon: UserCheck },
  { key: 'POINT_SUGGESTED', label: 'Pickup Point Suggested', icon: Sparkles },
  { key: 'DONOR_ACCEPTED', label: 'Donor Accepted', icon: CheckCircle2 },
  { key: 'RECIPIENT_CONFIRMED', label: 'Recipient Confirmed', icon: Building2 },
  { key: 'DONOR_TRAVELLING', label: 'Donor Travelling', icon: Car },
  { key: 'RECIPIENT_TRAVELLING', label: 'Recipient Travelling', icon: Car },
  { key: 'BLOOD_HANDOVER', label: 'Blood Handover', icon: HeartHandshake },
  { key: 'COMPLETED', label: 'Request Completed', icon: Check }
];

export function PickupTimeline({ currentStageIndex = 2, onAdvanceStage, userRole = 'recipient' }) {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-black text-slate-900">
            Emergency Handover Coordination Flow
          </h3>
          <p className="text-xs text-slate-500">
            Live stage-by-stage status of the pickup mission.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Stage {currentStageIndex + 1} of {PICKUP_STAGES.length}: {PICKUP_STAGES[currentStageIndex]?.label}
          </span>
        </div>
      </div>

      {/* Horizontal Scrollable Timeline on Desktop, Clean Vertical Stack on Mobile */}
      <div className="relative">
        
        {/* Step Items Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {PICKUP_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isPending = idx > currentStageIndex;
            const Icon = stage.icon;

            return (
              <div
                key={stage.key}
                className={`p-2.5 rounded-2xl border flex flex-col items-center text-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : isCurrent
                    ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-sm ring-2 ring-rose-200 animate-pulse'
                    : 'bg-slate-50/60 border-slate-200/60 text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center mb-1.5 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                <span className="text-[10px] font-bold leading-tight line-clamp-2">
                  {stage.label}
                </span>

                <span className="text-[9px] font-mono mt-1 font-semibold">
                  {isCompleted ? '✓ Done' : isCurrent ? '● Active' : '○ Pending'}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Live Stage Simulator Control (for Hackathon Demo) */}
      {onAdvanceStage && (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[11px] text-slate-500 font-medium">
            💡 Hackathon Live Control: You can simulate advancing the transit stage:
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAdvanceStage(Math.max(currentStageIndex - 1, 0))}
              disabled={currentStageIndex === 0}
              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              ← Previous Stage
            </button>
            <button
              onClick={() => onAdvanceStage(Math.min(currentStageIndex + 1, PICKUP_STAGES.length - 1))}
              disabled={currentStageIndex >= PICKUP_STAGES.length - 1}
              className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs transition cursor-pointer shadow-sm shadow-rose-600/30"
            >
              Next Stage ({PICKUP_STAGES[Math.min(currentStageIndex + 1, PICKUP_STAGES.length - 1)]?.label}) →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
