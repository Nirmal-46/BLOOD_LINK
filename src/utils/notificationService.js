import { storage } from './storage';

export const OFFICIAL_SENDER = 'bloodlink112@gmail.com';

/**
 * Web Audio Chime for Medical Alerts (synthesizes clean pleasant tone without audio files)
 */
export function playAlertChime(type = 'emergency') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type === 'emergency' ? 'sawtooth' : 'sine';
    
    if (type === 'emergency') {
      // Urgent double high chime
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.setValueAtTime(1174.66, now + 0.15); // D6
      osc.frequency.setValueAtTime(880, now + 0.3);
      osc.frequency.setValueAtTime(1174.66, now + 0.45);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.65);
    } else {
      // Gentle notification chime
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.12); // A5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch (err) {
    console.debug('Audio chime skipped:', err);
  }
}

/**
 * Request Browser Push Permission
 */
export async function requestPushPermission() {
  if (!('Notification' in window)) {
    return { supported: false, status: 'unsupported' };
  }
  try {
    const permission = await Notification.requestPermission();
    return { supported: true, status: permission };
  } catch (err) {
    return { supported: true, status: 'denied' };
  }
}

/**
 * Trigger Real Web Browser Push Notification
 */
export function sendBrowserPushNotification({ title, body, icon, tag = 'bloodlink-alert' }) {
  playAlertChime('emergency');

  // Broadcast window custom event for floating banner
  window.dispatchEvent(
    new CustomEvent('bloodlink:push-alert', {
      detail: { title, body, icon, tag, timestamp: new Date().toISOString() }
    })
  );

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      return new Notification(title, {
        body,
        icon: icon || '/vite.svg',
        tag,
        badge: '/vite.svg',
        requireInteraction: true
      });
    } catch (err) {
      console.debug('Browser native notification error:', err);
    }
  }
}

/**
 * Safe API client helper that verifies Content-Type and prevents JSON parse syntax errors
 */
async function safeApiFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return { ...data, httpStatus: res.status };
    }
    
    // Safely handle non-JSON / HTML responses (such as 404/500 proxy errors)
    const textResponse = await res.text();
    const isHtml = textResponse.trim().startsWith('<!') || textResponse.includes('<html');
    return {
      success: res.ok,
      status: res.ok ? 'ACCEPTED' : 'FAILED',
      error: isHtml ? `Server returned HTTP ${res.status}` : (textResponse || `HTTP ${res.status}`),
      httpStatus: res.status
    };
  } catch (err) {
    return {
      success: false,
      status: 'FAILED',
      error: err.message || 'Network communication failure'
    };
  }
}

/**
 * Backend API Client: Send Blood Match Notification Email
 */
export async function dispatchBloodMatchEmail(payload) {
  return safeApiFetch('/api/notifications/email/blood-match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

/**
 * Backend API Client: Send Emergency Priority Alert Email
 */
export async function dispatchEmergencyEmail(payload) {
  return safeApiFetch('/api/notifications/email/emergency', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

/**
 * Backend API Client: Send Smart Pickup Notification Email
 */
export async function dispatchPickupEmail(payload) {
  return safeApiFetch('/api/notifications/email/pickup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

/**
 * Backend API Client: Send Status Update Email
 */
export async function dispatchStatusUpdateEmail(payload) {
  return safeApiFetch('/api/notifications/email/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

/**
 * Backend API Client: Send Test Email
 */
export async function dispatchTestEmail(to, testMessage) {
  return safeApiFetch('/api/notifications/email/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, testMessage })
  });
}

/**
 * Backend API Client: Check SMTP Health & Connectivity
 */
export async function fetchSMTPHealth() {
  const result = await safeApiFetch('/api/notifications/email/health');
  if (result.status === 'FAILED' && !result.error) {
    return { success: false, status: 'UNREACHABLE', error: 'Could not connect to notification API' };
  }
  return result;
}

/**
 * Backend API Client: Fetch Email Delivery Diagnostic Logs
 */
export async function fetchEmailLogs() {
  const result = await safeApiFetch('/api/notifications/email/logs');
  return Array.isArray(result.logs) ? result.logs : [];
}

/**
 * Unified dispatch function called during request creation & emergency matches
 */
export function sendEmailNotification({
  to,
  recipientName = 'Valued Donor',
  bloodGroup,
  units = 1,
  hospitalName = 'KMCH Hospital & Research Center',
  city = 'Coimbatore, Tamil Nadu',
  urgency = 'Emergency',
  requestId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
  purpose = 'Emergency medical requirement',
  notes = ''
}) {
  const isEmergency = urgency === 'Emergency';
  const emailId = `EMAIL-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const subject = `🚨 URGENT BLOOD NEED: ${bloodGroup} needed at ${hospitalName}`;
  const timestamp = new Date().toISOString();

  const payload = {
    to: to || 'karthik.donor@example.com',
    recipientName,
    bloodGroup,
    units,
    hospitalName,
    city,
    urgency,
    requestId,
    purpose,
    notes
  };

  // 1. Dispatch through secure backend API
  if (isEmergency) {
    dispatchEmergencyEmail(payload).then((res) => {
      console.log('Backend Emergency Dispatch Result:', res);
    });
  } else {
    dispatchBloodMatchEmail(payload).then((res) => {
      console.log('Backend Match Dispatch Result:', res);
    });
  }

  // 2. Trigger browser push notification simultaneously
  sendBrowserPushNotification({
    title: `🚨 Blood Needed at ${hospitalName}!`,
    body: `${units} unit(s) of ${bloodGroup} blood is urgently required at ${hospitalName}, ${city}. Dispatched from ${OFFICIAL_SENDER}.`,
    tag: requestId
  });

  const emailRecord = {
    id: emailId,
    from: OFFICIAL_SENDER,
    to: payload.to,
    recipientName,
    subject,
    bloodGroup,
    units,
    hospitalName,
    city,
    urgency,
    requestId,
    purpose,
    notes,
    timestamp,
    status: `Accepted by SMTP (${OFFICIAL_SENDER})`,
    opened: false
  };

  const existingEmails = storage.get('bloodconnect_dispatched_emails', []);
  storage.set('bloodconnect_dispatched_emails', [emailRecord, ...existingEmails]);

  return emailRecord;
}

/**
 * Retrieve Stored Dispatched Emails
 */
export function getDispatchedEmails() {
  return storage.get('bloodconnect_dispatched_emails', [
    {
      id: 'EMAIL-INIT-1',
      from: OFFICIAL_SENDER,
      to: 'karthik.donor@example.com',
      recipientName: 'Karthik Subramanian',
      subject: '🚨 URGENT BLOOD NEED: O+ needed at KMCH Hospital & Research Center',
      bloodGroup: 'O+',
      units: 2,
      hospitalName: 'KMCH Hospital & Research Center',
      city: 'Coimbatore, Tamil Nadu',
      urgency: 'Emergency',
      requestId: 'REQ-8021',
      purpose: 'Acute trauma emergency care',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: `Accepted by SMTP (${OFFICIAL_SENDER})`,
      opened: true
    }
  ]);
}
