import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBloodData } from '../../context/BloodDataContext';
import { Sparkles, User, Heart, Building2, Shield, RotateCcw, ChevronUp, ChevronDown, Check } from 'lucide-react';

export function DemoSwitcher() {
  const { currentUser, switchDemoRole, isAuthenticated } = useAuth();
  const { resetToDemoData } = useBloodData();
  const [isOpen, setIsOpen] = useState(false);

  const demoProfiles = [
    {
      id: 'user-donor-1',
      role: 'donor',
      name: 'Karthik (O+ Donor)',
      desc: 'Available regular donor in Coimbatore',
      icon: Heart,
      color: 'text-rose-600 bg-rose-50'
    },
    {
      id: 'user-donor-2',
      role: 'donor',
      name: 'Ananya (O- Universal)',
      desc: 'Universal donor with 7 donations',
      icon: Heart,
      color: 'text-red-600 bg-red-50'
    },
    {
      id: 'user-recipient-1',
      role: 'recipient',
      name: 'Siddharth (Recipient)',
      desc: 'Family member coordinating blood need',
      icon: User,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 'user-hospital-1',
      role: 'hospital',
      name: 'GK City Hospital (Org)',
      desc: 'Verified Hospital Trauma Unit',
      icon: Building2,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      id: 'user-admin-1',
      role: 'admin',
      name: 'Admin Moderator',
      desc: 'Platform moderation & metrics oversight',
      icon: Shield,
      color: 'text-slate-800 bg-slate-100'
    }
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="mb-2 w-96 max-w-[92vw] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3.5 backdrop-blur-lg animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>Hackathon Demo Role Switcher</span>
            </div>
            <button
              onClick={resetToDemoData}
              title="Reset state to initial sample data"
              className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-lg transition"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo
            </button>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {demoProfiles.map((profile) => {
              const Icon = profile.icon;
              const isSelected = currentUser?.id === profile.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => {
                    switchDemoRole(profile.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition border cursor-pointer ${
                    isSelected
                      ? 'border-rose-300 bg-rose-50/60 font-semibold text-slate-900 shadow-2xs'
                      : 'border-transparent hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg ${profile.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-slate-900 leading-tight">{profile.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{profile.desc}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-rose-600 flex-shrink-0 ml-2" />}
                </button>
              );
            })}

            <button
              onClick={() => {
                switchDemoRole(null);
                setIsOpen(false);
              }}
              className="w-full text-center py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              Log out (Test Public Visitor View)
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-white hover:bg-slate-900 shadow-xl border border-slate-700/60 text-xs font-semibold backdrop-blur-md transition-all hover:scale-102 active:scale-98 cursor-pointer"
        aria-label="Toggle Demo Role Switcher"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-300 font-normal">Active Role:</span>
        <span className="text-rose-400 font-bold capitalize">
          {isAuthenticated ? `${currentUser.role} (${currentUser.name.split(' ')[0]})` : 'Visitor (Logged Out)'}
        </span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
      </button>
    </div>
  );
}
