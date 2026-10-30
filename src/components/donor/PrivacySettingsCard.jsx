import React, { useState } from 'react';
import { ShieldCheck, Lock, EyeOff, Radio, BellRing, Save } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function PrivacySettingsCard() {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [settings, setSettings] = useState({
    sharePhoneOnlyAfterConsent: currentUser?.privacySettings?.sharePhoneOnlyAfterConsent ?? true,
    hideFromPublicSearch: currentUser?.privacySettings?.hideFromPublicSearch ?? false,
    allowEmergencyBroadcasts: currentUser?.privacySettings?.allowEmergencyBroadcasts ?? true,
    preferredContactMethod: currentUser?.preferredContactMethod || 'in_app'
  });

  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      updateProfile({
        privacySettings: {
          sharePhoneOnlyAfterConsent: settings.sharePhoneOnlyAfterConsent,
          hideFromPublicSearch: settings.hideFromPublicSearch,
          allowEmergencyBroadcasts: settings.allowEmergencyBroadcasts
        },
        preferredContactMethod: settings.preferredContactMethod
      });
      setSaving(false);
      showToast('Privacy preferences updated successfully.', 'success');
    }, 400);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-200/90 space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Privacy & Contact Preferences</h3>
          <p className="text-xs text-slate-500">Full sovereign control over your visibility and contact details</p>
        </div>
      </div>

      <div className="space-y-4">
        
        {/* Toggle 1 */}
        <label className="flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Consent-Gated Contact Sharing</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Keep phone number & direct email masked until you explicitly accept a blood request.
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.sharePhoneOnlyAfterConsent}
            onChange={(e) =>
              setSettings({ ...settings, sharePhoneOnlyAfterConsent: e.target.checked })
            }
            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 mt-1 cursor-pointer"
          />
        </label>

        {/* Toggle 2 */}
        <label className="flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-slate-600" />
              <span>Stealth Search Mode</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Only appear to verified hospitals and direct urgent system matches.
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.hideFromPublicSearch}
            onChange={(e) =>
              setSettings({ ...settings, hideFromPublicSearch: e.target.checked })
            }
            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 mt-1 cursor-pointer"
          />
        </label>

        {/* Toggle 3 */}
        <label className="flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-rose-600" />
              <span>Emergency Broadcast Alerts</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Allow trauma centers in your city to notify you for life-or-death emergencies.
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.allowEmergencyBroadcasts}
            onChange={(e) =>
              setSettings({ ...settings, allowEmergencyBroadcasts: e.target.checked })
            }
            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 mt-1 cursor-pointer"
          />
        </label>

        {/* Preferred Coordination Channel */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-700 block">
            Preferred Coordination Channel
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'in_app', label: 'In-App Secure Chat' },
              { id: 'sms', label: 'Masked SMS' },
              { id: 'call', label: 'Direct Phone' }
            ].map((method) => (
              <button
                type="button"
                key={method.id}
                onClick={() => setSettings({ ...settings, preferredContactMethod: method.id })}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                  settings.preferredContactMethod === method.id
                    ? 'border-rose-500 bg-rose-50/70 text-rose-700 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="pt-2 flex justify-end">
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          loading={saving}
          icon={Save}
        >
          Save Privacy Settings
        </Button>
      </div>
    </div>
  );
}
