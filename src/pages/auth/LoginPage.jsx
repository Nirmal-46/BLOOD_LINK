import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Heart, Lock, Mail, ShieldCheck, ArrowRight, Sparkles, Shield } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ROLES } from '../../utils/constants';

export function LoginPage() {
  const { login, switchDemoRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('karthik.donor@example.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState(ROLES.DONOR);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Please enter a valid email';
    if (!password.trim()) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const res = login(email, password, role);
      setLoading(false);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        const from = location.state?.from?.pathname;
        if (from) {
          navigate(from, { replace: true });
        } else if (res.user.role === ROLES.DONOR) {
          navigate('/donor/dashboard');
        } else if (res.user.role === ROLES.RECIPIENT || res.user.role === ROLES.HOSPITAL) {
          navigate('/recipient/dashboard');
        } else if (res.user.role === ROLES.ADMIN) {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    }, 400);
  };

  const setSampleAccount = (sampleEmail, sampleRole) => {
    setEmail(sampleEmail);
    setRole(sampleRole);
    setPassword('demoPass123');
    setErrors({});
  };

  const directAdminLogin = () => {
    switchDemoRole('user-admin-1');
    showToast('Signed in as Admin Moderator with full system access.', 'success');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center text-white shadow-md">
              <Heart className="w-5 h-5 fill-white" />
            </div>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to BloodConnect
          </h2>
          <p className="text-xs text-slate-500">
            Secure, consent-driven access to donor, recipient & admin console
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-lg space-y-6">
          
          {/* Quick 1-Click Demo Accounts Selector */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>1-Click Hackathon Sample Credentials:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => setSampleAccount('karthik.donor@example.com', ROLES.DONOR)}
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-800 hover:border-rose-300 hover:text-rose-600 transition"
              >
                O+ Donor
              </button>
              <button
                type="button"
                onClick={() => setSampleAccount('ananya.o.neg@example.com', ROLES.DONOR)}
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-800 hover:border-rose-300 hover:text-rose-600 transition"
              >
                O- Universal
              </button>
              <button
                type="button"
                onClick={() => setSampleAccount('siddharth.recipient@example.com', ROLES.RECIPIENT)}
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-800 hover:border-rose-300 hover:text-rose-600 transition"
              >
                Recipient
              </button>
              <button
                type="button"
                onClick={() => setSampleAccount('emergency@gkmedical.org', ROLES.HOSPITAL)}
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-800 hover:border-rose-300 hover:text-rose-600 transition"
              >
                Hospital
              </button>
            </div>
          </div>

          {/* Quick Direct Admin Access Banner */}
          <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <div className="text-xs">
                <div className="font-bold text-white">Admin Master Access</div>
                <div className="text-[10px] text-slate-400">Moderation & logs</div>
              </div>
            </div>
            <button
              type="button"
              onClick={directAdminLogin}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Sign In as Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role Tab Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Account Role</label>
              <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 text-center">
                {[
                  { id: ROLES.DONOR, label: 'Donor' },
                  { id: ROLES.RECIPIENT, label: 'Recipient' },
                  { id: ROLES.HOSPITAL, label: 'Hospital' },
                  { id: ROLES.ADMIN, label: 'Admin' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      role === r.id
                        ? 'bg-white text-rose-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

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
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full text-sm font-bold shadow-md"
              loading={loading}
              icon={ArrowRight}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Privacy Note */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Encrypted Session</span>
            </span>
            <Link to="/register" className="font-semibold text-rose-600 hover:underline">
              Need an account?
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
