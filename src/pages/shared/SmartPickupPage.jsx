import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBloodData } from '../../context/BloodDataContext';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Flame, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  Radio, 
  Layers, 
  Zap, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { BloodGroupBadge } from '../../components/common/BloodGroupBadge';
import { EmergencyTimer } from '../../components/pickup/EmergencyTimer';
import { PickupPointMap } from '../../components/pickup/PickupPointMap';
import { PickupPointOption } from '../../components/pickup/PickupPointOption';
import { TravelEstimate } from '../../components/pickup/TravelEstimate';
import { PickupTimeline, PICKUP_STAGES } from '../../components/pickup/PickupTimeline';
import { PickupConfirmationModal } from '../../components/pickup/PickupConfirmationModal';
import { 
  calculateSmartPickupPoints, 
  getHackathonDemoScenario, 
  CITY_COORDINATES 
} from '../../utils/pickupPoint';
import { CITIES, BLOOD_GROUPS } from '../../utils/constants';

export function SmartPickupPage() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Scenario Selection State
  const [donorCity, setDonorCity] = useState('Coimbatore, Tamil Nadu');
  const [recipientCity, setRecipientCity] = useState('Salem, Tamil Nadu');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [units, setUnits] = useState(2);
  const [emergencyMinutes, setEmergencyMinutes] = useState(120);

  // Computed Pickup Calculation
  const [pickupData, setPickupData] = useState(() =>
    calculateSmartPickupPoints('Coimbatore, Tamil Nadu', 'Salem, Tamil Nadu', 120)
  );

  // Selected Option
  const [selectedOption, setSelectedOption] = useState(null);

  // Timeline Stage (0 to 8)
  const [currentStageIndex, setCurrentStageIndex] = useState(2); // Starts at "Pickup Point Suggested"

  // Modal State
  const [modalRole, setModalRole] = useState(null); // 'donor' or 'recipient'

  // Recalculate whenever cities change
  useEffect(() => {
    const result = calculateSmartPickupPoints(donorCity, recipientCity, emergencyMinutes);
    setPickupData(result);
    if (result.recommendedPickupPoint) {
      setSelectedOption(result.recommendedPickupPoint);
    }
  }, [donorCity, recipientCity, emergencyMinutes]);

  // Load Hackathon Demo Scenario
  const handleLoadDemo = () => {
    setDonorCity('Coimbatore, Tamil Nadu');
    setRecipientCity('Salem, Tamil Nadu');
    setBloodGroup('O+');
    setUnits(2);
    setEmergencyMinutes(120);
    setCurrentStageIndex(2); // Suggested

    const result = calculateSmartPickupPoints('Coimbatore, Tamil Nadu', 'Salem, Tamil Nadu', 120);
    setPickupData(result);
    setSelectedOption(result.recommendedPickupPoint);
  };

  const handleDonorConfirm = (option) => {
    setSelectedOption(option);
    setCurrentStageIndex(3); // Donor Accepted
    setModalRole(null);
  };

  const handleRecipientConfirm = (option) => {
    setSelectedOption(option);
    setCurrentStageIndex(4); // Recipient Confirmed
    setModalRole(null);
  };

  const activeOption = selectedOption || pickupData.recommendedPickupPoint;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: 'Smart Emergency Pickup Point' }]} />

      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white p-6 sm:p-9 border border-rose-800/80 shadow-2xl space-y-6">
        
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Emergency Logistics</span>
              </span>
              <span className="text-xs font-bold text-amber-300 bg-amber-950/70 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
                Hackathon Innovation Feature
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Smart Emergency Pickup Point
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When compatible donors and hospital emergency rooms are separated by long inter-city distances, Smart Pickup Point dynamically determines an optimal, certified healthcare meeting location between them to slash transit delay in half.
            </p>
          </div>

          {/* Quick Demo Trigger Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={handleLoadDemo}
              icon={Sparkles}
              className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 font-black shadow-xl shadow-rose-600/40 text-xs sm:text-sm cursor-pointer"
            >
              ⚡ Load Coimbatore ➔ Salem Demo
            </Button>
            <EmergencyTimer initialMinutes={95} urgency="Emergency" />
          </div>
        </div>

        {/* Live Scenario Controls Bar */}
        <div className="relative z-10 pt-4 border-t border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
              Donor City (Origin)
            </label>
            <select
              value={donorCity}
              onChange={(e) => setDonorCity(e.target.value)}
              className="w-full bg-slate-950/80 text-white border border-slate-700 rounded-xl px-3 py-2 font-bold text-xs"
            >
              {Object.keys(CITY_COORDINATES).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
              Recipient City (Destination)
            </label>
            <select
              value={recipientCity}
              onChange={(e) => setRecipientCity(e.target.value)}
              className="w-full bg-slate-950/80 text-white border border-slate-700 rounded-xl px-3 py-2 font-bold text-xs"
            >
              {Object.keys(CITY_COORDINATES).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
              Blood Group & Units
            </label>
            <div className="flex gap-2">
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-1/2 bg-slate-950/80 text-rose-400 border border-slate-700 rounded-xl px-2 py-2 font-black text-xs"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
              <select
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="w-1/2 bg-slate-950/80 text-white border border-slate-700 rounded-xl px-2 py-2 font-bold text-xs"
              >
                {[1, 2, 3, 4, 5].map((u) => (
                  <option key={u} value={u}>{u} Unit(s)</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-700 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Direct Distance:</span>
              <strong className="text-white font-mono">{pickupData.directTrip.distanceKm} km</strong>
            </div>
          </div>
        </div>

      </div>

      {/* 9-Stage Interactive Timeline */}
      <PickupTimeline
        currentStageIndex={currentStageIndex}
        onAdvanceStage={(newIdx) => setCurrentStageIndex(newIdx)}
      />

      {/* Map Visualizer Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span>Corridor Transit Radar & Handover Map</span>
            </h2>
            <p className="text-xs text-slate-500">
              Visualizing the synchronized dual-departure transit path to the verified meeting point.
            </p>
          </div>

          {/* Action Trigger Buttons for 2-Party Confirmation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalRole('donor')}
              icon={UserCheck}
              className="text-xs font-bold border-rose-300 text-rose-700 hover:bg-rose-50"
            >
              {currentStageIndex >= 3 ? '✓ Donor Accepted' : 'Simulate Donor Acceptance'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setModalRole('recipient')}
              icon={Building2}
              className="text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30"
            >
              {currentStageIndex >= 4 ? '✓ Recipient Confirmed' : 'Simulate Recipient Confirmation'}
            </Button>
          </div>
        </div>

        <PickupPointMap
          donorLocation={donorCity}
          recipientLocation={recipientCity}
          pickupPoint={activeOption}
          donorTimeFormatted={activeOption?.donorTimeFormatted}
          recipientTimeFormatted={activeOption?.recipientTimeFormatted}
          totalCoordinationFormatted={activeOption?.totalCoordinationFormatted}
          activeStage={PICKUP_STAGES[currentStageIndex]?.key}
        />
      </div>

      {/* Travel Efficiency Breakdown */}
      <TravelEstimate
        directDistanceKm={pickupData.directTrip.distanceKm}
        directTravelFormatted={pickupData.directTrip.formattedTime}
        pickupPointName={activeOption?.name}
        donorTimeFormatted={activeOption?.donorTimeFormatted}
        recipientTimeFormatted={activeOption?.recipientTimeFormatted}
        totalCoordinationFormatted={activeOption?.totalCoordinationFormatted}
        timeSavedFormatted={activeOption?.travelTimeSavedFormatted}
      />

      {/* Generated 2-3 Candidate Pickup Points */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Recommended Candidate Meeting Locations ({pickupData.pickupOptions.length} Options Generated)
            </h3>
            <p className="text-xs text-slate-500">
              Calculated based on distance balance, 24/7 cold-chain blood bank facilities, and emergency access.
            </p>
          </div>

          <span className="text-[11px] font-semibold text-slate-500">
            Click any card to select as active handover point
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pickupData.pickupOptions.map((option, idx) => (
            <PickupPointOption
              key={option.id}
              option={option}
              index={idx}
              isSelected={activeOption?.id === option.id}
              onSelect={(opt) => setSelectedOption(opt)}
            />
          ))}
        </div>
      </div>

      {/* Two-Party Confirmation Dialog */}
      <PickupConfirmationModal
        isOpen={Boolean(modalRole)}
        role={modalRole || 'donor'}
        pickupPoint={activeOption}
        bloodGroup={bloodGroup}
        units={units}
        donorTravelFormatted={activeOption?.donorTimeFormatted}
        recipientTravelFormatted={activeOption?.recipientTimeFormatted}
        totalCoordinationFormatted={activeOption?.totalCoordinationFormatted}
        onClose={() => setModalRole(null)}
        onConfirm={modalRole === 'donor' ? handleDonorConfirm : handleRecipientConfirm}
        onDecline={() => setModalRole(null)}
      />

    </div>
  );
}
