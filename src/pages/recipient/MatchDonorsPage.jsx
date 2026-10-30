import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useBloodData } from '../../context/BloodDataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Filter, 
  Search, 
  Flame, 
  Clock, 
  Building2, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';
import { DonorCard } from '../../components/donor/DonorCard';
import { BloodGroupBadge } from '../../components/common/BloodGroupBadge';
import { UrgencyBadge } from '../../components/common/UrgencyBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { CompatibilityMatrixModal } from '../../components/matching/CompatibilityMatrixModal';
import { SmartPickupCard } from '../../components/pickup/SmartPickupCard';
import { calculateMatchScore } from '../../utils/bloodCompatibility';
import { BLOOD_GROUPS, CITIES } from '../../utils/constants';

export function MatchDonorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');

  const { requests, donors, requestConsentFromDonor } = useBloodData();
  const { currentUser } = useAuth();

  const [filterGroup, setFilterGroup] = useState('ALL');
  const [filterCity, setFilterCity] = useState('ALL');
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [matrixOpen, setMatrixOpen] = useState(false);

  // Selected request if requestId is in query
  const targetRequest = requests.find((r) => r.id === requestId) || requests[0];

  // Calculate scores for all donors against the target request
  const scoredDonors = donors.map((donor) => {
    const match = targetRequest
      ? calculateMatchScore(donor, targetRequest)
      : { compatible: true, score: 70, tier: 'General Candidate', tierBadge: 'Candidate' };
    return {
      donor,
      match
    };
  });

  // Filter & sort
  const filteredDonors = scoredDonors
    .filter(({ donor, match }) => {
      if (filterGroup !== 'ALL' && donor.bloodGroup !== filterGroup) return false;
      if (filterCity !== 'ALL' && donor.city !== filterCity) return false;
      if (onlyAvailable && !donor.availability) return false;
      return true;
    })
    .sort((a, b) => (b.match.score || 0) - (a.match.score || 0));

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Donor Matching Console' }]} />

      {/* Target Request Selector Banner */}
      {requests.length > 0 && (
        <div className="glass-card rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600">
                Active Matching Target
              </span>
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-xl font-black text-slate-900">
                  Matching for Request: {targetRequest?.id}
                </h2>
                <BloodGroupBadge group={targetRequest?.bloodGroup} size="md" />
                <UrgencyBadge urgency={targetRequest?.urgency} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {targetRequest?.hospitalName} • {targetRequest?.city} • {targetRequest?.units} Units Needed
              </p>
            </div>

            {/* Quick Switcher of Requests */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 hidden sm:inline">Switch Target:</label>
              <select
                value={targetRequest?.id}
                onChange={(e) => setSearchParams({ requestId: e.target.value })}
                className="text-xs font-bold p-2 rounded-xl border border-slate-200 bg-white"
              >
                {requests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id} ({r.bloodGroup} - {r.urgency})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Smart Emergency Pickup Point Banner */}
      <SmartPickupCard
        donorLocation="Coimbatore (Compatible Donors)"
        recipientLocation={targetRequest?.city?.split(',')[0] || 'Salem'}
        timeSaved="1h 50m"
      />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Compatible Donor Pool
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Donors are scored using transparent ABO/Rh biology, proximity, and availability heuristics.
          </p>
        </div>

        <button
          onClick={() => setMatrixOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition border border-rose-200 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explain Compatibility Rules</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200/90 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Blood Group</label>
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white"
          >
            <option value="ALL">All Compatible Types</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Location Region</label>
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white"
          >
            <option value="ALL">All Metropolitan Cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end pb-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
            />
            <span>Show Only Ready Donors</span>
          </label>
        </div>
      </div>

      {/* Donors Grid */}
      {filteredDonors.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No donors match your criteria"
          description="Try broadening the filters to view universal donors or adjacent metropolitan regions."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map(({ donor, match }) => (
            <DonorCard
              key={donor.id}
              donor={donor}
              matchResult={match}
              consentGranted={
                targetRequest?.contactConsentGranted &&
                (targetRequest?.matchedDonorIds?.includes(donor.id) ||
                  targetRequest?.confirmedDonorId === donor.id)
              }
              onRequestConsent={() =>
                requestConsentFromDonor(targetRequest?.id, donor.id)
              }
            />
          ))}
        </div>
      )}

      <CompatibilityMatrixModal
        isOpen={matrixOpen}
        onClose={() => setMatrixOpen(false)}
      />
    </div>
  );
}
