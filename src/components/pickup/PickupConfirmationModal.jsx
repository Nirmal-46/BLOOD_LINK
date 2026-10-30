import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  AlertTriangle, 
  Clock, 
  Heart, 
  Sparkles,
  Car,
  Lock
} from 'lucide-react';
import { Button } from '../common/Button';
import { BloodGroupBadge } from '../common/BloodGroupBadge';

export function PickupConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  onDecline,
  role = 'donor', // 'donor' or 'recipient'
  pickupPoint,
  bloodGroup = 'O+',
  units = 2,
  donorTravelFormatted = '1h 05m',
  recipientTravelFormatted = '55 min',
  totalCoordinationFormatted = '1h 17m'
}) {
  const [agreedGuidelines, setAgreedGuidelines] = useState(false);

  if (!isOpen || !pickupPoint) return null;

  const isDonor = role === 'donor';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/40 text-rose-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {isDonor ? 'Donor Smart Pickup Request' : 'Recipient Confirmation Required'}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                {isDonor ? 'Confirm Handover at Meeting Point' : 'Approve Handover Landmark'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          
          {/* Target Requirement Info */}
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BloodGroupBadge group={bloodGroup} size="sm" />
              <span className="font-bold text-slate-800">{units} Units Required</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-600 text-white animate-pulse">
              Emergency Priority
            </span>
          </div>

          {/* Selected Pickup Point Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Agreed Safe Public Landmark
            </span>
            <div className="flex items-start gap-2.5">
              <Building2 className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-black text-slate-900">{pickupPoint.name}</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">{pickupPoint.address}</p>
              </div>
            </div>

            <div className="pt-2 mt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">Your Estimated Transit:</span>
                <strong className="text-rose-600 font-bold">
                  {isDonor ? donorTravelFormatted : recipientTravelFormatted}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Total Mission Time:</span>
                <strong className="text-emerald-700 font-bold">~{totalCoordinationFormatted}</strong>
              </div>
            </div>
          </div>

          {/* Privacy & Safety Assurances */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-900 space-y-1.5 text-[11px]">
            <div className="flex items-center gap-1.5 font-bold">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Privacy & Public Safety Protection</span>
            </div>
            <p className="text-indigo-800 leading-relaxed">
              Your exact home address is never shared. Both parties will coordinate arrival at the authorized <strong>{pickupPoint.name}</strong> security/reception desk.
            </p>
          </div>

          {/* Guidelines Checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreedGuidelines}
              onChange={(e) => setAgreedGuidelines(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
            />
            <span className="text-[11px] text-slate-600 leading-tight">
              I agree to depart toward the agreed meeting point within 10 minutes upon confirmation.
            </span>
          </label>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-6 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onDecline || onClose}
            className="text-xs text-slate-600 hover:text-slate-900"
          >
            {isDonor ? 'Decline Request' : 'Choose Another Point'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={!agreedGuidelines}
            onClick={() => {
              if (onConfirm) onConfirm(pickupPoint);
              onClose();
            }}
            className="text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30"
          >
            {isDonor ? '✓ Accept Pickup Request' : '✓ Confirm & Lock Pickup Point'}
          </Button>
        </div>

      </div>
    </div>
  );
}
