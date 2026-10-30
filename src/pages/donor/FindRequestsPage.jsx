import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBloodData } from '../../context/BloodDataContext';
import { Search, Filter, MapPin, Heart, Flame } from 'lucide-react';
import { RequestCard } from '../../components/request/RequestCard';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { BLOOD_GROUPS, CITIES } from '../../utils/constants';

export function FindRequestsPage() {
  const { currentUser } = useAuth();
  const { requests, respondToRequest } = useBloodData();

  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');

  const filteredRequests = requests.filter((req) => {
    if (req.status === 'Completed' || req.status === 'Cancelled') return false;
    if (selectedGroup !== 'ALL' && req.bloodGroup !== selectedGroup) return false;
    if (selectedCity !== 'ALL' && req.city !== selectedCity) return false;
    if (urgencyFilter !== 'ALL' && req.urgency !== urgencyFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Find Blood Requests' }]} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Browse Live Blood Requirements
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review verified patient & hospital needs across regions
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200/90 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Blood Group</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white"
          >
            <option value="ALL">All Blood Groups</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Location Region</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white"
          >
            <option value="ALL">All Metropolitan Cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Urgency Priority</label>
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white"
          >
            <option value="ALL">All Urgencies</option>
            <option value="Emergency">Emergency Only (Critical)</option>
            <option value="Urgent">Urgent</option>
            <option value="Normal">Normal</option>
          </select>
        </div>
      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No blood requirements match this filter"
          description="Try broadening your filter criteria or changing the metropolitan region."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              userRole="donor"
              onAccept={(reqId) => respondToRequest(reqId, currentUser?.id, 'accept', true)}
              onDecline={(reqId) => respondToRequest(reqId, currentUser?.id, 'decline', false)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
