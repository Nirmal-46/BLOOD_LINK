import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBloodData } from '../../context/BloodDataContext';
import { 
  PlusCircle, 
  Flame, 
  Users, 
  Search, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Building2, 
  Heart,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { RequestCard } from '../../components/request/RequestCard';
import { EmptyState } from '../../components/common/EmptyState';
import { SmartPickupCard } from '../../components/pickup/SmartPickupCard';

export function RecipientDashboardPage() {
  const { currentUser } = useAuth();
  const { requests, donors, updateRequestStatus } = useBloodData();

  // Requests created by this user or all active if hospital
  const myRequests = requests.filter(
    (r) => r.requesterId === currentUser?.id || currentUser?.role === 'hospital' || currentUser?.role === 'admin'
  );

  const activeCount = myRequests.filter((r) => r.status !== 'Completed' && r.status !== 'Cancelled').length;
  const completedCount = myRequests.filter((r) => r.status === 'Completed').length;
  const emergencyCount = myRequests.filter((r) => r.urgency === 'Emergency' && r.status !== 'Completed').length;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
              {currentUser?.role === 'hospital' ? 'Verified Hospital Desk' : 'Recipient Coordinator'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {currentUser?.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage active blood requirements, review privacy-shielded matches, and track donation status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/recipient/emergency">
            <Button variant="emergency" size="md" className="pulse-emergency font-bold text-xs" icon={Flame}>
              Emergency Broadcast
            </Button>
          </Link>

          <Link to="/recipient/request">
            <Button variant="primary" size="md" className="font-bold text-xs shadow-md" icon={PlusCircle}>
              New Blood Request
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Active Needs</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">In progress</div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Emergency</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">{emergencyCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Immediate priority</div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Fulfilled</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{completedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Transfusions scheduled</div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Matching Pool</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-900">{donors.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Registered donors</div>
        </div>

      </div>

      {/* Smart Pickup Point Promo Card */}
      <SmartPickupCard
        donorLocation="Coimbatore, Tamil Nadu"
        recipientLocation="Salem, Tamil Nadu"
        timeSaved="1h 50m"
      />

      {/* Active Requests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Active Blood Requirements</h2>
          <Link to="/recipient/request" className="text-xs font-bold text-rose-600 hover:underline">
            + Post Requirement
          </Link>
        </div>

        {myRequests.length === 0 ? (
          <EmptyState
            icon={PlusCircle}
            title="No blood requirements created yet"
            description="Submit your patient requirement or emergency transfusion request to match with verified compatible donors."
            actionLabel="Create Blood Request"
            onAction={() => window.location.assign('/recipient/request')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myRequests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                userRole={currentUser?.role}
                onStatusChange={updateRequestStatus}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
