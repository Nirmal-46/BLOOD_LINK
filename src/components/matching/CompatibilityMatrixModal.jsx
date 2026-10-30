import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { BLOOD_GROUPS } from '../../utils/constants';
import { COMPATIBILITY_CHART, isBloodCompatible } from '../../utils/bloodCompatibility';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { Check, X, Info, Sparkles } from 'lucide-react';

export function CompatibilityMatrixModal({ isOpen, onClose }) {
  const [selectedGroup, setSelectedGroup] = useState('O-');

  const rule = COMPATIBILITY_CHART[selectedGroup];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Scientific ABO & Rh Blood Group Compatibility"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">
            Select a Blood Group to Inspect Compatibility:
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => setSelectedGroup(bg)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  selectedGroup === bg
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-105'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Group Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Can Donate To */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                →
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                <span className="text-rose-600 font-extrabold">{selectedGroup}</span> Can Donate To:
              </h4>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {rule?.canDonateTo.map((bg) => (
                <span
                  key={bg}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-xs font-bold text-rose-700 shadow-2xs"
                >
                  <Check className="w-3 h-3 text-emerald-600" />
                  {bg}
                </span>
              ))}
            </div>

            {selectedGroup === 'O-' && (
              <p className="text-[11px] text-rose-800 font-medium bg-rose-100/60 p-2 rounded-lg">
                🌟 <strong>Universal Red Blood Cell Donor:</strong> O- blood can be administered to patients of any blood group during acute emergency trauma.
              </p>
            )}
          </div>

          {/* Can Receive From */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                ←
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                <span className="text-blue-600 font-extrabold">{selectedGroup}</span> Can Receive From:
              </h4>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {rule?.canReceiveFrom.map((bg) => (
                <span
                  key={bg}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-xs font-bold text-blue-700 shadow-2xs"
                >
                  <Check className="w-3 h-3 text-emerald-600" />
                  {bg}
                </span>
              ))}
            </div>

            {selectedGroup === 'AB+' && (
              <p className="text-[11px] text-blue-800 font-medium bg-blue-100/60 p-2 rounded-lg">
                🌟 <strong>Universal Red Blood Cell Recipient:</strong> AB+ individuals can safely receive red blood cells from any compatible blood group.
              </p>
            )}
          </div>

        </div>

        {/* 8x8 Quick Matrix Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-[11px] text-center">
            <thead className="bg-slate-100 text-slate-700 font-bold">
              <tr>
                <th className="p-2 text-left bg-slate-200">Donor ↓ \ Recipient →</th>
                {BLOOD_GROUPS.map((g) => (
                  <th key={g} className="p-2 border-l border-slate-200">{g}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BLOOD_GROUPS.map((donorGroup) => (
                <tr key={donorGroup} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="p-2 text-left font-bold bg-slate-100/70 border-r border-slate-200">
                    {donorGroup}
                  </td>
                  {BLOOD_GROUPS.map((recipientGroup) => {
                    const compatible = isBloodCompatible(donorGroup, recipientGroup);
                    return (
                      <td
                        key={recipientGroup}
                        className={`p-2 border-l border-slate-200 font-bold ${
                          compatible
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-50/50 text-slate-300'
                        }`}
                      >
                        {compatible ? '✓' : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span>Biological compatibility is for red blood cell transfusions. Pathological cross-match required prior to clinical administration.</span>
        </div>
      </div>
    </Modal>
  );
}
