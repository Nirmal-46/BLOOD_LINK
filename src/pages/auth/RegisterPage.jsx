import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Heart, User, Building2, ShieldCheck, ArrowRight, Lock, Mail, MapPin } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ROLES, CITIES } from '../../utils/constants';

export function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState(ROLES.RECIPIENT);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState(CITIES[0]);
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Please enter a valid email';
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!phone.trim()) errs.phone = 'Phone number is required for verified coordination';
    if (!consent) errs.consent = 'You must agree to the privacy and data terms';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === ROLES.DONOR) {
      navigate('/register/donor');
      return;
    }
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const res = register({
        name,
        email,
        role,
        city,
        phone,
        consent
      });
      setLoading(false);
      if (res.success) {
        showToast('Registration successful! Welcome to BloodConnect.', 'success');
        navigate('/recipient/dashboard');
      }
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center text-white shadow-md">
              <Heart className="w-5 h-5 fill-white" />
            </div>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs text-slate-500">
            Select your account type to get started with privacy-first matching
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-lg space-y-6">
          
          {/* Role Chooser Cards */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Choose Account Role</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => navigate('/register/donor')}
                className="p-3 rounded-xl border text-center transition cursor-pointer border-slate-200 hover:border-rose-300 bg-white hover:bg-rose-50/50"
              >
                <Heart className="w-5 h-5 text-rose-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-900">Donor</div>
                <div className="text-[10px] text-slate-500">Donate blood</div>
              </button>

              <button
                type="button"
                onClick={() => setRole(ROLES.RECIPIENT)}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  role === ROLES.RECIPIENT
                    ? 'border-rose-500 bg-rose-50/60 shadow-2xs font-bold'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <User className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-900">Recipient</div>
                <div className="text-[10px] text-slate-500">Request for family</div>
              </button>

              <button
                type="button"
                onClick={() => setRole(ROLES.HOSPITAL)}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  role === ROLES.HOSPITAL
                    ? 'border-rose-500 bg-rose-50/60 shadow-2xs font-bold'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <Building2 className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-900">Hospital</div>
                <div className="text-[10px] text-slate-500">Medical facility</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={role === ROLES.HOSPITAL ? 'Hospital / Facility Name' : 'Full Name'}
              placeholder={role === ROLES.HOSPITAL ? 'e.g. City Care Medical Center' : 'e.g. Anand Kumar'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@domain.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 98452 11234"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
                helperText="Shielded until consent"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Metropolitan Region"
                options={CITIES}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
              />
            </div>

            {/* Privacy Checkbox */}
            <div className="space-y-1">
              <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 mt-0.5"
                />
                <span>
                  I agree that contact information will be protected and only disclosed upon voluntary consent during active blood coordination.
                </span>
              </label>
              {errors.consent && <p className="text-xs text-rose-600 font-medium">{errors.consent}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full text-sm font-bold shadow-md"
              loading={loading}
              icon={ArrowRight}
            >
              Complete Registration
            </Button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-rose-600 hover:underline">
              Sign In
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
