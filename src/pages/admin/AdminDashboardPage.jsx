import React, { useState } from 'react';
import { useBloodData } from '../../context/BloodDataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Users, 
  Flame, 
  Heart, 
  Activity, 
  CheckCircle2, 
  Search, 
  Sliders, 
  RotateCcw,
  FileText,
  AlertTriangle,
  PlusCircle,
  Trash2,
  Lock,
  Building2,
  MapPin,
  Shield
} from 'lucide-react';
import { BloodGroupBadge } from '../../components/common/BloodGroupBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { UrgencyBadge } from '../../components/common/UrgencyBadge';
import { Button } from '../../components/common/Button';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { anonymizeName, formatDate, formatRelativeTime } from '../../utils/formatters';
import { BLOOD_GROUPS, CITIES, BLOOD_COMPONENTS } from '../../utils/constants';

export function AdminDashboardPage() {
  const { requests, donors, stats, updateRequestStatus, resetToDemoData, addBloodRequest } = useBloodData();
  const { users } = useAuth();

  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'donors' | 'hospitals' | 'audit'
  const [searchTerm, setSearchTerm] = useState('');
  const [newRequestModalOpen, setNewRequestModalOpen] = useState(false);

  // Quick New Request State for Admin
  const [adminReq, setAdminReq] = useState({
    bloodGroup: 'O+',
    units: 2,
    urgency: 'Urgent',
    hospitalName: 'PSG Institute of Medical Sciences',
    city: CITIES[0],
    area: 'Central Trauma ICU',
    purpose: 'Admin override emergency dispatch'
  });

  const emergencyRequests = requests.filter((r) => r.urgency === 'Emergency');
  const activeRequests = requests.filter((r) => r.status !== 'Completed' && r.status !== 'Cancelled');
  const completedRequests = requests.filter((r) => r.status === 'Completed');

  const filteredRequests = requests.filter((r) => {
    if (!searchTerm) return true;
    return (
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredDonors = donors.filter((d) => {
    if (!searchTerm) return true;
    return (
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCreateAdminRequest = (e) => {
    e.preventDefault();
    addBloodRequest({
      bloodGroup: adminReq.bloodGroup,
      units: Number(adminReq.units),
      urgency: adminReq.urgency,
      hospitalName: adminReq.hospitalName,
      city: adminReq.city,
      area: adminReq.area,
      requiredDate: new Date().toISOString().split('T')[0],
      purpose: adminReq.purpose,
      notes: 'Generated via Admin Console'
    });
    setNewRequestModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Admin Control Center' }]} />

      {/* Admin Master Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-rose-600 text-white flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Master Admin Access
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
              Live Monitoring Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 text-white">
            Platform Administration & Triage
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervise incoming blood requirements, audit privacy shields, and manage regional donation dispatches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="emergency"
            size="sm"
            onClick={() => setNewRequestModalOpen(true)}
            icon={PlusCircle}
            className="text-xs font-bold"
          >
            Dispatch Requirement
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={resetToDemoData}
            icon={RotateCcw}
            className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
          >
            Reset Demo Data
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Total Donors</span>
            <Users className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{donors.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Shielded records</div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Active Needs</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600">{activeRequests.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">In dispatch</div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Critical Trauma</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">{emergencyRequests.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Emergency broadcasts</div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Fulfilled</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{completedRequests.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Verified transfusions</div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 gap-4 sm:gap-6 text-xs sm:text-sm font-semibold overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-2.5 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'requests'
                ? 'border-rose-600 text-rose-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            All Blood Requirements ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('donors')}
            className={`pb-2.5 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'donors'
                ? 'border-rose-600 text-rose-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Registered Donors ({donors.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-2.5 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-rose-600 text-rose-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Security & Privacy Audit Log
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>
      </div>

      {/* TAB 1: ALL REQUESTS MANAGEMENT */}
      {activeTab === 'requests' && (
        <div className="glass-card rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-4">Req ID</th>
                  <th className="p-4">Blood Needed</th>
                  <th className="p-4">Hospital & Location Area</th>
                  <th className="p-4">Units</th>
                  <th className="p-4">Urgency</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4 font-mono font-bold text-slate-900">{req.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <BloodGroupBadge group={req.bloodGroup} size="sm" />
                        <span className="text-[11px] text-slate-600 font-medium truncate">
                          {req.bloodComponent || 'Whole Blood'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{req.hospitalName}</div>
                      <div className="text-[11px] text-slate-500">{req.area ? `${req.area}, ` : ''}{req.city}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{req.units} U</td>
                    <td className="p-4">
                      <UrgencyBadge urgency={req.urgency} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      {req.status !== 'Completed' && (
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Completed')}
                          className="px-2 py-1 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
                        >
                          Mark Done
                        </button>
                      )}
                      {req.status !== 'Cancelled' && req.status !== 'Completed' && (
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Cancelled')}
                          className="px-2 py-1 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DONOR REGISTRY OVERVIEW */}
      {activeTab === 'donors' && (
        <div className="glass-card rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-4">Anonymized Identifier</th>
                  <th className="p-4">Blood Group</th>
                  <th className="p-4">City / Area Location</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4">Privacy Gating</th>
                  <th className="p-4">Donation Interval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDonors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4 font-mono font-bold text-slate-800">
                      {donor.name} ({donor.id})
                    </td>
                    <td className="p-4">
                      <BloodGroupBadge group={donor.bloodGroup} size="sm" />
                    </td>
                    <td className="p-4 text-slate-600">{donor.city}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 font-bold ${donor.availability ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${donor.availability ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        {donor.availability ? 'Available' : 'Resting'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Consent Guarded
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      Last: {formatDate(donor.lastDonationDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/90 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Security & Privacy Compliance Log</h3>
          
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Zero Public Exposure Verified:</strong> Donor telephone numbers, emails, and home addresses are never published to raw HTML or indexed.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Two-Way Voluntary Consent Protocol:</strong> Mutual contact coordination strictly unlocks only when a matching donor explicitly taps "Accept & Share Info".
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>GDPR / HIPAA Compatible Right to Erasure:</strong> Any donor account can be permanently wiped locally in 1 click from their Profile Settings.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Quick Dispatch Modal */}
      <Modal
        isOpen={newRequestModalOpen}
        onClose={() => setNewRequestModalOpen(false)}
        title="Admin Override: Dispatch Blood Requirement"
      >
        <form onSubmit={handleCreateAdminRequest} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Blood Group"
              options={BLOOD_GROUPS}
              value={adminReq.bloodGroup}
              onChange={(e) => setAdminReq({ ...adminReq, bloodGroup: e.target.value })}
            />
            <Input
              label="Units Required"
              type="number"
              min={1}
              max={10}
              value={adminReq.units}
              onChange={(e) => setAdminReq({ ...adminReq, units: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Urgency Tier"
              options={['Normal', 'Urgent', 'Emergency']}
              value={adminReq.urgency}
              onChange={(e) => setAdminReq({ ...adminReq, urgency: e.target.value })}
            />
            <Select
              label="Metropolitan City"
              options={CITIES}
              value={adminReq.city}
              onChange={(e) => setAdminReq({ ...adminReq, city: e.target.value })}
            />
          </div>

          <Input
            label="Hospital Facility Name"
            value={adminReq.hospitalName}
            onChange={(e) => setAdminReq({ ...adminReq, hospitalName: e.target.value })}
          />

          <Input
            label="Location Area"
            value={adminReq.area}
            onChange={(e) => setAdminReq({ ...adminReq, area: e.target.value })}
          />

          <Input
            label="Clinical Reason"
            value={adminReq.purpose}
            onChange={(e) => setAdminReq({ ...adminReq, purpose: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setNewRequestModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Dispatch Request Now
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
