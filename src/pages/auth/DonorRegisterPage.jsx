import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Heart, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Lock, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { BloodGroupBadge } from '../../components/common/BloodGroupBadge';
import { BLOOD_GROUPS, CITIES, ROLES, CONTACT_METHODS } from '../../utils/constants';

export function DonorRegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: 26,
    bloodGroup: 'O+',
    city: CITIES[0],
    availability: true,
    lastDonationDate: '2026-03-01',
    hasDonatedBefore: true,
    preferredContactMethod: 'in_app',
    // Screening Checkpoints
    screening: {
      weightAbove50kg: true,
      noRecentTattoo: true,
      noMajorSurgery: true,
      notFeelingSick: true
    },
    privacyConsent: true,
    medicalDisclaimerConsent: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Valid email is required';
    if (!formData.password || formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required for verified matching';
    if (formData.age < 18 || formData.age > 65) errs.age = 'Blood donors must typically be between 18 and 65 years';
    if (!formData.privacyConsent) errs.privacyConsent = 'You must acknowledge the privacy & consent terms';
    if (!formData.medicalDisclaimerConsent) errs.medicalDisclaimerConsent = 'You must acknowledge the medical verification disclaimer';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const res = register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: ROLES.DONOR,
        bloodGroup: formData.bloodGroup,
        city: formData.city,
        age: Number(formData.age),
        availability: formData.availability,
        lastDonationDate: formData.hasDonatedBefore ? formData.lastDonationDate : null,
        screening: formData.screening,
        preferredContactMethod: formData.preferredContactMethod,
        privacySettings: {
          sharePhoneOnlyAfterConsent: true,
          hideFromPublicSearch: false,
          allowEmergencyBroadcasts: true
        },
        consent: true,
        totalDonations: formData.hasDonatedBefore ? 1 : 0
      });

      setLoading(false);
      if (res.success) {
        setRegisteredSuccess(true);
        showToast('Donor profile registered successfully!', 'success');
      }
    }, 500);
  };

  if (registeredSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card rounded-3xl p-8 border border-slate-200 text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Registration Complete!</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your profile as a <strong>{formData.bloodGroup} Donor</strong> has been activated in <strong>{formData.city.split(',')[0]}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Privacy Shielding:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Active
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Current Availability:</span>
              <span className="font-bold text-slate-900">
                {formData.availability ? 'Available for Donation' : 'Resting'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Preferred Channel:</span>
              <span className="font-bold text-slate-900 uppercase">
                {formData.preferredContactMethod.replace('_', ' ')}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full font-bold"
            onClick={() => navigate('/donor/dashboard')}
          >
            Go to Donor Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
          <Heart className="w-3.5 h-3.5 fill-rose-600" />
          <span>Become a Life Saver</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Donor Registration
        </h1>
        <p className="text-xs text-slate-500">
          Join our privacy-protected network. Your identity & contact number remain strictly guarded until you approve a match.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic & Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">1</span>
              Personal & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Legal Name"
                placeholder="e.g. Karthik Subramanian"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                required
              />

              <Input
                label="Age (Years)"
                type="number"
                min={18}
                max={65}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                error={errors.age}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@domain.com"
                icon={Mail}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 98452 11234"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
                helperText="Protected by zero-leak consent gate"
                required
              />
            </div>

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              required
            />
          </div>

          {/* Section 2: Blood Group & Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">2</span>
              Blood Group & Region
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Select Your Blood Group <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {BLOOD_GROUPS.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      formData.bloodGroup === bg
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Metropolitan City / Area"
                options={CITIES}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />

              <Select
                label="Preferred Contact Method"
                options={CONTACT_METHODS}
                value={formData.preferredContactMethod}
                onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Section 3: Donation Readiness & 90-Day Cooldown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">3</span>
              Donation History & Cooldown Interval
            </h3>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasDonatedBefore}
                  onChange={(e) => setFormData({ ...formData, hasDonatedBefore: e.target.checked })}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <span>I have donated blood in the past</span>
              </label>
            </div>

            {formData.hasDonatedBefore && (
              <Input
                label="Date of Last Blood Donation"
                type="date"
                value={formData.lastDonationDate}
                onChange={(e) => setFormData({ ...formData, lastDonationDate: e.target.value })}
                helperText="Used to track the mandatory 90-day whole blood interval"
              />
            )}

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800">Initial Availability Status</div>
                <p className="text-[11px] text-slate-500">You can toggle this on/off anytime from your dashboard</p>
              </div>
              <input
                type="checkbox"
                checked={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Section 4: Self-Reported Health Screening */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">4</span>
              Basic Health Screening (Self-Reported)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/60 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.screening.weightAbove50kg}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      screening: { ...formData.screening, weightAbove50kg: e.target.checked }
                    })
                  }
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">Body Weight ≥ 50 kg (110 lbs)</div>
                  <div className="text-[11px] text-slate-500">Standard requirement for blood volume safety</div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/60 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.screening.noRecentTattoo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      screening: { ...formData.screening, noRecentTattoo: e.target.checked }
                    })
                  }
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">No Tattoos or Piercings in Last 6 Mos</div>
                  <div className="text-[11px] text-slate-500">Safety interval for bloodborne pathogens</div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/60 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.screening.noMajorSurgery}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      screening: { ...formData.screening, noMajorSurgery: e.target.checked }
                    })
                  }
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">No Major Surgeries in Last 6 Mos</div>
                  <div className="text-[11px] text-slate-500">Sufficient physiological recovery</div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/60 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={formData.screening.notFeelingSick}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      screening: { ...formData.screening, notFeelingSick: e.target.checked }
                    })
                  }
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">Currently Feeling Healthy & Well</div>
                  <div className="text-[11px] text-slate-500">No active flu, fever, or antibiotic regimens</div>
                </div>
              </label>
            </div>
          </div>

          {/* Disclaimers & Consents */}
          <div className="space-y-3 pt-2">
            
            {/* Disclaimer Alert */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block mb-0.5">Medical Verification Notice:</strong>
                All screening answers provided here are self-reported for compatibility estimation only. Final clinical eligibility, hemoglobin measurement, and pathogen screening will be conducted by medical staff at the authorized blood center.
              </div>
            </div>

            {/* Checkbox 1: Privacy Consent */}
            <div className="space-y-1">
              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacyConsent}
                  onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 mt-0.5"
                />
                <span>
                  I consent to matching my blood group & approximate city location with emergency requests, understanding that my personal telephone number will <strong>never</strong> be disclosed without my explicit approval per request.
                </span>
              </label>
              {errors.privacyConsent && (
                <p className="text-xs text-rose-600 font-medium">{errors.privacyConsent}</p>
              )}
            </div>

            {/* Checkbox 2: Medical Disclaimer Consent */}
            <div className="space-y-1">
              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.medicalDisclaimerConsent}
                  onChange={(e) =>
                    setFormData({ ...formData, medicalDisclaimerConsent: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 mt-0.5"
                />
                <span>
                  I acknowledge that final blood eligibility is determined exclusively by certified blood bank transfusion personnel.
                </span>
              </label>
              {errors.medicalDisclaimerConsent && (
                <p className="text-xs text-rose-600 font-medium">{errors.medicalDisclaimerConsent}</p>
              )}
            </div>

          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-lg shadow-rose-600/25 text-base"
            loading={loading}
            icon={ArrowRight}
          >
            Register as a Verified Donor
          </Button>

        </form>
      </div>
    </div>
  );
}
