export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString) {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

/**
 * Mask sensitive contact info for privacy protection before explicit consent
 */
export function maskPhoneNumber(phone) {
  if (!phone) return '•••• •••• 90';
  const clean = phone.replace(/\s+/g, '');
  if (clean.length < 4) return '•••• ••••';
  return clean.slice(0, 3) + ' ••• ••' + clean.slice(-2);
}

export function maskEmail(email) {
  if (!email) return 'd••••@••••.org';
  const [name, domain] = email.split('@');
  if (!domain) return '••••@••••.org';
  const maskedName = name.length > 2 ? name[0] + '•••' + name[name.length - 1] : name[0] + '••';
  return `${maskedName}@${domain}`;
}

export function anonymizeName(name) {
  if (!name) return 'Donor #Anon';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0] + '••••• (Donor)';
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}
