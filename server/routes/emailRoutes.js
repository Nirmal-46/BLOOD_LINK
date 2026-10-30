import { Router } from 'express';
import { 
  sendBloodRequestEmail,
  sendBloodMatchEmail,
  sendEmergencyAlertEmail,
  sendPickupAssignmentEmail,
  sendStatusUpdateEmail,
  sendTestEmail,
  getEmailLogs,
  clearEmailLogs
} from '../services/emailService.js';
import { verifyTransporter, OFFICIAL_SENDER, EMAIL_USER } from '../config/mailer.js';

const router = Router();

/**
 * Universal JSON response helper that safely works in both Express and raw Node/Connect environments
 */
function sendResponse(res, statusCode, data) {
  if (res.status && typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }
  if (typeof res.json === 'function') {
    res.statusCode = statusCode;
    return res.json(data);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(data));
}

/**
 * Fallback body parser middleware for raw Connect/Vite requests
 */
router.use(async (req, res, next) => {
  if (req.body !== undefined) {
    return next();
  }
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'DELETE') {
    req.body = {};
    return next();
  }
  try {
    let rawBody = '';
    req.on('data', chunk => { rawBody += chunk; });
    req.on('end', () => {
      try {
        req.body = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        req.body = {};
      }
      next();
    });
  } catch {
    req.body = {};
    next();
  }
});

/**
 * Basic Email Validator Helper
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * 1. Health & SMTP Diagnostic Endpoint
 * GET /api/notifications/email/health
 */
router.get('/health', async (req, res) => {
  const result = await verifyTransporter();
  return sendResponse(res, 200, {
    ...result,
    officialSender: OFFICIAL_SENDER,
    timestamp: new Date().toISOString()
  });
});

/**
 * 2. Get Delivery Diagnostic Logs
 * GET /api/notifications/email/logs
 */
router.get('/logs', (req, res) => {
  return sendResponse(res, 200, {
    success: true,
    sender: EMAIL_USER,
    totalLogs: getEmailLogs().length,
    logs: getEmailLogs()
  });
});

/**
 * 3. Clear Logs
 * DELETE /api/notifications/email/logs
 */
router.delete('/logs', (req, res) => {
  clearEmailLogs();
  return sendResponse(res, 200, { success: true, message: 'Diagnostic logs cleared' });
});

/**
 * 4. Blood Request Email
 * POST /api/notifications/email/blood-request
 */
router.post('/blood-request', async (req, res) => {
  const { to, recipientName, bloodGroup, units, hospitalName, city, urgency, requestId, purpose, requiredDate, pickupPreference } = req.body || {};

  if (!isValidEmail(to)) {
    return sendResponse(res, 400, { success: false, status: 'REJECTED', error: 'Invalid or missing recipient email address' });
  }

  const result = await sendBloodRequestEmail({
    to: to.trim(),
    recipientName,
    bloodGroup,
    units,
    hospitalName,
    city,
    urgency,
    requestId,
    purpose,
    requiredDate,
    pickupPreference
  });

  return sendResponse(res, result.success ? 200 : 500, result);
});

/**
 * 5. Blood Match Email
 * POST /api/notifications/email/blood-match
 */
router.post('/blood-match', async (req, res) => {
  const { to, recipientName, bloodGroup, units, hospitalName, city, urgency, requestId } = req.body || {};

  if (!isValidEmail(to)) {
    return sendResponse(res, 400, { success: false, status: 'REJECTED', error: 'Invalid or missing recipient email address' });
  }

  const result = await sendBloodMatchEmail({
    to: to.trim(),
    recipientName,
    bloodGroup,
    units,
    hospitalName,
    city,
    urgency,
    requestId
  });

  return sendResponse(res, result.success ? 200 : 500, result);
});

/**
 * 6. Emergency Priority Broadcast Email
 * POST /api/notifications/email/emergency
 */
router.post('/emergency', async (req, res) => {
  const { to, recipientName, bloodGroup, units, hospitalName, city, urgency, requestId, purpose, notes } = req.body || {};

  if (!isValidEmail(to)) {
    return sendResponse(res, 400, { success: false, status: 'REJECTED', error: 'Invalid or missing recipient email address' });
  }

  const result = await sendEmergencyAlertEmail({
    to: to.trim(),
    recipientName,
    bloodGroup,
    units,
    hospitalName,
    city,
    urgency,
    requestId,
    purpose,
    notes
  });

  return sendResponse(res, result.success ? 200 : 500, result);
});

/**
 * 7. Smart Pickup Assignment Email
 * POST /api/notifications/email/pickup
 */
router.post('/pickup', async (req, res) => {
  const { to, recipientName, pickupPoint, donorTravel, recipientTravel, requestId, bloodGroup, units } = req.body || {};

  if (!isValidEmail(to)) {
    return sendResponse(res, 400, { success: false, status: 'REJECTED', error: 'Invalid or missing recipient email address' });
  }

  const result = await sendPickupAssignmentEmail({
    to: to.trim(),
    recipientName,
    pickupPoint,
    donorTravel,
    recipientTravel,
    requestId,
    bloodGroup,
    units
  });

  return sendResponse(res, result.success ? 200 : 500, result);
});

/**
 * 8. Status Update Email
 * POST /api/notifications/email/status
 */
router.post('/status', async (req, res) => {
  const { to, recipientName, stageName, stageIndex, requestId, hospitalName } = req.body || {};

  if (!isValidEmail(to)) {
    return sendResponse(res, 400, { success: false, status: 'REJECTED', error: 'Invalid or missing recipient email address' });
  }

  const result = await sendStatusUpdateEmail({
    to: to.trim(),
    recipientName,
    stageName,
    stageIndex,
    requestId,
    hospitalName
  });

  return sendResponse(res, result.success ? 200 : 500, result);
});

/**
 * 9. Admin / Diagnostic Test Email
 * POST /api/notifications/email/test
 */
router.post('/test', async (req, res) => {
  const { to, testMessage } = req.body || {};

  if (!isValidEmail(to)) {
    return sendResponse(res, 400, { success: false, status: 'REJECTED', error: 'Invalid recipient email address for test' });
  }

  const result = await sendTestEmail({
    to: to.trim(),
    testMessage
  });

  return sendResponse(res, result.success ? 200 : 500, result);
});

export default router;
