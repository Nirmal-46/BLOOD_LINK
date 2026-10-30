/**
 * Smart Emergency Pickup Point Utility
 * Calculates optimal, safe public meeting / handover points between far-away donors and recipients.
 */

// City reference coordinates (Tamil Nadu & Southern India Transit Corridors)
export const CITY_COORDINATES = {
  'Coimbatore, Tamil Nadu': { lat: 11.0168, lon: 76.9558, name: 'Coimbatore' },
  'Salem, Tamil Nadu': { lat: 11.6643, lon: 78.1460, name: 'Salem' },
  'Erode, Tamil Nadu': { lat: 11.3410, lon: 77.7172, name: 'Erode' },
  'Tiruppur, Tamil Nadu': { lat: 11.1085, lon: 77.3411, name: 'Tiruppur' },
  'Chennai, Tamil Nadu': { lat: 13.0827, lon: 80.2707, name: 'Chennai' },
  'Bengaluru, Karnataka': { lat: 12.9716, lon: 77.5946, name: 'Bengaluru' },
  'Madurai, Tamil Nadu': { lat: 9.9252, lon: 78.1198, name: 'Madurai' },
  'Trichy, Tamil Nadu': { lat: 10.7905, lon: 78.7047, name: 'Trichy' },
  'Kochi, Kerala': { lat: 9.9312, lon: 76.2673, name: 'Kochi' },
  'Palakkad, Kerala': { lat: 10.7867, lon: 76.6548, name: 'Palakkad' },
  'Vellore, Tamil Nadu': { lat: 12.9165, lon: 79.1325, name: 'Vellore' },
  'Hosur, Tamil Nadu': { lat: 12.7409, lon: 77.8253, name: 'Hosur' }
};

// Curated safe, public, and medical-grade pickup locations along highway & transit corridors
export const SAFE_PICKUP_LOCATIONS = [
  // Coimbatore <-> Salem Highway Corridor (NH 544)
  {
    id: 'pk-erode-gh',
    name: 'Erode Government Headquarters Hospital & Blood Bank',
    category: 'Government Hospital & Blood Bank',
    address: 'Near GH Roundana, Brough Road, Erode',
    corridor: 'Coimbatore - Salem (NH 544)',
    lat: 11.3410,
    lon: 77.7172,
    amenities: ['24/7 Blood Cold Chain Unit', 'Emergency Ambulance Bay', '24/7 Security & CCTV', 'On-Duty Medical Staff'],
    safetyRating: 4.9,
    publicAccess: 'High (State Highway & Bus Rapid Transit)',
    isColdChainReady: true,
    contactHelpDesk: '+91 424 225 1100'
  },
  {
    id: 'pk-perundurai-med',
    name: 'Government Medical College Hospital (IRT Perundurai)',
    category: 'Tertiary Care Medical Center',
    address: 'NH 544 Bypass Road, Perundurai',
    corridor: 'Coimbatore - Salem (NH 544)',
    lat: 11.2750,
    lon: 77.5850,
    amenities: ['Trauma ICU Intercept', 'Refrigerated Storage', 'Highway Emergency Exit', 'Helipad / Fast Ambulance Access'],
    safetyRating: 4.8,
    publicAccess: 'Immediate Highway Access',
    isColdChainReady: true,
    contactHelpDesk: '+91 4294 220 221'
  },
  {
    id: 'pk-tiruppur-dist-gh',
    name: 'Tiruppur District Government Hospital & Transfusion Wing',
    category: 'District Hospital',
    address: 'Kumaran Road, Near Railway Station, Tiruppur',
    corridor: 'Coimbatore - Salem (NH 544)',
    lat: 11.1085,
    lon: 77.3411,
    amenities: ['Component Storage Unit', '24/7 Emergency Triage', 'Direct Railway/Bus Junction'],
    safetyRating: 4.7,
    publicAccess: 'Central City Transit Hub',
    isColdChainReady: true,
    contactHelpDesk: '+91 421 224 4500'
  },
  {
    id: 'pk-bhavani-trauma',
    name: 'Bhavani Highway Emergency Trauma Care & First Aid Post',
    category: 'Highway Emergency Hub',
    address: 'NH 544 Toll Plaza Junction, Bhavani',
    corridor: 'Coimbatore - Salem (NH 544)',
    lat: 11.4500,
    lon: 77.6833,
    amenities: ['Highway Patrol Booth', 'Cold Storage Box Support', 'Public Parking & Rest Area'],
    safetyRating: 4.6,
    publicAccess: 'Direct Highway Toll Intercept',
    isColdChainReady: false,
    contactHelpDesk: '+91 4256 230 108'
  },
  {
    id: 'pk-sankari-phc',
    name: 'Sankari 24/7 Upgraded Primary Health & Trauma Center',
    category: 'Public Health Care Center',
    address: 'Salem Main Road, Sankari Tollway',
    corridor: 'Coimbatore - Salem (NH 544)',
    lat: 11.4833,
    lon: 77.8667,
    amenities: ['Emergency First Response', 'Medical Cold Storage', 'Police Highway Helpdesk'],
    safetyRating: 4.7,
    publicAccess: 'Highway Service Lane',
    isColdChainReady: true,
    contactHelpDesk: '+91 4283 240 100'
  },

  // Chennai <-> Bengaluru Highway Corridor (NH 48)
  {
    id: 'pk-vellore-cmc-ch',
    name: 'CMC Vellore Chittoor-Ranipet Highway Care Hub',
    category: 'Medical Research & Blood Center',
    address: 'NH 48 Ranipet Bypass, Vellore',
    corridor: 'Chennai - Bengaluru (NH 48)',
    lat: 12.9250,
    lon: 79.1350,
    amenities: ['Advanced Blood Bank', 'Trauma Bay', '24/7 Staffed Handover Desk'],
    safetyRating: 4.9,
    publicAccess: 'Major Highway Medical Hub',
    isColdChainReady: true,
    contactHelpDesk: '+91 416 228 1000'
  },
  {
    id: 'pk-hosur-gh',
    name: 'Hosur Government Hospital & Inter-State Handover Point',
    category: 'Border Transit Hospital',
    address: 'Near Old Bus Stand, Bagalur Road, Hosur',
    corridor: 'Chennai - Bengaluru (NH 48)',
    lat: 12.7409,
    lon: 77.8253,
    amenities: ['Inter-State Medical Clearance', 'Cold Storage Unit', '24/7 Security'],
    safetyRating: 4.8,
    publicAccess: 'State Border Highway',
    isColdChainReady: true,
    contactHelpDesk: '+91 4344 222 055'
  },

  // Coimbatore <-> Kochi / Palakkad Corridor (NH 544)
  {
    id: 'pk-palakkad-dist-hosp',
    name: 'Palakkad District Hospital Blood Transfusion Center',
    category: 'District Blood Bank',
    address: 'Court Road, Palakkad Junction',
    corridor: 'Coimbatore - Kochi Corridor',
    lat: 10.7867,
    lon: 76.6548,
    amenities: ['24/7 Cold Chain Storage', 'Emergency Wing', 'Inter-State Ambulance Point'],
    safetyRating: 4.8,
    publicAccess: 'Highway Crossing Point',
    isColdChainReady: true,
    contactHelpDesk: '+91 491 253 4524'
  }
];

/**
 * Haversine formula to calculate approximate distance in kilometers between two geo-coordinates
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 decimal place
}

/**
 * Estimate road travel time (minutes) based on distance and transit conditions
 * Accounts for highway speeds and emergency priority clearance.
 */
export function estimateTravelTimeMinutes(distanceKm, isEmergency = true) {
  if (distanceKm <= 0) return 5;
  // Emergency ambulance / fast transit averages ~60-70 km/h on highways + 8 min buffer for dispatch
  const avgSpeedKmh = isEmergency ? 65 : 45;
  const transitMins = Math.round((distanceKm / avgSpeedKmh) * 60) + 6;
  return Math.max(transitMins, 10);
}

/**
 * Format minutes into readable "1h 35m" or "45 min" format
 */
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins < 10 ? '0' : ''}${mins}m` : `${hrs} hr`;
}

/**
 * Resolve geo coordinates from city string or fallback
 */
export function resolveCoordinates(locationString, defaultCity = 'Coimbatore, Tamil Nadu') {
  if (!locationString) return CITY_COORDINATES[defaultCity];
  
  // Direct match
  if (CITY_COORDINATES[locationString]) {
    return CITY_COORDINATES[locationString];
  }

  // Partial match
  const matchedKey = Object.keys(CITY_COORDINATES).find((key) =>
    locationString.toLowerCase().includes(key.split(',')[0].toLowerCase())
  );

  if (matchedKey) return CITY_COORDINATES[matchedKey];

  // Default fallback
  return {
    lat: 11.0168,
    lon: 76.9558,
    name: locationString
  };
}

/**
 * Check whether direct donor-to-recipient travel is practical within emergency deadline
 */
export function isDirectTravelPractical(donorLoc, recipientLoc, deadlineMinutes = 120) {
  const dCoords = resolveCoordinates(donorLoc, 'Coimbatore, Tamil Nadu');
  const rCoords = resolveCoordinates(recipientLoc, 'Salem, Tamil Nadu');

  const directDistanceKm = haversineDistance(dCoords.lat, dCoords.lon, rCoords.lat, rCoords.lon);
  const directTravelMins = estimateTravelTimeMinutes(directDistanceKm, true);

  // If travel takes > 75% of emergency deadline or > 90 mins, direct travel is considered impractical
  const isTooFar = directDistanceKm > 60;
  const isTimeCritical = directTravelMins > deadlineMinutes * 0.75;

  return {
    isPractical: !isTooFar && !isTimeCritical,
    directDistanceKm,
    directTravelMins,
    directTravelFormatted: formatDuration(directTravelMins),
    deadlineMinutes
  };
}

/**
 * Find, rank, and score Smart Emergency Pickup Points between Donor and Recipient
 */
export function calculateSmartPickupPoints(donorLocation, recipientLocation, deadlineMinutes = 120) {
  const dCoords = resolveCoordinates(donorLocation, 'Coimbatore, Tamil Nadu');
  const rCoords = resolveCoordinates(recipientLocation, 'Salem, Tamil Nadu');

  const directDist = haversineDistance(dCoords.lat, dCoords.lon, rCoords.lat, rCoords.lon);
  const directTimeMins = estimateTravelTimeMinutes(directDist, true);

  // Calculate geometric midpoint
  const midLat = (dCoords.lat + rCoords.lat) / 2;
  const midLon = (dCoords.lon + rCoords.lon) / 2;

  // Score and rank all safe locations
  const candidates = SAFE_PICKUP_LOCATIONS.map((loc) => {
    const distFromDonor = haversineDistance(dCoords.lat, dCoords.lon, loc.lat, loc.lon);
    const distFromRecipient = haversineDistance(rCoords.lat, rCoords.lon, loc.lat, loc.lon);
    const distFromMidpoint = haversineDistance(midLat, midLon, loc.lat, loc.lon);

    const donorTimeMins = estimateTravelTimeMinutes(distFromDonor, true);
    const recipientTimeMins = estimateTravelTimeMinutes(distFromRecipient, true);

    // Parallel travel means maximum of both journeys (since both parties depart simultaneously)
    const totalCoordinationMins = Math.max(donorTimeMins, recipientTimeMins) + 12; // 12 mins handover buffer
    const travelTimeSavedMins = Math.max(directTimeMins - totalCoordinationMins, 15);

    // Travel Balance Difference (lower is better, meaning both travel equal amounts)
    const travelDeltaMins = Math.abs(donorTimeMins - recipientTimeMins);

    // Scoring system (Out of 100)
    let score = 100;
    // Penalize midpoint deviation
    score -= distFromMidpoint * 0.4;
    // Penalize travel asymmetry
    score -= travelDeltaMins * 0.6;
    // Bonus for 24/7 cold chain blood bank facility
    if (loc.isColdChainReady) score += 15;
    // Bonus for high safety rating
    score += loc.safetyRating * 3;

    // Human-readable recommendation rationale
    const reasons = [];
    if (loc.isColdChainReady) {
      reasons.push('Certified 24/7 Blood Storage & Cold Chain facility on-site');
    }
    if (travelDeltaMins <= 18) {
      reasons.push(`Balanced journey (${formatDuration(donorTimeMins)} donor vs ${formatDuration(recipientTimeMins)} recipient)`);
    }
    if (totalCoordinationMins <= deadlineMinutes) {
      reasons.push(`Well within emergency window (${formatDuration(totalCoordinationMins)} vs ${formatDuration(deadlineMinutes)} limit)`);
    }
    reasons.push(`Saves ~${formatDuration(travelTimeSavedMins)} compared with direct one-way transit`);

    return {
      ...loc,
      distFromDonor,
      distFromRecipient,
      donorTimeMins,
      recipientTimeMins,
      donorTimeFormatted: formatDuration(donorTimeMins),
      recipientTimeFormatted: formatDuration(recipientTimeMins),
      totalCoordinationMins,
      totalCoordinationFormatted: formatDuration(totalCoordinationMins),
      travelTimeSavedMins,
      travelTimeSavedFormatted: formatDuration(travelTimeSavedMins),
      score: Math.round(score),
      reasons,
      isRecommended: false
    };
  });

  // Filter candidates relevant to the region or within reasonable bounds
  const relevantCandidates = candidates
    .filter((c) => c.distFromDonor + c.distFromRecipient < directDist * 1.6)
    .sort((a, b) => b.score - a.score);

  // Fallback if none matched
  const finalOptions = (relevantCandidates.length >= 2 ? relevantCandidates : candidates.slice(0, 3)).slice(0, 3);

  // Mark highest scoring as Recommended
  if (finalOptions.length > 0) {
    finalOptions[0].isRecommended = true;
  }

  return {
    donor: {
      location: donorLocation,
      coords: dCoords
    },
    recipient: {
      location: recipientLocation,
      coords: rCoords
    },
    directTrip: {
      distanceKm: directDist,
      travelTimeMins: directTimeMins,
      formattedTime: formatDuration(directTimeMins)
    },
    emergencyDeadlineMinutes: deadlineMinutes,
    isDirectTravelOptimal: directDist < 40 && directTimeMins < deadlineMinutes * 0.5,
    recommendedPickupPoint: finalOptions[0] || null,
    pickupOptions: finalOptions
  };
}

/**
 * Preloaded Hackathon Demo Scenario:
 * Donor in Coimbatore, Recipient in Salem (Emergency O+ 2 Units, 2 Hours deadline)
 */
export function getHackathonDemoScenario() {
  const result = calculateSmartPickupPoints(
    'Coimbatore, Tamil Nadu',
    'Salem, Tamil Nadu',
    120 // 2 hours
  );

  return {
    id: 'DEMO-SMART-PICKUP-2026',
    requestId: 'REQ-8021',
    bloodGroup: 'O+',
    units: 2,
    urgency: 'Emergency',
    donorName: 'Karthik Subramanian',
    donorLocation: 'Coimbatore, Tamil Nadu (Peelamedu)',
    donorPhoneMasked: '+91 98452 •••••',
    recipientName: 'Salem City Trauma Care Unit',
    recipientLocation: 'Salem, Tamil Nadu (Five Roads)',
    recipientHospital: 'Salem Government Mohan Kumaramangalam Medical College',
    deadlineRemainingMinutes: 95, // 1h 35m
    ...result
  };
}
