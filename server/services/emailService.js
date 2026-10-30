import { transporter, OFFICIAL_SENDER, EMAIL_USER } from '../config/mailer.js';

// In-memory diagnostic logs for Admin inspection
const emailLogs = [
  {
    id: 'LOG-INIT-1',
    requestId: 'REQ-8021',
    recipient: 'karthik.donor@example.com',
    type: 'EMERGENCY_ALERT',
    subject: '🚨 BloodLink Emergency Blood Request (O+ Required at KMCH)',
    status: 'ACCEPTED',
    messageId: '<init-demo-msg-001@mail.gmail.com>',
    smtpResponse: '250 2.0.0 OK (Simulated initial state)',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];

// Deduplication Cache to prevent duplicate emails (Key: requestId:type:recipient, Value: timestamp)
const deduplicationCache = new Map();
const DEDUPLICATION_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes cooldown

/**
 * Check and record deduplication key
 */
function isDuplicateRequest(key) {
  const lastSent = deduplicationCache.get(key);
  if (lastSent && Date.now() - lastSent < DEDUPLICATION_COOLDOWN_MS) {
    return true;
  }
  deduplicationCache.set(key, Date.now());
  return false;
}

/**
 * Base Email Wrapper Template with BloodLink Branding
 */
function generateBaseEmailHTML({ title, badge, badgeColor = '#e11d48', contentHtml, ctaText, ctaUrl, privacyNote }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);">
          
          <!-- Header Branding -->
          <tr>
            <td style="background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); padding: 28px 24px; text-align: center;">
              <table align="center" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <div style="width: 36px; height: 36px; background-color: #ffffff; border-radius: 10px; display: inline-block; text-align: center; line-height: 36px; font-size: 20px;">
                      🩸
                    </div>
                  </td>
                  <td style="vertical-align: middle; padding-left: 10px; text-align: left;">
                    <div style="color: #ffffff; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">BloodLink</div>
                    <div style="color: #ffe4e6; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Connect • Match • Save Lives</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notification Type Badge & Title -->
          <tr>
            <td style="padding: 24px 24px 8px 24px;">
              ${badge ? `
                <div style="display: inline-block; background-color: #fff1f2; color: ${badgeColor}; border: 1px solid #fecdd3; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
                  ${badge}
                </div>
              ` : ''}
              <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                ${title}
              </h1>
            </td>
          </tr>

          <!-- Dynamic Body Content -->
          <tr>
            <td style="padding: 8px 24px 24px 24px; font-size: 14px; color: #334155;">
              ${contentHtml}

              <!-- Call to Action Button -->
              ${ctaText && ctaUrl ? `
                <div style="text-align: center; margin: 28px 0 16px 0;">
                  <a href="${ctaUrl}" style="background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 800; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.35);">
                    ${ctaText}
                  </a>
                </div>
              ` : ''}

              <!-- Privacy Guarantee Box -->
              <div style="background-color: #f1f5f9; border-radius: 10px; padding: 12px 16px; margin-top: 24px; font-size: 11px; color: #64748b; border-left: 3px solid #6366f1;">
                <strong>🔒 Zero-Leakage Privacy Protection:</strong> ${privacyNote || 'Personal mobile numbers and home addresses are never exposed. Coordination is gated through mutual two-party consent.'}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; color: #94a3b8; padding: 20px 24px; text-align: center; font-size: 11px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 6px 0; font-weight: 600; color: #cbd5e1;">BloodLink Emergency Blood Matching & Logistics Network</p>
              <p style="margin: 0; color: #64748b;">Official Automated Dispatch from <span style="color: #cbd5e1; font-family: monospace;">${EMAIL_USER}</span></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Core Mail Sender with Delivery Diagnostics & Status Logging
 */
async function sendMailWithDiagnostics({ to, subject, html, text, type, requestId = 'GENERAL' }) {
  const logId = `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  
  // Resolve Target Recipient (Test Mode Routing if enabled)
  const isTestMode = process.env.EMAIL_TEST_MODE === 'true';
  const effectiveRecipient = isTestMode && process.env.EMAIL_TEST_RECIPIENT
    ? process.env.EMAIL_TEST_RECIPIENT
    : to;

  // Deduplication Check
  const dedupKey = `${requestId}:${type}:${effectiveRecipient}`;
  if (isDuplicateRequest(dedupKey)) {
    console.log(`ℹ️ [BloodLink Mailer] Skipping duplicate notification for ${dedupKey}`);
    return {
      success: true,
      status: 'ACCEPTED_CACHED',
      message: 'Notification already dispatched recently (duplicate suppressed).',
      logId
    };
  }

  const logRecord = {
    id: logId,
    requestId,
    recipient: effectiveRecipient,
    originalRecipient: to,
    type,
    subject,
    status: 'SENDING',
    timestamp: new Date().toISOString()
  };

  try {
    const mailOptions = {
      from: OFFICIAL_SENDER,
      to: effectiveRecipient,
      subject,
      text: text || subject,
      html
    };

    console.log(`📤 [BloodLink Mailer] Dispatching ${type} to: ${effectiveRecipient} (From: ${OFFICIAL_SENDER})...`);
    const info = await transporter.sendMail(mailOptions);

    // Diagnostics capture
    console.log(`✅ [BloodLink Mailer] SMTP Accepted:`);
    console.log(`   • Message ID: ${info.messageId}`);
    console.log(`   • Accepted Recipients:`, info.accepted);
    console.log(`   • Rejected Recipients:`, info.rejected);
    console.log(`   • SMTP Server Response: ${info.response}`);

    logRecord.status = 'ACCEPTED';
    logRecord.messageId = info.messageId;
    logRecord.smtpResponse = info.response;
    logRecord.accepted = info.accepted;
    logRecord.rejected = info.rejected;

    emailLogs.unshift(logRecord);

    return {
      success: true,
      status: 'ACCEPTED',
      message: 'Email accepted by Gmail SMTP server for delivery.',
      messageId: info.messageId,
      recipient: effectiveRecipient,
      logId
    };
  } catch (error) {
    console.error(`❌ [BloodLink Mailer] Failed to dispatch ${type} to ${effectiveRecipient}:`, error.message);
    
    logRecord.status = 'FAILED';
    logRecord.error = error.message;
    emailLogs.unshift(logRecord);

    return {
      success: false,
      status: 'FAILED',
      error: error.message,
      recipient: effectiveRecipient,
      requiresAppPassword: error.message.includes('535') || error.message.includes('BadCredentials'),
      help: 'Google requires a 16-character App Password. Generate one at: https://myaccount.google.com/apppasswords',
      logId
    };
  }
}

/**
 * 1. Blood Match Notification Email
 */
export async function sendBloodMatchEmail({ to, recipientName = 'Donor', bloodGroup, units = 1, hospitalName, city, urgency = 'Urgent', requestId }) {
  const title = `Compatible Blood Request Match (${bloodGroup})`;
  const subject = `🩸 BloodLink – Compatible Blood Request Alert (${bloodGroup} at ${hospitalName || 'Hospital'})`;
  
  const contentHtml = `
    <p>Hello <strong>${recipientName}</strong>,</p>
    <p>A verified blood requirement matching your registered blood group (<strong>${bloodGroup}</strong>) has been published in your region.</p>
    
    <table width="100%" cellpadding="6" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; margin: 16px 0;">
      <tr>
        <td style="color: #64748b; font-weight: 600;">Hospital / Facility:</td>
        <td style="color: #0f172a; font-weight: 800; text-align: right;">${hospitalName || 'Regional Hospital'}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Location:</td>
        <td style="color: #0f172a; text-align: right;">${city || 'Tamil Nadu'}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Blood Group:</td>
        <td style="color: #e11d48; font-weight: 800; text-align: right;">${bloodGroup}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Units Required:</td>
        <td style="color: #0f172a; font-weight: 700; text-align: right;">${units} Unit(s)</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Priority Level:</td>
        <td style="color: #dc2626; font-weight: 800; text-align: right;">${urgency}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Reference ID:</td>
        <td style="color: #475569; font-family: monospace; text-align: right;">${requestId}</td>
      </tr>
    </table>
    <p>Your timely response can save a patient's life. Please review the requirement on your donor dashboard.</p>
  `;

  const html = generateBaseEmailHTML({
    title,
    badge: 'Compatible Donor Match',
    badgeColor: '#e11d48',
    contentHtml,
    ctaText: 'View Request & Respond →',
    ctaUrl: `http://localhost:5173/donor/requests`
  });

  return sendMailWithDiagnostics({
    to,
    subject,
    html,
    text: `BloodLink Match Alert: ${bloodGroup} blood required at ${hospitalName}, ${city}. Reference ID: ${requestId}. Respond at http://localhost:5173/donor/requests`,
    type: 'BLOOD_MATCH',
    requestId
  });
}

/**
 * 2. Emergency Broadcast Email
 */
export async function sendEmergencyAlertEmail({ to, recipientName = 'Valued Donor', bloodGroup, units = 2, hospitalName, city, urgency = 'Emergency', requestId, purpose, notes }) {
  const title = `🚨 CRITICAL EMERGENCY: ${bloodGroup} Needed Immediately`;
  const subject = `🚨 BloodLink Emergency Blood Request: ${bloodGroup} needed at ${hospitalName}`;

  const contentHtml = `
    <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
      <strong style="color: #be123c; font-size: 14px; display: block; margin-bottom: 4px;">⚠️ Immediate Action Required</strong>
      <span style="color: #9f1239; font-size: 13px;">A high-priority emergency blood requirement has been verified at <strong>${hospitalName}</strong>.</span>
    </div>

    <p>Dear <strong>${recipientName}</strong>,</p>
    <p>Emergency medical triage has dispatched this high-priority alert for <strong>${bloodGroup}</strong> blood units to available regional donors.</p>

    <table width="100%" cellpadding="6" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; margin: 16px 0;">
      <tr>
        <td style="color: #64748b; font-weight: 600;">Emergency Trauma Hospital:</td>
        <td style="color: #0f172a; font-weight: 800; text-align: right;">${hospitalName}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Region:</td>
        <td style="color: #0f172a; text-align: right;">${city}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Blood Group:</td>
        <td style="color: #e11d48; font-weight: 900; font-size: 15px; text-align: right;">${bloodGroup}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Units Required:</td>
        <td style="color: #0f172a; font-weight: 800; text-align: right;">${units} Unit(s)</td>
      </tr>
      ${purpose ? `
      <tr>
        <td style="color: #64748b; font-weight: 600;">Clinical Purpose:</td>
        <td style="color: #0f172a; text-align: right;">${purpose}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="color: #64748b; font-weight: 600;">Request Reference:</td>
        <td style="color: #475569; font-family: monospace; text-align: right;">${requestId}</td>
      </tr>
    </table>
  `;

  const html = generateBaseEmailHTML({
    title,
    badge: 'Critical Emergency Triage',
    badgeColor: '#dc2626',
    contentHtml,
    ctaText: '🚨 Respond to Emergency Request →',
    ctaUrl: `http://localhost:5173/donor/requests`
  });

  return sendMailWithDiagnostics({
    to,
    subject,
    html,
    text: `EMERGENCY ALERT: ${bloodGroup} blood needed immediately at ${hospitalName}, ${city}. Reference ID: ${requestId}. Respond at http://localhost:5173/donor/requests`,
    type: 'EMERGENCY_ALERT',
    requestId
  });
}

/**
 * 3. Smart Pickup Assignment Notification Email
 */
export async function sendPickupAssignmentEmail({ to, recipientName = 'Coordinator', pickupPoint, donorTravel, recipientTravel, requestId, bloodGroup, units }) {
  const title = `Smart Pickup Point Assigned: ${pickupPoint?.name || 'Handover Point'}`;
  const subject = `📍 BloodLink – Smart Emergency Pickup Point Assigned (Ref: ${requestId})`;

  const contentHtml = `
    <p>Hello <strong>${recipientName}</strong>,</p>
    <p>Because the donor and hospital are separated by a long highway corridor, our <strong>Smart Emergency Pickup Engine</strong> has calculated an optimal 24/7 cold-chain meeting location to reduce transit time.</p>

    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin: 16px 0;">
      <strong style="color: #166534; font-size: 14px; display: block; margin-bottom: 2px;">📍 Agreed Handover Landmark:</strong>
      <span style="color: #15803d; font-size: 13px; font-weight: 700;">${pickupPoint?.name || 'Central Hospital Blood Bank'}</span>
      <div style="color: #166534; font-size: 12px; margin-top: 4px;">${pickupPoint?.address || 'Midpoint Transit Corridor'}</div>
    </div>

    <table width="100%" cellpadding="6" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; margin: 16px 0;">
      <tr>
        <td style="color: #64748b; font-weight: 600;">Donor Travel Time:</td>
        <td style="color: #e11d48; font-weight: 800; text-align: right;">~${donorTravel || '55 min'}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Recipient Ambulance Travel:</td>
        <td style="color: #2563eb; font-weight: 800; text-align: right;">~${recipientTravel || '55 min'}</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Blood Group & Units:</td>
        <td style="color: #0f172a; font-weight: 700; text-align: right;">${units || 2} Units (${bloodGroup || 'O+'})</td>
      </tr>
      <tr>
        <td style="color: #64748b; font-weight: 600;">Cold-Chain Verification:</td>
        <td style="color: #16a34a; font-weight: 700; text-align: right;">✓ 24/7 Certified Facility</td>
      </tr>
    </table>
  `;

  const html = generateBaseEmailHTML({
    title,
    badge: 'Smart Logistics Intercept',
    badgeColor: '#f59e0b',
    contentHtml,
    ctaText: 'Open Live Radar Map & Timeline →',
    ctaUrl: `http://localhost:5173/smart-pickup`
  });

  return sendMailWithDiagnostics({
    to,
    subject,
    html,
    text: `Smart Pickup Assigned: ${pickupPoint?.name}. Donor travel: ${donorTravel}. Recipient travel: ${recipientTravel}. Ref: ${requestId}. Details at http://localhost:5173/smart-pickup`,
    type: 'PICKUP_ASSIGNMENT',
    requestId
  });
}

/**
 * 4. Status Update Notification Email (Connected with 9-stage State Machine)
 */
export async function sendStatusUpdateEmail({ to, recipientName = 'Coordinator', stageName, stageIndex, requestId, hospitalName }) {
  const title = `Update on Request ${requestId}: ${stageName}`;
  const subject = `BloodLink Update – ${stageName} (Ref: ${requestId})`;

  const contentHtml = `
    <p>Hello <strong>${recipientName}</strong>,</p>
    <p>There is a live status progression on blood request <strong>${requestId}</strong>.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin: 16px 0;">
      <span style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 700; display: block;">Current Lifecycle State:</span>
      <strong style="color: #e11d48; font-size: 16px; display: block; margin-top: 2px;">Stage ${stageIndex + 1}: ${stageName}</strong>
    </div>

    <p style="font-size: 13px; color: #475569;">You can monitor the live handover timeline and coordination steps anytime on your BloodLink dashboard.</p>
  `;

  const html = generateBaseEmailHTML({
    title,
    badge: 'Coordination Stage Update',
    badgeColor: '#6366f1',
    contentHtml,
    ctaText: 'Track Live Progress →',
    ctaUrl: `http://localhost:5173/smart-pickup`
  });

  return sendMailWithDiagnostics({
    to,
    subject,
    html,
    text: `BloodLink Update: Request ${requestId} is now in stage "${stageName}". Track live at http://localhost:5173/smart-pickup`,
    type: 'STATUS_UPDATE',
    requestId
  });
}

/**
 * 5. General Blood Request Creation Notification Email
 */
export async function sendBloodRequestEmail(data) {
  return sendBloodMatchEmail(data);
}

/**
 * 6. Admin / Diagnostic Test Email
 */
export async function sendTestEmail({ to, testMessage = 'This is a test notification from the official BloodLink automated dispatcher.' }) {
  const title = 'BloodLink Official Email Dispatcher Test';
  const subject = 'BloodLink Test Email – System Diagnostic';

  const contentHtml = `
    <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
      <strong style="color: #065f46; font-size: 14px; display: block; margin-bottom: 2px;">✅ SMTP Dispatcher Operational</strong>
      <span style="color: #047857; font-size: 12px;">This message was generated and delivered through <strong>${EMAIL_USER}</strong>.</span>
    </div>

    <p>Hello,</p>
    <p>${testMessage}</p>
    <p style="font-size: 12px; color: #64748b;">Timestamp: <strong>${new Date().toLocaleString()}</strong></p>
  `;

  const html = generateBaseEmailHTML({
    title,
    badge: 'Diagnostic Verification',
    badgeColor: '#10b981',
    contentHtml,
    ctaText: 'Open BloodLink Portal →',
    ctaUrl: `http://localhost:5173/notifications`
  });

  return sendMailWithDiagnostics({
    to,
    subject,
    html,
    text: `BloodLink Test Email: ${testMessage} Sent from ${EMAIL_USER}`,
    type: 'TEST_EMAIL',
    requestId: 'TEST-SYS'
  });
}

/**
 * Retrieve Diagnostic Logs
 */
export function getEmailLogs() {
  return emailLogs;
}

/**
 * Clear Diagnostic Logs
 */
export function clearEmailLogs() {
  emailLogs.length = 0;
  return true;
}
