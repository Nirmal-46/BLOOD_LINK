import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBloodData } from '../../context/BloodDataContext';
import { 
  Heart, 
  ShieldCheck, 
  Clock, 
  Activity, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ToggleLeft, 
  ToggleRight,
  Sliders,
  Bell,
  Search
} from 'lucide-react';
import { BloodGroupBadge } from '../../components/common/BloodGroupBadge';
import { Button } from '../../components/common/Button';
import { RequestCard } from '../../components/request/RequestCard';
import { EligibilityCard } from '../../components/donor/EligibilityCard';
import { PrivacySettingsCard } from '../../components/donor/PrivacySettingsCard';
import { EmptyState } from '../../components/common/EmptyState';
import { SmartPickupCard } from '../../components/pickup/SmartPickupCard';
import { calculateMatchScore } from '../../utils/bloodCompatibility';

export function DonorDashboardPage() {
  const { currentUser } = useAuth();
  const { 
    requests, 
    toggleDonorAvailability, 
    respondToRequest, 
    updateRequestStatus 
  } = useBloodData();

  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'eligibility' | 'privacy'

  // Filter requests that are compatible with this donor
  const matchingRequests = requests.filter((req) => {
    if (req.status === 'Completed' || req.status === 'Cancelled') return false;
    const match = calculateMatchScore(currentUser, req);
    return match.compatible;
  });

  const confirmedRequests = requests.filter(
    (req) => req.status === 'Confirmed' && req.confirmedDonorId === currentUser?.id
  );

  return (
    <div className="space-y-8">
      
      {/* 1. Welcome Header & Live Availability Hero Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/90 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4">
            <BloodGroupBadge group={currentUser?.bloodGroup || 'O+'} size="xl" className="shadow-md" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Welcome back, {currentUser?.name}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  Verified Donor
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Operating in <strong>{currentUser?.city}</strong> • Shielded Contact Mode Active
              </p>
            </div>
          </div>

          {/* Availability Toggle Switch */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    currentUser?.availability ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
                <span>{currentUser?.availability ? 'Ready to Donate' : 'Temporarily Resting'}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {currentUser?.availability
                  ? 'Receiving urgent nearby alerts'
                  : 'Matching paused'}
              </div>
            </div>

            <button
              onClick={() => toggleDonorAvailability(currentUser?.id)}
              className={`p-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-2xs ${
                currentUser?.availability
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {currentUser?.availability ? 'Turn Off' : 'Turn On'}
            </button>
          </div>

        </div>
      </div>

      {/* 2. Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Status</span>
            <div className={`w-2 h-2 rounded-full ${currentUser?.availability ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          </div>
          <div className="text-xl font-black text-slate-900">
            {currentUser?.availability ? 'Available' : 'Resting'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Live dispatch status</div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Active Needs</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-black text-rose-600">
            {matchingRequests.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Compatible patients</div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Donations Done</span>
            <Heart className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-slate-900">
            {currentUser?.totalDonations || 4}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Lives supported</div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Privacy Guard</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-black text-indigo-900">
            100% Shielded
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Consent gated</div>
        </div>

      </div>

      {/* Smart Emergency Pickup Point Promo */}
      <SmartPickupCard
        donorLocation={currentUser?.city?.split(',')[0] || 'Coimbatore'}
        recipientLocation="Salem (Emergency Surgical Unit)"
        timeSaved="1h 50m"
      />

      {/* 3. Tab navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Matching Blood Requests ({matchingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('eligibility')}
          className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'eligibility'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Readiness & 90-Day Cooldown</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'privacy'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy & Notification Settings</span>
        </button>
      </div>

      {/* 4. Tab Content */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {matchingRequests.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No urgent requests matching your blood group right now"
              description="You will automatically receive an in-app alert when a compatible hospital or patient posts an urgent requirement in your region."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchingRequests.map((req) => (
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
      )}

      {activeTab === 'eligibility' && (
        <div className="max-w-2xl">
          <EligibilityCard donor={currentUser} />
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="max-w-2xl">
          <PrivacySettingsCard />
        </div>
      )}

    </div>
  );
}
