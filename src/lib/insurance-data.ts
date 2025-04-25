// Sample data for LA area based on California Department of Insurance 2024 data
export const zipCodeData: Record<string, any> = {
  '90049': {
    name: 'Brentwood',
    riskLevel: 'very-high',
    fireHazardZone: 'very-high',
    nonRenewalRate: 0.32,
    availableInsurers: 4,
    fairPlanEstimate: 5850,
    privateMarketEstimate: 7800,
    privateMarketAvailable: true
  },
  '90272': {
    name: 'Pacific Palisades',
    riskLevel: 'very-high',
    fireHazardZone: 'very-high',
    nonRenewalRate: 0.37,
    availableInsurers: 3,
    fairPlanEstimate: 6250,
    privateMarketEstimate: 9200,
    privateMarketAvailable: true
  },
  '90065': {
    name: 'Los Feliz',
    riskLevel: 'high',
    fireHazardZone: 'high',
    nonRenewalRate: 0.28,
    availableInsurers: 5,
    fairPlanEstimate: 4950,
    privateMarketEstimate: 6350,
    privateMarketAvailable: true
  },
  '91011': {
    name: 'La Cañada Flintridge',
    riskLevel: 'very-high',
    fireHazardZone: 'very-high',
    nonRenewalRate: 0.41,
    availableInsurers: 2,
    fairPlanEstimate: 6750,
    privateMarketEstimate: 11200,
    privateMarketAvailable: false
  },
  '91302': {
    name: 'Calabasas',
    riskLevel: 'very-high',
    fireHazardZone: 'very-high',
    nonRenewalRate: 0.39,
    availableInsurers: 3,
    fairPlanEstimate: 6450,
    privateMarketEstimate: 9850,
    privateMarketAvailable: true
  },
  '90402': {
    name: 'Santa Monica',
    riskLevel: 'moderate',
    fireHazardZone: 'moderate',
    nonRenewalRate: 0.18,
    availableInsurers: 7,
    fairPlanEstimate: 3250,
    privateMarketEstimate: 4850,
    privateMarketAvailable: true
  }
};

// Sample data for forecasts based on CAL FIRE and CDI trend projections
export const zipCodeForecasts: Record<string, any> = {
  '90049': {
    nonRenewalRates: [35, 42, 48, 54, 60],
    insurers: [4, 3, 2, 1, 1],
    premiums: [7800, 8700, 9800, 11200, 12800]
  },
  '90272': {
    nonRenewalRates: [37, 46, 55, 64, 72],
    insurers: [3, 2, 1, 0, 0],
    premiums: [9200, 10500, 12200, 14300, 16700]
  },
  '90065': {
    nonRenewalRates: [28, 33, 38, 43, 48],
    insurers: [5, 4, 3, 3, 2],
    premiums: [6350, 7100, 7900, 8800, 9800]
  },
  '91011': {
    nonRenewalRates: [41, 50, 59, 68, 77],
    insurers: [2, 1, 0, 0, 0],
    premiums: [11200, 13000, 15200, 17800, 20500]
  },
  '91302': {
    nonRenewalRates: [39, 48, 57, 65, 73],
    insurers: [3, 2, 1, 0, 0],
    premiums: [9850, 11400, 13200, 15300, 17800]
  },
  '90402': {
    nonRenewalRates: [18, 21, 24, 27, 30],
    insurers: [7, 6, 6, 5, 5],
    premiums: [4850, 5400, 6000, 6700, 7400]
  }
};

// Sample data for recommendations based on CalFire risk assessments
export const recommendations = [
  {
    zipCode: '93105',
    city: 'Santa Barbara',
    state: 'CA',
    distance: 95,
    riskLevel: 'moderate',
    insuranceAvailability: 'good',
    estimatedPremium: 4850,
    affordabilityIndex: 'low',
    matchScore: 78,
    highlights: [
      'Lower fire risk than LA basin',
      'Multiple insurers available',
      'Coastal climate moderation'
    ]
  },
  {
    zipCode: '93001',
    city: 'Ventura',
    state: 'CA',
    distance: 70,
    riskLevel: 'moderate',
    insuranceAvailability: 'good',
    estimatedPremium: 4250,
    affordabilityIndex: 'medium',
    matchScore: 82,
    highlights: [
      'Coastal location with lower fire risk',
      'More affordable than LA/Santa Barbara',
      'Good insurance options'
    ]
  },
  {
    zipCode: '97701',
    city: 'Bend',
    state: 'OR',
    distance: 840,
    riskLevel: 'moderate',
    insuranceAvailability: 'good',
    estimatedPremium: 3750,
    affordabilityIndex: 'medium',
    matchScore: 75,
    highlights: [
      'Outdoor lifestyle similar to California',
      'Growing tech economy',
      'Better wildfire management'
    ]
  }
];

// Stay or go recommendation
export const stayOrGoRecommendation = {
  recommendation: 'Consider relocating',
  confidence: 80,
  reasonsToStay: [
    'Strong property values despite risk (for now)',
    'Community ties and local amenities',
    'FAIR Plan provides basic coverage'
  ],
  reasonsToGo: [
    'Very high fire risk zone',
    'High non-renewal rate (32%)',
    'Limited insurance options in 5-year outlook',
    'Projected premium increases of 45% over 5 years'
  ]
};
