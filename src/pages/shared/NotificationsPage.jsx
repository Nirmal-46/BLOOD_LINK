import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBloodData } from '../../context/BloodDataContext';
import { 
  Bell, 
  CheckCheck, 
  Filter, 
  ShieldCheck, 
  Flame, 
  Heart, 
  Mail, 
  Send, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Volume2, 
  Sparkles,
  AlertCircle,
  ExternalLink,
  Key,
  Terminal,
  RefreshCw,
  Server
} from 'lucide-react';
import { NotificationItem } from '../../components/notifications/NotificationItem';
import { EmailInboxModal } from '../../components/notifications/EmailInboxModal';
import { EmptyState } from '../../components/common/EmptyState';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { BloodGroupBadge } from '../../components/common/BloodGroupBadge';
import { 
  requestPushPermission, 
  OFFICIAL_SENDER, 
  dispatchTestEmail,
  fetchSMTPHealth,
  fetchEmailLogs
} from '../../utils/notificationService';
import { formatRelativeTime } from '../../utils/formatters';

export function NotificationsPage() {
  const { currentUser } = useAuth();
  const { 
    notifications, 
    dispatchedEmails,
    triggerKMCHEmergencyBroadcast,
    markNotificationRead, 
    markAllNotificationsRead 
  } = useBloodData();

  const [activeTab, setActiveTab] = useState('ALL'); // ALL, EMAILS, LOGS, UNREAD, REQUESTS
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [pushStatus, setPushStatus] = useState('default');
  const [testingAlert, setTestingAlert] = useState(false);

  // SMTP Health & Backend Diagnostic Logs
  const [smtpHealth, setSmtpHealth] = useState(null);
  const [diagnosticLogs, setDiagnosticLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Admin Custom Real Email Test State
  const [targetEmail, setTargetEmail] = useState(currentUser?.email || '');
  const [testMessage, setTestMessage] = useState('BloodLink official notification test: Emergency triage communication operational.');
  const [sendingRealMail, setSendingRealMail] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPushStatus(Notification.permission);
    }
    checkHealth();
    loadLogs();
  }, []);

  const checkHealth = async () => {
    const health = await fetchSMTPHealth();
    setSmtpHealth(health);
  };

  const loadLogs = async () => {
    setLoadingLogs(true);
    const logs = await fetchEmailLogs();
    setDiagnosticLogs(logs);
    setLoadingLogs(false);
  };

  const handleEnablePush = async () => {
    const res = await requestPushPermission();
    setPushStatus(res.status);
  };

  const handleTestKMCHPush = () => {
    setTestingAlert(true);
    triggerKMCHEmergencyBroadcast('O+', 2);
    setTimeout(() => {
      setTestingAlert(false);
      loadLogs();
      if (dispatchedEmails && dispatchedEmails.length > 0) {
        setSelectedEmail(dispatchedEmails[0]);
      }
    }, 600);
  };

  const handleSendRealTestEmail = async (e) => {
    e.preventDefault();
    if (!targetEmail.trim()) return;

    setSendingRealMail(true);
    setDeliveryResult(null);

    const result = await dispatchTestEmail(targetEmail.trim(), testMessage);
    setDeliveryResult(result);
    setSendingRealMail(false);
    loadLogs();
  };

  // Filter for in-app notifications
  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser?.id || currentUser?.role === 'admin'
  );

  const filteredNotifications = userNotifications.filter((n) => {
    if (activeTab === 'UNREAD') return !n.read;
    if (activeTab === 'REQUESTS') return n.type === 'request';
    if (activeTab === 'CONSENT') return n.type === 'consent';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumbs items={[{ label: 'Notifications & Email Dispatch Center' }]} />

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Official Sender: {OFFICIAL_SENDER}
              </span>
              
              {smtpHealth?.success ? (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SMTP Connected
                </span>
              ) : (
                <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800">
                  <AlertCircle className="w-3.5 h-3.5" /> SMTP Configuration Required
                </span>
              )}

              {pushStatus === 'granted' && (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Push Active
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Notification & Email Dispatch Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Production-grade multi-channel dispatch architecture powered by Node.js, Nodemailer & Gmail SMTP.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {pushStatus !== 'granted' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEnablePush}
                icon={Bell}
                className="text-xs bg-slate-800/80 border-slate-600 text-slate-200 hover:bg-slate-700"
              >
                Enable Push Alerts
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={handleTestKMCHPush}
              loading={testingAlert}
              icon={Flame}
              className="text-xs bg-rose-600 hover:bg-rose-500 font-bold shadow-lg shadow-rose-600/40 cursor-pointer"
            >
              🚨 Push Alert: Blood Needed in KMCH
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Test Email & Diagnostics Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Admin Diagnostic Test: Send Live Email to Real Inbox
              </h3>
              <p className="text-xs text-slate-500">
                Tests backend routing from <code>{OFFICIAL_SENDER}</code> through Gmail SMTP with live delivery diagnostics.
              </p>
            </div>
          </div>

          <button
            onClick={checkHealth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Refresh SMTP status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSendRealTestEmail} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                placeholder="Enter real recipient email (e.g. yourname@gmail.com)"
                type="email"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                variant="primary"
                loading={sendingRealMail}
                icon={Send}
                className="w-full text-xs font-bold bg-rose-600 hover:bg-rose-700"
              >
                Send Test Email
              </Button>
            </div>
          </div>
        </form>

        {/* Real Delivery Result Feedback */}
        {deliveryResult && (
          <div className={`p-4 rounded-2xl border text-xs ${
            deliveryResult.status === 'ACCEPTED' || deliveryResult.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {deliveryResult.status === 'ACCEPTED' || deliveryResult.success ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Email Accepted by Gmail SMTP Server!</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-700">
                  Message ID: {deliveryResult.messageId}
                </div>
                <div className="text-[11px] text-emerald-600">
                  The message has been queued/accepted by Google's mail server for delivery to <strong>{targetEmail}</strong>.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-900">SMTP Authentication Feedback:</strong>
                    <span className="font-mono text-[11px]">{deliveryResult.error || 'Connection error'}</span>
                  </div>
                </div>
                
                <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-[11px] leading-relaxed text-slate-700">
                  <p className="font-semibold text-slate-900 mb-1">
                    🔑 Google App Password Setup Guide:
                  </p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Open <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-rose-600 underline font-bold inline-flex items-center gap-0.5">Google App Passwords <ExternalLink className="w-2.5 h-2.5" /></a> for <strong>{OFFICIAL_SENDER}</strong>.</li>
                    <li>Generate a 16-letter App Password for "BloodLink".</li>
                    <li>Add the 16-letter password into <code>.env</code> under <code>EMAIL_APP_PASSWORD</code>.</li>
                  </ol>
                  <div className="mt-2 pt-2 border-t border-amber-100 flex items-center justify-between">
                    <span>Direct client dispatch fallback:</span>
                    <a
                      href={`mailto:${targetEmail}?subject=${encodeURIComponent('BloodLink Test Email')}&body=${encodeURIComponent(testMessage)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700 transition inline-flex items-center gap-1"
                    >
                      <span>Open Mail Client</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {[
            { id: 'ALL', label: `In-App Alerts (${userNotifications.length})`, icon: Bell },
            { id: 'EMAILS', label: `📧 Dispatched Inbox (${dispatchedEmails.length})`, icon: Mail },
            { id: 'LOGS', label: `📊 SMTP Delivery Logs (${diagnosticLogs.length})`, icon: Terminal },
            { id: 'UNREAD', label: `Unread (${userNotifications.filter((n) => !n.read).length})`, icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'LOGS') loadLogs();
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'ALL' && userNotifications.some((n) => !n.read) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllNotificationsRead(currentUser?.id)}
            icon={CheckCheck}
            className="text-xs text-slate-600 hover:text-slate-900"
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Main Content Areas */}
      {activeTab === 'LOGS' ? (
        /* BACKEND DELIVERY DIAGNOSTIC LOGS */
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs flex items-center justify-between gap-3 border border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">Backend SMTP Transmission Records</span>
            </div>
            <button
              onClick={loadLogs}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
              <span>Refresh Logs</span>
            </button>
          </div>

          {diagnosticLogs.length === 0 ? (
            <EmptyState
              icon={Terminal}
              title="No SMTP logs recorded yet"
              description="When notifications are dispatched through the backend email service, real delivery diagnostics will appear here."
            />
          ) : (
            <div className="space-y-2">
              {diagnosticLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : log.status === 'ACCEPTED_CACHED'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {log.status === 'ACCEPTED' ? '✓ Accepted by SMTP' : log.status === 'ACCEPTED_CACHED' ? '✓ Deduplicated' : '✗ ' + log.status}
                      </span>
                      <span className="text-slate-400 text-[10px]">[{log.type}]</span>
                      <span className="text-slate-600 font-bold truncate">To: {log.recipient}</span>
                    </div>

                    <div className="text-[11px] text-slate-800 font-sans font-semibold truncate">
                      {log.subject}
                    </div>

                    {log.messageId && (
                      <div className="text-[10px] text-slate-400">
                        ID: {log.messageId}
                      </div>
                    )}
                    {log.error && (
                      <div className="text-[10px] text-rose-600 font-sans font-medium">
                        Error: {log.error}
                      </div>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0 text-[10px] text-slate-400">
                    {formatRelativeTime(log.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'EMAILS' ? (
        /* EMAIL INBOX LIST */
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-rose-600" />
              <span className="font-bold text-slate-800">
                Dispatched Donor Email Notifications (From: {OFFICIAL_SENDER})
              </span>
            </div>
            <span className="text-slate-500 font-medium">
              Click any message to open full HTML email preview & actions
            </span>
          </div>

          {dispatchedEmails.length === 0 ? (
            <EmptyState
              icon={Mail}
              title="No email notifications dispatched yet"
              description="When a blood request is created for KMCH or other hospitals, emails will appear here."
            />
          ) : (
            dispatchedEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-xs font-bold text-slate-900">
                        {email.recipientName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        &lt;{email.to}&gt;
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Accepted by SMTP
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors truncate">
                      {email.subject}
                    </h4>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Building2 className="w-3 h-3 text-rose-500" />
                        {email.hospitalName}
                      </span>
                      <span>•</span>
                      <span>{email.units} unit(s)</span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">{email.requestId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 flex-shrink-0">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {formatRelativeTime(email.timestamp)}
                  </span>
                  <BloodGroupBadge group={email.bloodGroup} size="sm" />
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* IN-APP NOTIFICATIONS LIST */
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications in this view"
              description="Click 'Push Alert: Blood Needed in KMCH' above to simulate a live notification broadcast!"
            />
          ) : (
            filteredNotifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkRead={markNotificationRead}
              />
            ))
          )}
        </div>
      )}

      {/* Email Modal Preview */}
      <EmailInboxModal
        email={selectedEmail}
        isOpen={Boolean(selectedEmail)}
        onClose={() => setSelectedEmail(null)}
      />
    </div>
  );
}
