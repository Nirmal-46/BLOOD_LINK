import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBloodData } from '../../context/BloodDataContext';
import { 
  Heart, 
  ShieldCheck, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Activity, 
  Flame, 
  ChevronDown,
  LayoutDashboard,
  Shield,
  Lock
} from 'lucide-react';
import { Button } from '../common/Button';
import { ROLES } from '../../utils/constants';

export function Navbar() {
  const { currentUser, isAuthenticated, logout, switchDemoRole } = useAuth();
  const { notifications } = useBloodData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userUnreadCount = notifications.filter(
    (n) => n.userId === currentUser?.id && !n.read
  ).length;

  const isActive = (path) => location.pathname === path;

  const getDashboardRoute = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'donor') return '/donor/dashboard';
    if (currentUser.role === 'recipient' || currentUser.role === 'hospital') {
      return '/recipient/dashboard';
    }
    if (currentUser.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Smart Pickup', path: '/smart-pickup', isNew: true },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Safety & Privacy', path: '/safety-privacy' },
    { name: 'About', path: '/about' }
  ];

  const handleAdminAccess = () => {
    switchDemoRole('user-admin-1');
    navigate('/admin/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Blood<span className="text-rose-600">Connect</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/60">
                  Privacy-First
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 tracking-tight hidden sm:block">
                Fast matching. Safer sharing.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
                  isActive(link.path)
                    ? 'text-rose-600 bg-rose-50/70 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{link.name}</span>
                {link.isNew && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white animate-pulse">
                    New
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-2.5">
            
            {/* Quick Admin Access Button */}
            <button
              onClick={handleAdminAccess}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              title="Switch to Admin Control Panel"
            >
              <Shield className="w-3.5 h-3.5 text-slate-900" />
              <span>Admin Access</span>
            </button>

            {/* Quick Emergency CTA */}
            <Link to="/recipient/emergency">
              <Button
                variant="emergency"
                size="sm"
                className="pulse-emergency font-bold text-xs"
                icon={Flame}
              >
                Emergency Need
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 relative">
                {/* Notifications Bell */}
                <Link
                  to="/notifications"
                  className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {userUnreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-ping" />
                  )}
                  {userUnreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-600 border-2 border-white rounded-full" />
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                      {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                    </div>
                    <div className="text-left hidden lg:block">
                      <div className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[110px]">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">
                        {currentUser.role}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {currentUser.role}
                        </span>
                      </div>

                      <Link
                        to={getDashboardRoute()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>

                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Control Panel
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition"
                      >
                        <User className="w-4 h-4" />
                        Profile & Privacy
                      </Link>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={handleAdminAccess}
              className="p-1.5 px-2.5 rounded-xl border border-slate-200 bg-slate-100 text-[11px] font-bold text-slate-800"
            >
              Admin
            </button>
            <Link to="/recipient/emergency">
              <Button variant="emergency" size="sm" className="text-xs px-2 py-1">
                Emergency
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-base font-medium ${
                  isActive(link.path)
                    ? 'text-rose-600 bg-rose-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleAdminAccess();
              }}
              className="block w-full text-center py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-sm"
            >
              🛡️ Open Admin Control Panel
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardRoute()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-sm shadow-sm"
                >
                  Go to {currentUser.role} Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm"
                >
                  Profile & Settings
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="block w-full text-center py-2 rounded-xl text-rose-600 font-medium text-sm hover:bg-rose-50"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-rose-600 text-white font-medium text-sm shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
