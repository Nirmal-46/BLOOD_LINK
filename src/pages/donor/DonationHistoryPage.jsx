import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Heart, Award, Calendar, CheckCircle2, Building2, Download, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { BloodGroupBadge } from '../../components/common/BloodGroupBadge';
import { Button } from '../../components/common/Button';

export function DonationHistoryPage() {
  const { currentUser } = useAuth();

  const mockHistory = [
    {
      id: 'DON-2026-081',
      date: '2026-05-10',
      hospital: 'PSG Institute of Medical Sciences',
      city: 'Coimbatore, Tamil Nadu',
      units: 1,
      type: 'Whole Blood',
      status: 'Fulfilled & Verified',
      impact: 'Emergency trauma surgery support'
    },
    {
      id: 'DON-2025-412',
      date: '2025-11-18',
      hospital: 'KMCH Hospital & Research Center',
      city: 'Coimbatore, Tamil Nadu',
      units: 1,
      type: 'Whole Blood',
      status: 'Fulfilled & Verified',
      impact: 'Pediatric thalassemia support'
    },
    {
      id: 'DON-2025-109',
      date: '2025-06-22',
      hospital: 'G.K. Memorial City Hospital',
      city: 'Coimbatore, Tamil Nadu',
      units: 1,
      type: 'Whole Blood',
      status: 'Fulfilled & Verified',
      impact: 'Oncology replacement support'
    }
  ];

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Donation History' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Your Life-Saving History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete record of verified blood donations and cooldown intervals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3">
            <Award className="w-6 h-6 text-rose-600" />
            <div>
              <div className="text-xs font-bold text-slate-900">Total Donations</div>
              <div className="text-lg font-black text-rose-600">{currentUser?.totalDonations || 4} Units</div>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-card rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Reference ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Medical Facility</th>
                <th className="p-4">Component</th>
                <th className="p-4">Clinical Impact</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4 font-mono font-bold text-slate-800">{item.id}</td>
                  <td className="p-4 text-slate-600 font-medium">{item.date}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{item.hospital}</div>
                    <div className="text-[11px] text-slate-500">{item.city}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">{item.type} ({item.units} Unit)</td>
                  <td className="p-4 text-slate-600">{item.impact}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
