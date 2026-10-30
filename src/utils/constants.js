export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BLOOD_COMPONENTS = [
  { id: 'whole_blood', label: 'Whole Blood (Standard)', desc: 'For general trauma, surgeries & anemia' },
  { id: 'prbc', label: 'Packed Red Blood Cells (PRBC)', desc: 'For severe blood loss & low hemoglobin' },
  { id: 'platelets', label: 'Platelets (SDP / RDP)', desc: 'For Dengue, cancer therapy & clotting' },
  { id: 'plasma', label: 'Fresh Frozen Plasma (FFP)', desc: 'For burn victims, liver disease & trauma' },
  { id: 'cryo', label: 'Cryoprecipitate', desc: 'For hemophilia & clotting factor deficiency' }
];

export const ROLES = {
  DONOR: 'donor',
  RECIPIENT: 'recipient',
  HOSPITAL: 'hospital',
  ADMIN: 'admin'
};

export const URGENCY_LEVELS = {
  NORMAL: {
    value: 'Normal',
    label: 'Normal (Within 24-48 hrs)',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    color: 'emerald'
  },
  URGENT: {
    value: 'Urgent',
    label: 'Urgent (Within 6-12 hrs)',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    color: 'amber'
  },
  EMERGENCY: {
    value: 'Emergency',
    label: 'CRITICAL EMERGENCY (Immediate)',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
    color: 'rose'
  }
};

export const REQUEST_STATUS = {
  SEARCHING: {
    value: 'Searching',
    label: 'Searching Donors',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  DONOR_FOUND: {
    value: 'Donor Found',
    label: 'Potential Donor Identified',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  CONTACT_PENDING: {
    value: 'Contact Pending',
    label: 'Consent Pending',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  CONFIRMED: {
    value: 'Confirmed',
    label: 'Donation Scheduled',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  COMPLETED: {
    value: 'Completed',
    label: 'Completed',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300'
  },
  CANCELLED: {
    value: 'Cancelled',
    label: 'Cancelled',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200'
  }
};

export const CONTACT_METHODS = [
  { value: 'in_app', label: 'In-App Secure Coordination (Recommended)' },
  { value: 'sms', label: 'Masked SMS Gateway' },
  { value: 'call', label: 'Authorized Hospital Coordinator Direct Call' }
];

export const CITIES = [
  'Coimbatore, Tamil Nadu',
  'Chennai, Tamil Nadu',
  'Bengaluru, Karnataka',
  'Kochi, Kerala',
  'Hyderabad, Telangana',
  'Mumbai, Maharashtra',
  'Delhi NCR',
  'Pune, Maharashtra'
];

export const POPULAR_HOSPITALS = {
  'Coimbatore, Tamil Nadu': [
    'PSG Institute of Medical Sciences & Hospital (Peelamedu)',
    'KMCH Hospital & Research Center (Avinashi Road)',
    'G.K. Memorial City Hospital (Gandhipuram)',
    'Coimbatore Medical College Hospital (CMCH)',
    'Ganga Medical Centre & Hospital (Ram Nagar)'
  ],
  'Chennai, Tamil Nadu': [
    'Apollo Speciality Hospitals (Greams Road)',
    'Fortis Malar Hospital (Adyar)',
    'Madras Medical Mission (Mogappair)',
    'MIOT International (Manapakkam)',
    'SIMS Hospital (Vadapalani)'
  ],
  'Bengaluru, Karnataka': [
    'Manipal Hospital (Old Airport Road)',
    'Narayana Health City (Bommasandra)',
    'Apollo Hospital (Bannerghatta Road)',
    'St. John’s Medical College Hospital (Koramangala)',
    'Aster CMI Hospital (Hebbal)'
  ]
};
