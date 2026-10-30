export const INITIAL_USERS = [
  {
    id: 'user-donor-1',
    name: 'Karthik Subramanian',
    email: 'karthik.donor@example.com',
    role: 'donor',
    bloodGroup: 'O+',
    city: 'Coimbatore, Tamil Nadu',
    phone: '+91 98452 11234',
    availability: true,
    lastDonationDate: '2026-05-10',
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
    totalDonations: 4,
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'user-donor-2',
    name: 'Ananya Ramesh',
    email: 'ananya.o.neg@example.com',
    role: 'donor',
    bloodGroup: 'O-', // Universal Donor!
    city: 'Coimbatore, Tamil Nadu',
    phone: '+91 94432 99881',
    availability: true,
    lastDonationDate: '2026-04-02',
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
    totalDonations: 7,
    createdAt: '2026-02-10T11:20:00Z'
  },
  {
    id: 'user-donor-3',
    name: 'Vikramaditya Rao',
    email: 'vikram.ab@example.com',
    role: 'donor',
    bloodGroup: 'A+',
    city: 'Chennai, Tamil Nadu',
    phone: '+91 98840 55678',
    availability: true,
    lastDonationDate: '2026-01-20',
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
    preferredContactMethod: 'sms',
    consent: true,
    totalDonations: 2,
    createdAt: '2026-03-01T14:30:00Z'
  },
  {
    id: 'user-donor-4',
    name: 'Pooja Sundaram',
    email: 'pooja.bpos@example.com',
    role: 'donor',
    bloodGroup: 'B+',
    city: 'Bengaluru, Karnataka',
    phone: '+91 99001 22334',
    availability: false, // Temporarily resting
    lastDonationDate: '2026-08-15', // Recent
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
    totalDonations: 3,
    createdAt: '2026-03-12T10:00:00Z'
  },
  {
    id: 'user-donor-5',
    name: 'Dr. Rahul Menon',
    email: 'rahul.menon@example.com',
    role: 'donor',
    bloodGroup: 'AB-',
    city: 'Kochi, Kerala',
    phone: '+91 97451 88776',
    availability: true,
    lastDonationDate: '2026-03-18',
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
    totalDonations: 5,
    createdAt: '2026-02-28T16:45:00Z'
  },
  {
    id: 'user-donor-6',
    name: 'Meera Nambiar',
    email: 'meera.abpos@example.com',
    role: 'donor',
    bloodGroup: 'AB+', // Universal Recipient
    city: 'Coimbatore, Tamil Nadu',
    phone: '+91 96001 44552',
    availability: true,
    lastDonationDate: '2026-04-20',
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
    totalDonations: 1,
    createdAt: '2026-04-10T12:00:00Z'
  },
  {
    id: 'user-recipient-1',
    name: 'Siddharth Varma',
    email: 'siddharth.recipient@example.com',
    role: 'recipient',
    city: 'Coimbatore, Tamil Nadu',
    phone: '+91 98400 99882',
    createdAt: '2026-06-01T08:00:00Z'
  },
  {
    id: 'user-hospital-1',
    name: 'G.K. Memorial City Hospital',
    email: 'emergency@gkmedical.org',
    role: 'hospital',
    city: 'Coimbatore, Tamil Nadu',
    phone: '+91 422 2490000',
    department: 'Emergency & Trauma Care Unit',
    isVerifiedOrg: true,
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-admin-1',
    name: 'Admin Moderator',
    email: 'admin@bloodconnect.org',
    role: 'admin',
    city: 'Central Operations Hub',
    phone: '+91 800 200 9000',
    createdAt: '2026-01-01T00:00:00Z'
  }
];

export const INITIAL_REQUESTS = [
  {
    id: 'REQ-8021',
    requesterId: 'user-recipient-1',
    requesterName: 'Siddharth Varma',
    bloodGroup: 'O+',
    units: 2,
    urgency: 'Emergency',
    hospitalName: 'PSG Institute of Medical Sciences & Hospital',
    city: 'Coimbatore, Tamil Nadu',
    requiredDate: '2026-09-24',
    patientAge: 38,
    purpose: 'Emergency surgery following accident trauma',
    status: 'Donor Found',
    contactConsentGranted: false,
    matchedDonorIds: ['user-donor-1', 'user-donor-2'],
    contactRevealed: false,
    notes: 'Urgent need for blood components within 6 hours. Coordinated through Blood Bank Desk.',
    createdAt: '2026-09-23T14:30:00Z'
  },
  {
    id: 'REQ-8019',
    requesterId: 'user-hospital-1',
    requesterName: 'G.K. Memorial City Hospital',
    bloodGroup: 'A+',
    units: 3,
    urgency: 'Urgent',
    hospitalName: 'G.K. Memorial City Hospital - Ward 4B',
    city: 'Coimbatore, Tamil Nadu',
    requiredDate: '2026-09-25',
    patientAge: 52,
    purpose: 'Cardiovascular bypass operation requirement',
    status: 'Contact Pending',
    contactConsentGranted: true,
    matchedDonorIds: ['user-donor-3', 'user-donor-1'],
    contactRevealed: false,
    notes: 'Replacement units needed for upcoming scheduled surgery.',
    createdAt: '2026-09-23T09:15:00Z'
  },
  {
    id: 'REQ-8015',
    requesterId: 'user-recipient-1',
    requesterName: 'Siddharth Varma',
    bloodGroup: 'B+',
    units: 1,
    urgency: 'Normal',
    hospitalName: 'KMCH Hospital & Research Center',
    city: 'Coimbatore, Tamil Nadu',
    requiredDate: '2026-09-28',
    patientAge: 29,
    purpose: 'Thalassemia regular transfusion support',
    status: 'Searching',
    contactConsentGranted: false,
    matchedDonorIds: [],
    contactRevealed: false,
    notes: 'Scheduled monthly transfusion procedure.',
    createdAt: '2026-09-22T16:00:00Z'
  },
  {
    id: 'REQ-7988',
    requesterId: 'user-hospital-1',
    requesterName: 'G.K. Memorial City Hospital',
    bloodGroup: 'O-',
    units: 2,
    urgency: 'Emergency',
    hospitalName: 'Apollo Speciality Hospitals',
    city: 'Chennai, Tamil Nadu',
    requiredDate: '2026-09-20',
    patientAge: 44,
    purpose: 'ICU Critical Care & Acute Platelet Support',
    status: 'Completed',
    contactConsentGranted: true,
    matchedDonorIds: ['user-donor-2'],
    contactRevealed: true,
    notes: 'Donation successfully fulfilled with mutual consent. Patient stable.',
    createdAt: '2026-09-19T11:00:00Z',
    completedAt: '2026-09-20T17:30:00Z'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    userId: 'user-donor-1',
    title: 'Emergency Blood Request Match (O+)',
    message: 'A critical emergency blood request (REQ-8021) at PSG Institute matches your blood group and location.',
    type: 'request',
    requestId: 'REQ-8021',
    read: false,
    createdAt: '2026-09-23T14:32:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-donor-1',
    title: 'Privacy Consent Requested',
    message: 'G.K. Memorial City Hospital has requested contact consent for request REQ-8019.',
    type: 'consent',
    requestId: 'REQ-8019',
    read: false,
    createdAt: '2026-09-23T09:20:00Z'
  },
  {
    id: 'notif-3',
    userId: 'user-recipient-1',
    title: 'Potential Donor Found!',
    message: 'An available, compatible donor in Coimbatore was identified for request REQ-8021. Contact consent pending.',
    type: 'match',
    requestId: 'REQ-8021',
    read: false,
    createdAt: '2026-09-23T14:35:00Z'
  },
  {
    id: 'notif-4',
    userId: 'user-donor-2',
    title: 'Donation Completed - Thank you!',
    message: 'Your donation for request REQ-7988 has been recorded. You helped save a life!',
    type: 'success',
    requestId: 'REQ-7988',
    read: true,
    createdAt: '2026-09-20T18:00:00Z'
  }
];

export const INITIAL_STATS = {
  totalDonationsCompleted: 1420,
  activeDonorsCount: 3840,
  emergencyResponseAvgMins: 14,
  hospitalsConnected: 48
};
