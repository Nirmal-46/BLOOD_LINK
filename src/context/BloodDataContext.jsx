import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { INITIAL_REQUESTS, INITIAL_NOTIFICATIONS, INITIAL_STATS } from '../data/initialMockData';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { calculateMatchScore } from '../utils/bloodCompatibility';

import { 
  sendEmailNotification, 
  sendBrowserPushNotification, 
  getDispatchedEmails,
  playAlertChime
} from '../utils/notificationService';

const BloodDataContext = createContext(null);

export function BloodDataProvider({ children }) {
  const { currentUser, users, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [requests, setRequests] = useState(() => {
    return storage.get('bloodconnect_requests', INITIAL_REQUESTS);
  });

  const [notifications, setNotifications] = useState(() => {
    return storage.get('bloodconnect_notifications', INITIAL_NOTIFICATIONS);
  });

  const [stats, setStats] = useState(() => {
    return storage.get('bloodconnect_stats', INITIAL_STATS);
  });

  const [dispatchedEmails, setDispatchedEmails] = useState(() => {
    return getDispatchedEmails();
  });

  // Keep localStorage updated
  useEffect(() => {
    storage.set('bloodconnect_requests', requests);
  }, [requests]);

  useEffect(() => {
    storage.set('bloodconnect_notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    storage.set('bloodconnect_stats', stats);
  }, [stats]);

  useEffect(() => {
    storage.set('bloodconnect_dispatched_emails', dispatchedEmails);
  }, [dispatchedEmails]);

  // Derived Donors list from users
  const donors = users.filter((u) => u.role === 'donor');

  /**
   * Create a new blood request & dispatch Push/Email alerts
   */
  const addBloodRequest = (requestData) => {
    const requestId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest = {
      id: requestId,
      requesterId: currentUser?.id || 'guest-requester',
      requesterName: currentUser?.name || requestData.requesterName || 'Hospital Patient Coordinator',
      status: 'Searching',
      contactConsentGranted: false,
      matchedDonorIds: [],
      contactRevealed: false,
      createdAt: new Date().toISOString(),
      ...requestData
    };

    // Auto-match compatible donors
    const matchedDonors = donors.filter((d) => {
      const match = calculateMatchScore(d, newRequest);
      return match.compatible && d.availability;
    });

    // Targeted donors or all regional donors if emergency
    const targetDonors = matchedDonors.length > 0 
      ? matchedDonors 
      : donors.slice(0, 3); // Fallback to nearby donors

    newRequest.matchedDonorIds = targetDonors.map((d) => d.id);
    newRequest.status = targetDonors.length > 0 ? 'Donor Found' : 'Searching';

    // 1. Dispatch In-App Notifications
    targetDonors.forEach((donor) => {
      const notif = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        userId: donor.id,
        title: `🚨 Blood Needed at ${newRequest.hospitalName} (${newRequest.bloodGroup})`,
        message: `${newRequest.hospitalName} has an urgent requirement for ${newRequest.units || 1} unit(s) of ${newRequest.bloodGroup} blood in ${newRequest.city}. Email notification pushed.`,
        type: 'request',
        requestId: newRequest.id,
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications((prev) => [notif, ...prev]);

      // 2. Dispatch Email Notification
      const email = sendEmailNotification({
        to: donor.email,
        recipientName: donor.name,
        bloodGroup: newRequest.bloodGroup,
        units: newRequest.units || 1,
        hospitalName: newRequest.hospitalName,
        city: newRequest.city,
        urgency: newRequest.urgency || 'Emergency',
        requestId: newRequest.id,
        purpose: newRequest.purpose || 'Hospital patient blood requirement',
        notes: newRequest.notes || ''
      });

      setDispatchedEmails((prev) => [email, ...prev]);
    });

    // 3. Trigger Browser Audio & Push Alert
    playAlertChime(newRequest.urgency === 'Emergency' ? 'emergency' : 'gentle');

    setRequests((prev) => [newRequest, ...prev]);
    showToast(`Blood Request ${requestId} published. Push & Email alerts sent to donors!`, 'success');
    return newRequest;
  };

  /**
   * One-click trigger for KMCH Emergency Blood Broadcast
   */
  const triggerKMCHEmergencyBroadcast = (bloodGroup = 'O+', units = 2) => {
    return addBloodRequest({
      bloodGroup,
      units,
      urgency: 'Emergency',
      hospitalName: 'KMCH Hospital & Research Center',
      city: 'Coimbatore, Tamil Nadu',
      requiredDate: new Date().toISOString().split('T')[0],
      purpose: 'Critical ICU blood requirement - trauma emergency',
      notes: 'Urgent whole blood required for emergency resuscitation at KMCH main trauma care.'
    });
  };

  /**
   * Update request status
   */
  const updateRequestStatus = (requestId, newStatus) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const updated = { ...req, status: newStatus };
          if (newStatus === 'Completed') {
            updated.completedAt = new Date().toISOString();
            setStats((s) => ({ ...s, totalDonationsCompleted: s.totalDonationsCompleted + 1 }));
          }
          return updated;
        }
        return req;
      })
    );
  };

  /**
   * Donor accepts or declines request
   */
  const respondToRequest = (requestId, donorId, action, consentShare = true) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    if (action === 'accept') {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId) {
            return {
              ...r,
              status: 'Confirmed',
              contactConsentGranted: consentShare,
              contactRevealed: consentShare,
              confirmedDonorId: donorId
            };
          }
          return r;
        })
      );

      // Notify recipient
      const notif = {
        id: `notif-${Date.now()}`,
        userId: req.requesterId,
        title: 'Donor Accepted Your Request!',
        message: `An eligible donor has accepted request ${req.id}. Mutual contact details are now unlocked for coordination.`,
        type: 'success',
        requestId: req.id,
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications((prev) => [notif, ...prev]);

      showToast('You accepted the blood request. Thank you for saving a life!', 'success');
    } else {
      showToast('Request declined.', 'info');
    }
  };

  /**
   * Request consent from donor
   */
  const requestConsentFromDonor = (requestId, donorId) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return { ...r, status: 'Contact Pending' };
        }
        return r;
      })
    );

    const notif = {
      id: `notif-${Date.now()}`,
      userId: donorId,
      title: 'Contact Consent Requested',
      message: `The requester for ${requestId} has requested your consent to coordinate the donation.`,
      type: 'consent',
      requestId: requestId,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast('Consent request sent to donor.', 'info');
  };

  /**
   * Toggle donor availability
   */
  const toggleDonorAvailability = (donorId) => {
    const donor = donors.find((d) => d.id === donorId);
    if (!donor) return;
    const newAvailability = !donor.availability;
    updateProfile({ availability: newAvailability });
    showToast(
      `Availability status set to: ${newAvailability ? 'Available for Donation' : 'Temporarily Unavailable'}`,
      'info'
    );
  };

  /**
   * Notifications handling
   */
  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = (userId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === userId ? { ...n, read: true } : n))
    );
    showToast('All notifications marked as read', 'info');
  };

  /**
   * Reset prototype to clean demo data
   */
  const resetToDemoData = () => {
    storage.clearAll();
    window.location.reload();
  };

  return (
    <BloodDataContext.Provider
      value={{
        requests,
        donors,
        notifications,
        dispatchedEmails,
        stats,
        addBloodRequest,
        triggerKMCHEmergencyBroadcast,
        updateRequestStatus,
        respondToRequest,
        requestConsentFromDonor,
        toggleDonorAvailability,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDemoData
      }}
    >
      {children}
    </BloodDataContext.Provider>
  );
}

export function useBloodData() {
  const context = useContext(BloodDataContext);
  if (!context) {
    throw new Error('useBloodData must be used within a BloodDataProvider');
  }
  return context;
}
