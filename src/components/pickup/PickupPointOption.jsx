import React from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { formatDuration } from '../../utils/pickupPoint';

export function PickupPointOption({ option, isSelected, onSelect, index = 0 }) {
  return (
    <div
      onClick={() => onSelect && onSelect(option)}
      className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between gap-4 ${
        isSelected
          ? 'bg-rose-50/70 border-rose-500 shadow-md ring-2 ring-rose-200'
          : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Recommended Tag */}
      {option.isRecommended && (
        <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Recommended Choice</span>
        </div>
      )}

      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Building2 className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Option {index + 1} • {option.category}
              </span>
              <h4 className="text-sm font-black text-slate-900 leading-tight">
                {option.name}
              </h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{option.address}</span>
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            <input
              type="radio"
              name="pickup_option"
              checked={isSelected}
              onChange={() => onSelect && onSelect(option)}
              className="w-4 h-4 text-rose-600 focus:ring-rose-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Travel Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block">Donor Travel</span>
            <span className="font-bold text-rose-600 text-xs sm:text-sm">{option.donorTimeFormatted}</span>
            <span className="text-[10px] text-slate-500 block">({option.distFromDonor} km)</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block">Recipient Travel</span>
            <span className="font-bold text-blue-600 text-xs sm:text-sm">{option.recipientTimeFormatted}</span>
            <span className="text-[10px] text-slate-500 block">({option.distFromRecipient} km)</span>
          </div>

          <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-100 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-emerald-700 font-semibold block">Handover Ready</span>
            <span className="font-bold text-emerald-800 text-xs sm:text-sm">~{option.totalCoordinationFormatted}</span>
            <span className="text-[10px] text-emerald-600 block">Saves {option.travelTimeSavedFormatted}</span>
          </div>
        </div>

        {/* Reasons Checklist */}
        {option.reasons && option.reasons.length > 0 && (
          <div className="mt-3 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Recommendation Factors:
            </span>
            {option.reasons.slice(0, 2).map((reason, rIdx) => (
              <div key={rIdx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Amenities Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
        {option.isColdChainReady ? (
          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>24/7 Verified Blood Cold Storage</span>
          </span>
        ) : (
          <span className="text-slate-500 font-medium">Safe Highway Transit Stop</span>
        )}

        <span className="font-semibold text-rose-600 flex items-center gap-1 text-xs">
          <span>Select Location</span>
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
