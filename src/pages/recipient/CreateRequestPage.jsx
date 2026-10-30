import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBloodData } from '../../context/BloodDataContext';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Droplet, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft,
  Flame,
  Sparkles,
  Info,
  Navigation,
  Layers,
  Heart
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { BloodGroupBadge } from '../../components/common/BloodGroupBadge';
import { UrgencyBadge } from '../../components/common/UrgencyBadge';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { BLOOD_GROUPS, BLOOD_COMPONENTS, CITIES, POPULAR_HOSPITALS } from '../../utils/constants';
import { COMPATIBILITY_CHART } from '../../utils/bloodCompatibility';

export function CreateRequestPage() {
  const { currentUser } = useAuth();
  const { addBloodRequest } = useBloodData();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [createdRequest, setCreatedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    bloodGroup: 'O+',
    bloodComponent: 'whole_blood',
    units: 2,
    urgency: 'Urgent',
    hospitalName: 'PSG Institute of Medical Sciences & Hospital',
    city: currentUser?.city || CITIES[0],
    area: 'Peelamedu, Avinashi Road',
    pincode: '641004',
    requiredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    patientAge: 35,
    patientGender: 'Male',
    purpose: 'Urgent surgical bypass operation',
    notes: '',
    deliveryPreference: 'direct', // 'direct' or 'smart_pickup'
    maxTravelTime: '60 min',
    preferredPickupArea: '',
    privacyConsent: true
  });

  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const errs = {};
    if (!formData.bloodGroup) errs.bloodGroup = 'Blood group is required';
    if (!formData.units || formData.units < 1 || formData.units > 10) {
      errs.units = 'Units required must be between 1 and 10';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.hospitalName.trim()) errs.hospitalName = 'Hospital/Facility name is required';
    if (!formData.city) errs.city = 'City region is required';
    if (!formData.area.trim()) errs.area = 'Specific Area/Neighborhood is required';
    if (!formData.requiredDate) errs.requiredDate = 'Required date is required';
    if (!formData.purpose.trim()) errs.purpose = 'Clinical purpose is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleDetectLocation = () => {
    setLocating(true);
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        city: 'Coimbatore, Tamil Nadu',
        area: 'Peelamedu Central Trauma Hub',
        pincode: '641004'
      }));
      setLocating(false);
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.privacyConsent) {
      setErrors({ privacyConsent: 'You must confirm the privacy & verification agreement' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const selectedComp = BLOOD_COMPONENTS.find((c) => c.id === formData.bloodComponent)?.label || 'Whole Blood';
      const newReq = addBloodRequest({
        bloodGroup: formData.bloodGroup,
        bloodComponent: selectedComp,
        units: Number(formData.units),
        urgency: formData.urgency,
        hospitalName: formData.hospitalName,
        city: formData.city,
        area: formData.area,
        pincode: formData.pincode,
        requiredDate: formData.requiredDate,
        patientAge: Number(formData.patientAge),
        patientGender: formData.patientGender,
        purpose: formData.purpose,
        notes: formData.notes
      });

      setLoading(false);
      setCreatedRequest(newReq);
    }, 500);
  };

  // Compatible donor groups for selected recipient group
  const compatibleDonorsList = COMPATIBILITY_CHART[formData.bloodGroup]?.canReceiveFrom || [];

  // Success Screen
  if (createdRequest) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-200 text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Blood Requirement Dispatched</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Blood Request Created Successfully
            </h2>
            <div className="inline-block px-3 py-1 rounded-xl bg-slate-100 font-mono text-sm font-bold text-slate-800 border border-slate-200">
              Request ID: {createdRequest.id}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Blood Component Needed:</span>
              <span className="font-bold text-slate-900">{createdRequest.bloodComponent || 'Whole Blood'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Target Blood Group:</span>
              <BloodGroupBadge group={createdRequest.bloodGroup} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Units Needed:</span>
              <span className="font-bold text-slate-800">{createdRequest.units} Units</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Hospital & Area Location:</span>
              <span className="font-bold text-slate-800">{createdRequest.hospitalName} ({createdRequest.area || createdRequest.city})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Matching Status:</span>
              <span className="font-bold text-blue-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {createdRequest.matchedDonorIds?.length || 0} Compatible Donors Identified
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to={`/recipient/match?requestId=${createdRequest.id}`} className="flex-1">
              <Button variant="primary" size="lg" className="w-full font-bold">
                View & Contact Matched Donors
              </Button>
            </Link>
            <Link to="/recipient/dashboard" className="sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: 'Create Blood Request' }]} />

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 mb-2">
          <Droplet className="w-3.5 h-3.5 fill-rose-600" />
          <span>Requirement Coordinator</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Post Blood Requirement
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Specify exact blood component type, hospital location, and urgency for rapid donor matching.
        </p>
      </div>

      {/* 3-Step Indicator */}
      <div className="flex items-center justify-between max-w-xl mx-auto px-4">
        {[
          { num: 1, label: '1. What Blood We Need' },
          { num: 2, label: '2. Location & Hospital' },
          { num: 3, label: '3. Review & Dispatch' }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                step === s.num
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 ring-4 ring-rose-100'
                  : step > s.num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {step > s.num ? '✓' : s.num}
            </div>
            <span
              className={`text-xs font-bold hidden sm:inline ${
                step === s.num ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Wizard Form Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: What Blood We Need (Group, Component & Urgency) */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Blood Group Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Target Patient Blood Group <span className="text-rose-600">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Can receive from: <strong className="text-slate-800">{compatibleDonorsList.join(', ')}</strong>
                  </span>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                      className={`py-2.5 px-1 rounded-xl text-xs font-extrabold transition border cursor-pointer ${
                        formData.bloodGroup === bg
                          ? 'bg-gradient-to-br from-rose-600 to-red-700 text-white border-rose-600 shadow-md scale-105 ring-2 ring-rose-200'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
                {errors.bloodGroup && <p className="text-xs text-rose-600">{errors.bloodGroup}</p>}
              </div>

              {/* Blood Component Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  What Blood Component Do You Need? <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BLOOD_COMPONENTS.map((comp) => (
                    <button
                      key={comp.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, bloodComponent: comp.id })}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        formData.bloodComponent === comp.id
                          ? 'border-rose-500 bg-rose-50/70 text-rose-950 shadow-2xs ring-1 ring-rose-300 font-bold'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                        <span>{comp.label}</span>
                        {formData.bloodComponent === comp.id && (
                          <CheckCircle2 className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{comp.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Units and Patient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Units Required (Bags of 350-450ml)"
                  type="number"
                  min={1}
                  max={10}
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  error={errors.units}
                  required
                />

                <Input
                  label="Patient Age"
                  type="number"
                  min={1}
                  max={100}
                  value={formData.patientAge}
                  onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                />

                <Select
                  label="Patient Gender"
                  options={['Male', 'Female', 'Other']}
                  value={formData.patientGender}
                  onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                />
              </div>

              {/* Urgency Selection Cards */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Urgency Priority <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Normal', label: 'Normal', desc: 'Within 24-48 hrs (Scheduled)' },
                    { id: 'Urgent', label: 'Urgent', desc: 'Within 6-12 hrs (Priority)' },
                    { id: 'Emergency', label: 'Emergency', desc: 'Immediate (< 2 hrs Critical)' }
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: u.id })}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        formData.urgency === u.id
                          ? u.id === 'Emergency'
                            ? 'border-rose-500 bg-rose-50 text-rose-900 shadow-xs ring-2 ring-rose-200'
                            : 'border-rose-500 bg-rose-50/70 text-rose-900 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{u.label}</div>
                      <div className="text-[10px] text-slate-500">{u.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency Delivery Preference */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800">
                  Emergency Delivery Preference <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryPreference: 'direct' })}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${
                      formData.deliveryPreference === 'direct'
                        ? 'border-rose-500 bg-rose-50/70 text-slate-900 ring-2 ring-rose-200'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery_pref"
                      checked={formData.deliveryPreference === 'direct'}
                      onChange={() => {}}
                      className="mt-1 text-rose-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Direct Hospital Delivery</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Donor travels directly to the designated recipient hospital facility.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryPreference: 'smart_pickup' })}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${
                      formData.deliveryPreference === 'smart_pickup'
                        ? 'border-rose-500 bg-rose-50/70 text-slate-900 ring-2 ring-rose-200 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery_pref"
                      checked={formData.deliveryPreference === 'smart_pickup'}
                      onChange={() => {}}
                      className="mt-1 text-rose-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                        <span>Smart Emergency Pickup Point</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Calculates an optimal public meeting/handover point if donor is far away.
                      </div>
                    </div>
                  </button>
                </div>

                {/* Smart Pickup Extended Configuration */}
                {formData.deliveryPreference === 'smart_pickup' && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/80 to-amber-50/60 border border-rose-200 space-y-3 animate-in fade-in">
                    <div className="flex items-start gap-2.5 text-xs text-rose-950">
                      <Sparkles className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        <strong>Smart Pickup Point</strong> finds a practical meeting location between the donor and recipient to reduce travel time during urgent requests.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-600 block mb-1">
                          Maximum Acceptable Travel Time
                        </label>
                        <select
                          value={formData.maxTravelTime}
                          onChange={(e) => setFormData({ ...formData, maxTravelTime: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                        >
                          <option value="30 min">30 Minutes (Rapid Intercept)</option>
                          <option value="45 min">45 Minutes (Standard Regional)</option>
                          <option value="60 min">60 Minutes (Inter-City Midpoint)</option>
                          <option value="90 min">90 Minutes (State Highway Corridor)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-600 block mb-1">
                          Preferred Pickup Landmark / Area (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Erode GH / Perundurai NH Toll"
                          value={formData.preferredPickupArea}
                          onChange={(e) => setFormData({ ...formData, preferredPickupArea: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button type="button" variant="primary" onClick={handleNext} icon={ArrowRight}>
                  Continue to Hospital & Location
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Hospital & Location Details */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Location Bar with Quick Detect */}
              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-rose-900">
                  <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>Proximity Radius: Matching donors within 15 km metropolitan radius</span>
                </div>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={locating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-50 transition cursor-pointer flex-shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5 text-rose-600" />
                  <span>{locating ? 'Detecting...' : 'Auto Detect Location'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Metropolitan City / Region"
                  options={CITIES}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  error={errors.city}
                  required
                />

                <Input
                  label="Specific Area / Neighborhood / Landmark"
                  placeholder="e.g. Peelamedu, Avinashi Road, Gandhipuram"
                  icon={MapPin}
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  error={errors.area}
                  helperText="Helps calculate donor proximity"
                  required
                />
              </div>

              {/* Hospital Selection with Quick Suggestions */}
              <div className="space-y-2">
                <Input
                  label="Hospital / Blood Bank Facility Name"
                  placeholder="e.g. PSG Institute of Medical Sciences / Apollo Hospital"
                  icon={Building2}
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  error={errors.hospitalName}
                  required
                />

                {POPULAR_HOSPITALS[formData.city] && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Pick:</span>
                    {POPULAR_HOSPITALS[formData.city].slice(0, 3).map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setFormData({ ...formData, hospitalName: h.split(' (')[0] })}
                        className="text-[10px] font-semibold bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 transition"
                      >
                        {h.split(' (')[0]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Postal PIN Code"
                  placeholder="641004"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />

                <Input
                  label="Required Date"
                  type="date"
                  value={formData.requiredDate}
                  onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                  error={errors.requiredDate}
                  required
                />
              </div>

              <Input
                label="Clinical Diagnosis / Reason for Transfusion"
                placeholder="e.g. Open heart surgery, Acute trauma accident, Thalassemia monthly transfusion"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                error={errors.purpose}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Additional Notes for Attending Medical Coordinator
                </label>
                <textarea
                  rows={2}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  placeholder="Room/Ward number, special cross-matching requirements, or doctor name..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button type="button" variant="secondary" onClick={() => setStep(1)} icon={ArrowLeft}>
                  Back
                </Button>
                <Button type="button" variant="primary" onClick={handleNext} icon={ArrowRight}>
                  Review Requirement
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Privacy Agreement */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-200">
                  Requirement Dispatch Summary
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Required Blood Group:</span>
                    <BloodGroupBadge group={formData.bloodGroup} size="sm" className="mt-1" />
                  </div>
                  <div>
                    <span className="text-slate-500 block">Component Type:</span>
                    <span className="font-bold text-slate-900 mt-1 block">
                      {BLOOD_COMPONENTS.find((c) => c.id === formData.bloodComponent)?.label || 'Whole Blood'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Urgency Priority:</span>
                    <UrgencyBadge urgency={formData.urgency} className="mt-1" />
                  </div>
                  <div>
                    <span className="text-slate-500 block">Units Required:</span>
                    <span className="font-bold text-slate-800">{formData.units} Units</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date Needed:</span>
                    <span className="font-bold text-slate-800">{formData.requiredDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Patient Profile:</span>
                    <span className="font-bold text-slate-800">{formData.patientAge} Yrs ({formData.patientGender})</span>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <span className="text-slate-500 block">Facility & Area Location:</span>
                    <span className="font-bold text-slate-800">
                      {formData.hospitalName} • {formData.area}, {formData.city} (PIN: {formData.pincode || 'N/A'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Privacy Shield Notice */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-900 leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block mb-0.5">Privacy Assurance:</strong>
                  Your requirement will be broadcast to candidate donors in {formData.city.split(',')[0]} as a masked request. Donors will review the hospital location and choose to coordinate voluntarily.
                </div>
              </div>

              <div className="space-y-1">
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacyConsent}
                    onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 mt-0.5"
                  />
                  <span>
                    I confirm this blood requirement is genuine and authorize matching with verified donors via BloodConnect.
                  </span>
                </label>
                {errors.privacyConsent && (
                  <p className="text-xs text-rose-600 font-medium">{errors.privacyConsent}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button type="button" variant="secondary" onClick={() => setStep(2)} icon={ArrowLeft}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  icon={Droplet}
                  className="font-bold shadow-lg shadow-rose-600/20"
                >
                  Confirm & Broadcast Request
                </Button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
