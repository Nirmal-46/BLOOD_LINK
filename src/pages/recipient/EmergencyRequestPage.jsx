import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBloodData } from '../../context/BloodDataContext';
import { 
  Flame, 
  Building2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { BloodGroupBadge } from '../../components/common/BloodGroupBadge';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { BLOOD_GROUPS, CITIES } from '../../utils/constants';

export function EmergencyRequestPage() {
  const { currentUser } = useAuth();
  const { addBloodRequest } = useBloodData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bloodGroup: 'O-', // Default to universal for emergency!
    units: 2,
    hospitalName: 'Apollo Speciality Hospitals - Emergency Trauma ICU',
    city: CITIES[0],
    purpose: 'Acute hemorrhage / Emergency resuscitation trauma surgery',
    requiredHours: 'Immediate (< 2 Hours)'
  });

  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastComplete, setBroadcastComplete] = useState(false);
  const [createdId, setCreatedId] = useState('');

  const handleBroadcast = (e) => {
    e.preventDefault();
    setBroadcasting(true);

    setTimeout(() => {
      const newReq = addBloodRequest({
        bloodGroup: formData.bloodGroup,
        units: Number(formData.units),
        urgency: 'Emergency',
        hospitalName: formData.hospitalName,
        city: formData.city,
        requiredDate: new Date().toISOString().split('T')[0],
        purpose: formData.purpose,
        notes: `EMERGENCY DISPATCH: Needed ${formData.requiredHours}. Priority triage enabled.`
      });

      setCreatedId(newReq.id);
      setBroadcasting(false);
      setBroadcastComplete(true);
    }, 800);
  };

  if (broadcastComplete) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in zoom-in-95">
        <div className="bg-gradient-to-br from-slate-900 to-rose-950 text-white rounded-3xl p-8 sm:p-10 border border-rose-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-rose-600/30 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto shadow-inner">
            <Flame className="w-8 h-8 text-rose-500 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-rose-400">
              Live Priority Broadcast Active
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Emergency Request Dispatched
            </h2>
            <div className="inline-block px-3 py-1 rounded-xl bg-slate-800 font-mono text-sm font-bold text-rose-300 border border-slate-700">
              ID: {createdId}
            </div>
          </div>

          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Push alerts and <strong>Email Notifications</strong> have been automatically dispatched to all compatible donors for <strong>{formData.hospitalName}</strong> in <strong>{formData.city.split(',')[0]}</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target Blood:</span>
              <BloodGroupBadge group={formData.bloodGroup} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Required Units:</span>
              <span className="font-bold text-white">{formData.units} Units</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Hospital:</span>
              <span className="font-bold text-white">{formData.hospitalName}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-700">
              <span className="text-slate-400">Notification Channel:</span>
              <span className="font-semibold text-emerald-400">✓ Browser Push + 📧 Email Alerts Dispatched</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="secondary"
              size="lg"
              className="w-full font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600"
              onClick={() => navigate('/notifications')}
            >
              📧 View Dispatched Email
            </Button>
            <Button
              variant="emergency"
              size="lg"
              className="w-full font-bold shadow-lg"
              onClick={() => navigate(`/recipient/match?requestId=${createdId}`)}
            >
              Monitor Live Donor Matches →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: 'Emergency Broadcast' }]} />

      {/* Emergency Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0">
            <Flame className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider mb-1">
              <Radio className="w-3 h-3 animate-ping" />
              <span>Critical Emergency Fast-Track</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Instant Blood Broadcast
            </h1>
          </div>
        </div>

        <div className="text-right text-xs text-rose-100 hidden sm:block">
          <div>Automated Proximity Alert</div>
          <div className="font-bold text-white">&lt; 2 Minute Triage Target</div>
        </div>
      </div>

      {/* Emergency Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-rose-200 shadow-xl">
        <form onSubmit={handleBroadcast} className="space-y-6">
          
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Select Critical Blood Group Needed <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    formData.bloodGroup === bg
                      ? 'bg-red-600 text-white border-red-600 shadow-md scale-105 ring-2 ring-red-200'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
            {formData.bloodGroup === 'O-' && (
              <p className="text-[11px] text-rose-700 font-semibold bg-rose-50 p-2 rounded-lg">
                💡 O- Negative is the universal red cell donor group and is compatible with any emergency recipient.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Emergency Units Required"
              type="number"
              min={1}
              max={10}
              value={formData.units}
              onChange={(e) => setFormData({ ...formData, units: e.target.value })}
              required
            />

            <Select
              label="Metropolitan Region"
              options={CITIES}
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>

          <div>
            <Input
              label="Hospital Emergency Room / Trauma Center"
              placeholder="e.g. KMCH Hospital & Research Center"
              icon={Building2}
              value={formData.hospitalName}
              onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
              required
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-slate-500 font-semibold self-center mr-1">Quick Select:</span>
              {[
                'KMCH Hospital & Research Center',
                'PSG Institute of Medical Sciences',
                'Coimbatore Medical College Hospital (CMCH)',
                'Ganga Hospital Trauma Care'
              ].map((hosp) => (
                <button
                  key={hosp}
                  type="button"
                  onClick={() => setFormData({ ...formData, hospitalName: hosp })}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition cursor-pointer ${
                    formData.hospitalName === hosp
                      ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {hosp.split(' ')[0]} {hosp.includes('KMCH') ? '(KMCH)' : ''}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Critical Nature / Surgical Reason"
            placeholder="e.g. Acute trauma accident resuscitation"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            required
          />

          {/* Smart Pickup Point Promo for Long Distance Emergencies */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-rose-950 border border-rose-800/80 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-white font-bold">Far-away Regional Donor?</strong>
                <span className="text-slate-300 text-[11px]">Activate Smart Emergency Pickup Point to meet at an authorized midpoint blood bank.</span>
              </div>
            </div>
            <Link
              to="/smart-pickup"
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-white text-xs whitespace-nowrap self-start sm:self-auto transition shadow-sm"
            >
              Open Pickup Hub →
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Emergency Broadcast Policy:</strong> Use this fast-track channel only for acute, life-critical requirements. All available matching donors within the regional boundary will be flagged with high priority.
            </div>
          </div>

          <Button
            type="submit"
            variant="emergency"
            size="lg"
            className="w-full font-extrabold shadow-xl text-base py-3.5"
            loading={broadcasting}
            icon={Flame}
          >
            Launch Emergency Priority Broadcast
          </Button>
        </form>
      </div>
    </div>
  );
}
