import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { INITIAL_USERS } from '../data/initialMockData';
import { ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    // Default to Donor 1 for immediate interactivity if not previously logged in
    const saved = storage.get('bloodconnect_user', null);
    return saved || INITIAL_USERS[0];
  });

  const [users, setUsers] = useState(() => {
    return storage.get('bloodconnect_users_list', INITIAL_USERS);
  });

  useEffect(() => {
    storage.set('bloodconnect_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    storage.set('bloodconnect_users_list', users);
  }, [users]);

  const login = (email, password, role) => {
    // Demo login matching email or fallback
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    }
    // If user enters any new credentials for demo
    const fallbackUser = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role: role || ROLES.DONOR,
      bloodGroup: 'O+',
      city: 'Coimbatore, Tamil Nadu',
      availability: true,
      lastDonationDate: '2026-05-01',
      screening: {
        noRecentTattoo: true,
        noMajorSurgery: true,
        notFeelingSick: true,
        weightAbove50kg: true
      },
      privacySettings: {
        sharePhoneOnlyAfterConsent: true,
        hideFromPublicSearch: false,
        allowEmergencyBroadcasts: true
      },
      preferredContactMethod: 'in_app',
      consent: true,
      createdAt: new Date().toISOString()
    };
    setUsers((prev) => [...prev, fallbackUser]);
    setCurrentUser(fallbackUser);
    return { success: true, user: fallbackUser };
  };

  const register = (userData) => {
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString()
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  const logout = () => {
    setCurrentUser(null);
    storage.remove('bloodconnect_user');
  };

  const deleteAccount = () => {
    if (!currentUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== currentUser.id));
    setCurrentUser(null);
    storage.remove('bloodconnect_user');
  };

  const switchDemoRole = (roleOrUserId) => {
    if (!roleOrUserId) {
      logout();
      return;
    }
    // Match by ID first
    let user = users.find((u) => u.id === roleOrUserId);
    if (!user) {
      // Match by role
      user = users.find((u) => u.role === roleOrUserId);
    }
    if (user) {
      setCurrentUser(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        updateProfile,
        logout,
        deleteAccount,
        switchDemoRole,
        isAuthenticated: !!currentUser,
        isDonor: currentUser?.role === ROLES.DONOR,
        isRecipient: currentUser?.role === ROLES.RECIPIENT,
        isHospital: currentUser?.role === ROLES.HOSPITAL,
        isAdmin: currentUser?.role === ROLES.ADMIN
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
