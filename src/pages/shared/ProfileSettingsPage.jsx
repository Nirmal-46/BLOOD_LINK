import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Trash2, 
  Save, 
  MapPin, 
  Mail, 
  Phone, 
  Heart, 
  Bell,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { BloodGroupBadge } from '../../components/common/BloodGroupBadge';
import { PrivacySettingsCard } from '../../components/donor/PrivacySettingsCard';
import { BLOOD_GROUPS, CITIES, ROLES } from '../../utils/constants';

export function ProfileSettingsPage() {
  const { currentUser, updateProfile, logout, deleteAccount, isDonor } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || '');
  const [city, setCity] = useState(currentUser?.city || CITIES[0]);
  const [bloodGroup, setBloodGroup] = useState(currentUser?.bloodGroup || 'O+');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      updateProfile({
        name,
        city,
        bloodGroup,
        phone
      });
      setLoading(false);
      showToast('Profile details updated successfully.', 'success');
    }, 400);
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    showToast('Account and local data deleted.', 'info');
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: 'Profile & Privacy Preferences' }]} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Profile & Security Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, availability, and privacy shields.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl flex-shrink-0">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{currentUser?.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-700">
                {currentUser?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentUser?.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Metropolitan Region"
              options={CITIES}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />

            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              helperText="Shielded until voluntary consent"
              required
            />
          </div>

          {isDonor && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-700">Blood Group</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {BLOOD_GROUPS.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setBloodGroup(bg)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      bloodGroup === bg
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              icon={Save}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Privacy Card if Donor */}
      {isDonor && <PrivacySettingsCard />}

      {/* Danger Zone */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-xs space-y-4 bg-rose-50/20">
        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <span>Danger Zone: Account Sovereignty</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          You have full right to erasure under our privacy policy. Deleting your account will immediately remove all personal data and unlist your profile from all matching directories.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            icon={Trash2}
          >
            Permanently Delete Account
          </Button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account & Data"
        message="Are you sure you want to permanently delete your BloodConnect account? All your profile information and matching records will be erased."
        confirmText="Yes, Delete My Account"
      />
    </div>
  );
}
