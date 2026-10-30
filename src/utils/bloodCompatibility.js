/**
 * Scientific Blood Compatibility Matrices & Matching Algorithms
 * Based on standard Red Blood Cell (RBC) ABO and Rh factor compatibility.
 * 
 * Note: These matrices provide general biological compatibility heuristics.
 * Final clinical cross-matching must always be verified by an authorized blood bank pathologist.
 */

export const COMPATIBILITY_CHART = {
  'O-': {
    canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal Red Cell Donor
    canReceiveFrom: ['O-']
  },
  'O+': {
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O-', 'O+']
  },
  'A-': {
    canDonateTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-', 'A-']
  },
  'A+': {
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+']
  },
  'B-': {
    canDonateTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-', 'B-']
  },
  'B+': {
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['O-', 'O+', 'B-', 'B+']
  },
  'AB-': {
    canDonateTo: ['AB-', 'AB+'],
    canReceiveFrom: ['O-', 'A-', 'B-', 'AB-']
  },
  'AB+': {
    canDonateTo: ['AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] // Universal Red Cell Recipient
  }
};

/**
 * Checks whether a donor blood group can donate to a recipient blood group
 */
export function isBloodCompatible(donorBloodGroup, recipientBloodGroup) {
  if (!donorBloodGroup || !recipientBloodGroup) return false;
  const donorRule = COMPATIBILITY_CHART[donorBloodGroup];
  if (!donorRule) return false;
  return donorRule.canDonateTo.includes(recipientBloodGroup);
}

/**
 * Calculate minimum days since last donation for safe donation cooldown (typically 90 days / 3 months)
 */
export function getDaysSinceDate(dateString) {
  if (!dateString) return 999;
  const past = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - past);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check donor self-reported basic eligibility status
 */
export function checkEligibilityStatus(donor) {
  const daysSince = getDaysSinceDate(donor.lastDonationDate);
  const isCooldownOver = daysSince >= 90;
  
  const isBasicHealthOk = 
    donor.screening?.noRecentTattoo &&
    donor.screening?.noMajorSurgery &&
    donor.screening?.notFeelingSick &&
    donor.screening?.weightAbove50kg;

  if (isCooldownOver && isBasicHealthOk && donor.availability) {
    return {
      status: 'Eligible',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      label: 'Screening Passed (Basic)',
      details: `${daysSince} days since last donation. Basic screening checks passed.`
    };
  } else if (!isCooldownOver) {
    return {
      status: 'Cooldown',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      label: `Cooldown (${90 - daysSince}d remaining)`,
      details: `Must wait 90 days between whole blood donations. ${daysSince} days elapsed.`
    };
  } else {
    return {
      status: 'Review Needed',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
      label: 'Requires Medical Review',
      details: 'Self-reported medical criteria requires verification by blood bank coordinator.'
    };
  }
}

/**
 * Transparent Matching Algorithm
 * Calculates matching tier, score, and factors for a donor against a blood request.
 */
export function calculateMatchScore(donor, request) {
  const isCompatible = isBloodCompatible(donor.bloodGroup, request.bloodGroup);
  if (!isCompatible) {
    return {
      compatible: false,
      score: 0,
      tier: 'Incompatible',
      tierColor: 'text-slate-400 bg-slate-100',
      reasons: ['Blood group incompatible with requirement']
    };
  }

  let score = 50; // Base compatibility points
  const reasons = [];

  // Exact Match Bonus
  if (donor.bloodGroup === request.bloodGroup) {
    score += 20;
    reasons.push('Exact blood group match');
  } else {
    reasons.push(`Universal/Compatible alternative (${donor.bloodGroup} → ${request.bloodGroup})`);
  }

  // Availability Check
  if (donor.availability) {
    score += 15;
    reasons.push('Donor currently available');
  } else {
    reasons.push('Donor marked as temporarily unavailable');
  }

  // Location Proximity Check (City level)
  const isSameCity = donor.city && request.city && 
    donor.city.toLowerCase().split(',')[0].trim() === request.city.toLowerCase().split(',')[0].trim();
  
  if (isSameCity) {
    score += 15;
    reasons.push(`Located in the same metropolitan area (${donor.city.split(',')[0]})`);
  } else {
    reasons.push(`Adjacent region: ${donor.city?.split(',')[0] || 'Unknown'}`);
  }

  // Eligibility evaluation
  const eligibility = checkEligibilityStatus(donor);
  if (eligibility.status === 'Eligible') {
    score += 10;
    reasons.push('Donation cooldown interval satisfied (>= 90 days)');
  } else if (eligibility.status === 'Cooldown') {
    score -= 25;
    reasons.push('Within 90-day cooldown interval');
  }

  score = Math.max(10, Math.min(100, score));

  let tier = 'Potential Match';
  let tierColor = 'bg-blue-100 text-blue-800 border-blue-200';
  let tierBadge = 'Potential Match';

  if (score >= 85) {
    tier = 'High Match';
    tierColor = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
    tierBadge = '⭐ High Priority Match';
  } else if (score >= 60) {
    tier = 'Good Match';
    tierColor = 'bg-teal-100 text-teal-800 border-teal-300';
    tierBadge = 'Good Compatibility';
  }

  return {
    compatible: true,
    score,
    tier,
    tierBadge,
    tierColor,
    reasons,
    eligibility,
    isSameCity
  };
}
