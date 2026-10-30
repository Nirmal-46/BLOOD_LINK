import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Search, 
  PlusCircle, 
  HeartHandshake, 
  History, 
  ShieldCheck, 
  User, 
  Bell, 
  Flame, 
  Users, 
  BarChart3, 
  LogOut,
  Sparkles,
  Heart
} from 'lucide-react';
import { BloodGroupBadge } from '../common/BloodGroupBadge';

export function Sidebar({ mobile = false, onClose }) {
  const { currentUser, logout, isDonor, isRecipient, isHospital, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (mobile && onClose) onClose();
  };

  const getNavLinks = () => {
    if (isDonor) {
      return [
        { name: 'Donor Dashboard', path: '/donor/dashboard', icon: LayoutDashboard },
        { name: 'Find Blood Needs', path: '/donor/requests', icon: Search },
        { name: 'Donation History', path: '/donor/history', icon: History },
        { name: 'Notifications', path: '/notifications', icon: Bell },
        { name: 'Profile & Privacy', path: '/profile', icon: User }
      ];
    }
    if (isRecipient || isHospital) {
      return [
        { name: 'Dashboard Overview', path: '/recipient/dashboard', icon: LayoutDashboard },
        { name: 'Request Blood', path: '/recipient/request', icon: PlusCircle },
        { name: 'Emergency Broadcast', path: '/recipient/emergency', icon: Flame, badge: 'Fast' },
        { name: 'Find Donors & Matching', path: '/recipient/match', icon: Users },
        { name: 'Notifications', path: '/notifications', icon: Bell },
        { name: 'Profile & Privacy', path: '/profile', icon: User }
      ];
    }
    if (isAdmin) {
      return [
        { name: 'Admin Operations', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'All Blood Requests', path: '/admin/requests', icon: Search },
        { name: 'Verified Donors', path: '/admin/users', icon: Users },
        { name: 'System Logs & Privacy', path: '/admin/reports', icon: BarChart3 },
        { name: 'Platform Settings', path: '/profile', icon: User }
      ];
    }
    return [];
  };

  const links = getNavLinks();

  return (
    <aside className="w-64 flex flex-col h-full bg-white border-r border-slate-200/80">
      
      {/* Brand & User Card */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Heart className="w-4.5 h-4.5 fill-white" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 tracking-tight text-sm">
              Blood<span className="text-rose-600">Connect</span>
            </div>
            <div className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              {currentUser?.role} portal
            </div>
          </div>
        </div>

        {/* User Mini Profile */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-slate-800 truncate">{currentUser?.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{currentUser?.city?.split(',')[0]}</div>
            </div>
          </div>
          {currentUser?.bloodGroup && (
            <BloodGroupBadge group={currentUser.bloodGroup} size="sm" />
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-rose-50 text-rose-600 shadow-2xs border border-rose-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.name}</span>
              </div>
              {link.badge && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-rose-100 text-rose-700">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Privacy Shield Pill */}
      <div className="p-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm text-xs">
          <div className="flex items-center gap-1.5 font-bold text-rose-300 mb-1">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Privacy Guard Active</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            Phone & address shielded until voluntary consent.
          </p>
        </div>
      </div>

      {/* Footer Sign out */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={() => {
            if (mobile && onClose) onClose();
            logout();
            navigate('/');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
