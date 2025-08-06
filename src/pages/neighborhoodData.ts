// Enhanced location data structure with neighborhood-level granularity
const enhancedRegions = {
  'california': {
    name: 'California',
    icon: '🏞️',
    subRegions: {
      'northernCalifornia': {
        name: 'Northern California',
        neighborhoods: {
          'marina_district': {
            name: 'Marina District',
            zipCode: '94123',
            coordinates: { lat: 37.8027, lng: -122.4364 },
            elevation: '16 feet',
            femaZone: 'AE (High Risk)',
            basementRisk: 'EXTREME',
            safeFloor: '2nd floor minimum',
            mainRisks: ['earthquakes', 'tsunamis', 'liquefaction'],
            liquefactionZone: 'Very High Susceptibility',
            tsunamiEvacuation: 'Move inland past Fillmore St',
            overallRisk: 'HIGH',
            riskScore: 82
          },
          'oakland_hills': {
            name: 'Oakland Hills',
            zipCode: '94611',
            coordinates: { lat: 37.8197, lng: -122.1978 },
            elevation: '1,100 feet',
            femaZone: 'X (Minimal Risk)',
            basementRisk: 'LOW',
            mainRisks: ['wildfires', 'earthquakes', 'landslides'],
            fireZone: 'Very High Fire Hazard Severity Zone',
            lastMajorFire: 'Oakland Firestorm (1991)',
            overallRisk: 'HIGH',
            riskScore: 85
          }
        }
      },
      'southernCalifornia': {
        name: 'Southern California',
        neighborhoods: {
          'pacific_palisades': {
            name: 'Pacific Palisades',
            zipCode: '90272',
            coordinates: { lat: 34.0391, lng: -118.5156 },
            elevation: '125 feet',
            femaZone: 'X (Moderate Risk)',
            basementRisk: 'N/A',
            safeFloor: 'Fire evacuation zone - no safe floor',
            mainRisks: ['wildfires', 'earthquakes', 'mudslides'],
            fireZone: 'Very High Fire Hazard Severity Zone',
            lastMajorFire: 'Palisades Fire (January 2025)',
            floodHistory: null,
            recentEvent: {
              active: true,
              type: 'wildfire',
              date: '2025-01-07',
              severity: 'catastrophic',
              deaths: 9,
              description: 'Jan 2025 - Palisades Fire - 23,700+ acres, thousands of structures destroyed'
            },
            evacuationRoutes: 'PCH, Sunset Blvd',
            overallRisk: 'EXTREME',
            riskScore: 95,
            insuranceAvailable: false,
            annualRate: 35000,
            propertyImpact: 30
          },
          'venice': {
            name: 'Venice',
            zipCode: '90291',
            coordinates: { lat: 33.9850, lng: -118.4695 },
            elevation: '11 feet',
            femaZone: 'AE (High Risk)',
            basementRisk: 'HIGH',
            safeFloor: '2nd floor recommended',
            mainRisks: ['flooding', 'seaLevelRise', 'tsunamis'],
            stormSurge: 'HIGH - Coastal exposure',
            seaLevelProjection: '+2.5 feet by 2050',
            evacuationRoutes: 'Lincoln Blvd, Venice Blvd',
            overallRisk: 'HIGH',
            riskScore: 78
          },
          'downtown': {
            name: 'Downtown LA',
            zipCode: '90012',
            coordinates: { lat: 34.0522, lng: -118.2437 },
            elevation: '285 feet',
            femaZone: 'X (Minimal Risk)',
            basementRisk: 'MODERATE',
            safeFloor: 'Ground floor generally safe',
            mainRisks: ['earthquakes', 'heatwaves', 'flooding'],
            faultDistance: '1.2 miles from Puente Hills Fault',
            heatIslandEffect: 'SEVERE - 10°F higher than suburbs',
            evacuationRoutes: 'I-10, I-110, US-101',
            overallRisk: 'MODERATE',
            riskScore: 65
          },
          'altadena': {
            name: 'Altadena',
            zipCode: '91001',
            coordinates: { lat: 34.1897, lng: -118.1311 },
            elevation: '1,300 feet',
            femaZone: 'X (Moderate Risk)',
            basementRisk: 'N/A',
            safeFloor: 'Fire evacuation zone - no safe floor',
            mainRisks: ['wildfires', 'earthquakes', 'windstorms'],
            fireZone: 'Very High Fire Hazard Severity Zone',
            windRisk: 'Extreme Santa Ana wind exposure',
            lastMajorFire: 'Eaton Fire (January 2025)',
            floodHistory: null,
            recentEvent: {
              active: true,
              type: 'wildfire',
              date: '2025-01-07',
              severity: 'catastrophic',
              deaths: 19,
              description: 'Jan 2025 - Eaton Fire - 14,000+ acres, 9,000+ structures, 5th deadliest CA fire'
            },
            evacuationWarning: 'West Altadena received alerts hours after East Altadena',
            overallRisk: 'EXTREME',
            riskScore: 96,
            insuranceAvailable: false,
            annualRate: 40000,
            propertyImpact: 35
          }
        }
      }
    }
  },
  'florida': {
    name: 'Florida',
    icon: '🌴',
    subRegions: {
      'southeastFlorida': {
        name: 'Southeast Florida',
        neighborhoods: {
          'miamiBeach': {
            name: 'Miami Beach',
            zipCode: '33139',
            coordinates: { lat: 25.7907, lng: -80.1300 },
            elevation: '4 feet',
            femaZone: 'VE (Velocity Zone)',
            basementRisk: 'EXTREME',
            safeFloor: '3rd floor minimum',
            mainRisks: ['hurricanes', 'flooding', 'seaLevelRise'],
            stormSurge: 'EXTREME - 10+ feet possible',
            kingTideFlooding: 'Monthly occurrence',
            overallRisk: 'EXTREME',
            riskScore: 95
          },
          'homestead': {
            name: 'Homestead',
            zipCode: '33030',
            coordinates: { lat: 25.4687, lng: -80.4776 },
            elevation: '6 feet',
            femaZone: 'AE (High Risk)',
            basementRisk: 'HIGH',
            mainRisks: ['hurricanes', 'flooding', 'tornadoes'],
            hurricaneHistory: 'Direct hit - Andrew (1992)',
            overallRisk: 'HIGH',
            riskScore: 88
          }
        }
      },
      'gulfCoast': {
        name: 'Gulf Coast',
        neighborhoods: {
          'fortMyers': {
            name: 'Fort Myers',
            zipCode: '33901',
            coordinates: { lat: 26.6406, lng: -81.8723 },
            elevation: '10 feet',
            femaZone: 'AE (High Risk)',
            basementRisk: 'EXTREME',
            safeFloor: '2nd floor minimum',
            mainRisks: ['hurricanes', 'flooding', 'tornadoes'],
            stormSurge: 'HIGH - Gulf exposure',
            evacuationRoutes: 'I-75 inland',
            floodHistory: 'Ian (2022), Helene (2024), Milton (2024)',
            recentEvent: {
              active: false,
              type: 'hurricane',
              date: '2024-10-09',
              severity: 'major',
              description: 'Oct 2024 - Hurricane Milton damage after Sept 2024 Helene'
            },
            repeatVictim: true,
            overallRisk: 'EXTREME',
            riskScore: 93,
            insuranceAvailable: false,
            annualRate: 28000,
            propertyImpact: 32
          },
          'fortMyersBeach': {
            name: 'Fort Myers Beach',
            zipCode: '33931',
            coordinates: { lat: 26.4520, lng: -81.9481 },
            elevation: '4 feet',
            femaZone: 'VE (Velocity Zone)',
            basementRisk: 'EXTREME',
            safeFloor: 'Evacuate - barrier island',
            mainRisks: ['hurricanes', 'flooding', 'seaLevelRise'],
            stormSurge: 'EXTREME - Direct Gulf exposure',
            barrierIsland: true,
            floodHistory: 'Ian (2022), Helene (2024), Milton (2024) - 5 hurricanes in 2 years',
            recentEvent: {
              active: false,
              type: 'hurricane',
              date: '2024-10-09',
              severity: 'catastrophic',
              description: 'Oct 2024 - Hurricane Milton, 5th hurricane in 2 years'
            },
            repeatVictim: true,
            overallRisk: 'EXTREME',
            riskScore: 96,
            insuranceAvailable: false,
            annualRate: 35000,
            propertyImpact: 40
          }
        }
      },
      'tampaBay': {
        name: 'Tampa Bay Area',
        neighborhoods: {
          'tampa': {
            name: 'Tampa',
            zipCode: '33602',
            coordinates: { lat: 27.9506, lng: -82.4572 },
            elevation: '48 feet',
            femaZone: 'AE (High Risk)',
            basementRisk: 'HIGH',
            safeFloor: '2nd floor recommended',
            mainRisks: ['hurricanes', 'flooding', 'lightning'],
            stormSurge: 'HIGH - Tampa Bay funnel effect',
            lightningCapital: 'Highest strike density in US',
            floodHistory: 'Multiple hurricanes, dodged direct Milton hit',
            overallRisk: 'HIGH',
            riskScore: 84,
            insuranceAvailable: false,
            annualRate: 15000,
            propertyImpact: 20
          }
        }
      }
    }
  },
  'texas': {
    name: 'Texas',
    icon: '🤠',
    subRegions: {
      'houston': {
        name: 'Houston Area',
        neighborhoods: {
          'memorial': {
            name: 'Memorial',
            zipCode: '77024',
            coordinates: { lat: 29.7752, lng: -95.5517 },
            elevation: '75 feet',
            femaZone: 'AE (High Risk)',
            basementRisk: 'EXTREME',
            mainRisks: ['hurricanes', 'flooding', 'tornadoes'],
            floodHistory: 'Harvey (2017), Tax Day (2016)',
            bayouProximity: 'Adjacent to Buffalo Bayou',
            overallRisk: 'HIGH',
            riskScore: 86
          },
          'clear_lake': {
            name: 'Clear Lake',
            zipCode: '77058',
            coordinates: { lat: 29.5452, lng: -95.0892 },
            elevation: '23 feet',
            femaZone: 'VE (Velocity Zone)',
            basementRisk: 'EXTREME',
            mainRisks: ['hurricanes', 'flooding', 'chemical'],
            stormSurge: 'EXTREME - Galveston Bay exposure',
            industrialRisk: 'HIGH - Petrochemical facilities',
            overallRisk: 'EXTREME',
            riskScore: 91
          }
        }
      },
      'hillCountry': {
        name: 'Hill Country',
        neighborhoods: {
          'kerrville': {
            name: 'Kerrville',
            zipCode: '78028',
            coordinates: { lat: 30.0474, lng: -99.1403 },
            elevation: '1,645 feet',
            femaZone: 'AE (High Risk)',
            basementRisk: 'EXTREME',
            safeFloor: '2nd floor minimum',
            mainRisks: ['flooding', 'winterStorms', 'drought'],
            riverProximity: 'Guadalupe River runs through town',
            floodHistory: 'July 2025 (135 dead), Oct 1998 (31 dead), July 1987 (10 dead)',
            recentEvent: {
              active: true,
              type: 'flooding',
              date: '2025-07-04',
              severity: 'catastrophic',
              deaths: 135,
              description: 'July 2025 - 2nd deadliest flood in Texas history (1st: Galveston 1900 - 6,000+ dead)'
            },
            overallRisk: 'EXTREME',
            riskScore: 95,
            insuranceAvailable: false,
            annualRate: 35000,
            propertyImpact: 35
          },
          'hunt': {
            name: 'Hunt',
            zipCode: '78024',
            coordinates: { lat: 30.0702, lng: -99.3342 },
            elevation: '1,850 feet',
            femaZone: 'VE (Velocity Zone)',
            basementRisk: 'EXTREME',
            safeFloor: '3rd floor minimum',
            mainRisks: ['flooding', 'flashFloods'],
            riverProximity: 'Camp Mystic on Guadalupe River',
            floodHistory: 'Multiple summer camp tragedies',
            recentEvent: {
              active: true,
              type: 'flooding',
              date: '2025-07-04',
              severity: 'catastrophic',
              deaths: 27,
              description: 'July 2025 - Camp Mystic - 27 campers and counselors died'
            },
            overallRisk: 'EXTREME',
            riskScore: 98,
            insuranceAvailable: false,
            annualRate: 40000,
            propertyImpact: 40
          }
        }
      },
      'austin': {
        name: 'Austin Area',
        neighborhoods: {
          'onion_creek': {
            name: 'Onion Creek',
            zipCode: '78744',
            coordinates: { lat: 30.1663, lng: -97.7844 },
            elevation: '550 feet',
            femaZone: 'AE (High Risk)',
            basementRisk: 'HIGH',
            mainRisks: ['flooding', 'wildfires', 'drought'],
            flashFloodAlley: 'Central Texas Flash Flood Alley',
            overallRisk: 'HIGH',
            riskScore: 79
          }
        }
      }
    }
  },
  'colorado': {
    name: 'Colorado',
    icon: '🏔️',
    subRegions: {
      'denver_boulder': {
        name: 'Denver-Boulder',
        neighborhoods: {
          'boulder_canyon': {
            name: 'Boulder Canyon',
            zipCode: '80302',
            coordinates: { lat: 40.0150, lng: -105.2705 },
            elevation: '5,430 feet',
            femaZone: 'X (Moderate Risk)',
            basementRisk: 'HIGH',
            mainRisks: ['wildfires', 'flooding', 'mudslides'],
            floodHistory: '2013 Front Range Floods',
            fireZone: 'Wildland-Urban Interface',
            overallRisk: 'HIGH',
            riskScore: 81
          },
          'denver_downtown': {
            name: 'Downtown Denver',
            zipCode: '80202',
            coordinates: { lat: 39.7392, lng: -104.9903 },
            elevation: '5,280 feet',
            femaZone: 'X (Minimal Risk)',
            basementRisk: 'LOW',
            mainRisks: ['hailstorms', 'tornadoes', 'drought'],
            hailAlley: 'Most damaging hail in US',
            overallRisk: 'MODERATE',
            riskScore: 62
          }
        }
      }
    }
  },
  'nyc': {
    name: 'New York City',
    icon: '🗽',
    subRegions: {
      'manhattan': {
        name: 'Manhattan',
        neighborhoods: {
          'lowerManhattan': {
            name: 'Lower Manhattan',
            zipCode: '10004',
            coordinates: { lat: 40.7074, lng: -74.0113 },
            elevation: '6 feet',
            femaZone: 'AE (High Risk)',
            basementRisk: 'EXTREME',
            safeFloor: '3rd floor or higher',
            subwayLines: 'R, W, 1, 4, 5, 6',
            subwayRisk: 'VERY HIGH - Multiple underground lines',
            drainageSystem: 'Combined sewer (1800s era)',
            nearestWater: 'East River (0.2 mi), Hudson River (0.3 mi)',
            mainRisks: ['flooding', 'hurricanes', 'seaLevelRise'],
            floodHistory: 'Sandy (2012), Ida (2021), July 2025',
            recentEvent: {
              active: true,
              type: 'flooding',
              date: '2025-07-16',
              severity: 'major',
              description: 'July 2025 - 2nd highest rainfall in NYC history - subway flooding'
            },
            overallRisk: 'HIGH',
            riskScore: 78,
            insuranceAvailable: true,
            annualRate: 8500,
            propertyImpact: 18
          },
          'upperEastSide': {
            name: 'Upper East Side',
            zipCode: '10021',
            coordinates: { lat: 40.7736, lng: -73.9566 },
            elevation: '66 feet',
            femaZone: 'X (Moderate Risk)',
            basementRisk: 'MODERATE',
            safeFloor: '2nd floor recommended',
            subwayLines: '4, 5, 6, Q',
            subwayRisk: 'MODERATE - Deep stations',
            mainRisks: ['flooding', 'hurricanes'],
            overallRisk: 'MODERATE',
            riskScore: 55,
            insuranceAvailable: true,
            annualRate: 5500,
            propertyImpact: 10
          }
        }
      },
      'queens': {
        name: 'Queens',
        neighborhoods: {
          'richmondHill': {
            name: 'Richmond Hill',
            zipCode: '11418',
            coordinates: { lat: 40.7009, lng: -73.8370 },
            elevation: '78 feet',
            femaZone: 'X (Moderate Risk)',
            basementRisk: 'MODERATE',
            safeFloor: '2nd floor recommended',
            subwayLines: 'J, Z (elevated)',
            subwayRisk: 'LOW - Elevated stations',
            mainRisks: ['flooding', 'winterStorms'],
            recentEvent: {
              active: true,
              type: 'flooding',
              date: '2025-07-16',
              severity: 'moderate',
              description: 'July 2025 - Street flooding from record rainfall'
            },
            overallRisk: 'MODERATE',
            riskScore: 52,
            insuranceAvailable: true,
            annualRate: 4500,
            propertyImpact: 8
          }
        }
      },
      'brooklyn': {
        name: 'Brooklyn',
        neighborhoods: {
          'redHook': {
            name: 'Red Hook',
            zipCode: '11231',
            coordinates: { lat: 40.6743, lng: -74.0120 },
            elevation: '8 feet',
            femaZone: 'AE (High Risk)',
            basementRisk: 'EXTREME',
            safeFloor: '2nd floor minimum',
            subwayLines: 'Limited - Bus connections only',
            nearestWater: 'NY Harbor (waterfront)',
            mainRisks: ['flooding', 'hurricanes', 'seaLevelRise'],
            stormSurge: 'EXTREME - Direct harbor exposure',
            floodHistory: 'Sandy (2012) devastated area',
            recentEvent: {
              active: true,
              type: 'flooding',
              date: '2025-07-16',
              severity: 'major',
              description: 'July 2025 - Waterfront flooding from record rainfall'
            },
            overallRisk: 'EXTREME',
            riskScore: 87,
            insuranceAvailable: false,
            annualRate: 12000,
            propertyImpact: 25
          }
        }
      },
      'bronx': {
        name: 'Bronx',
        neighborhoods: {
          'huntsPoint': {
            name: 'Hunts Point',
            zipCode: '10474',
            coordinates: { lat: 40.8074, lng: -73.8826 },
            elevation: '15 feet',
            femaZone: 'AE (High Risk)',
            basementRisk: 'HIGH',
            safeFloor: '2nd floor recommended',
            subwayLines: '6 (elevated section)',
            mainRisks: ['flooding', 'hurricanes'],
            industrialArea: true,
            drainageSystem: 'Combined sewer (industrial area)',
            nearestWater: 'East River, Bronx River confluence',
            recentEvent: {
              active: true,
              type: 'flooding',
              date: '2025-07-16',
              severity: 'moderate',
              description: 'July 2025 - Cross Bronx Expressway closed from flooding'
            },
            overallRisk: 'HIGH',
            riskScore: 74,
            insuranceAvailable: true,
            annualRate: 7000,
            propertyImpact: 15
          }
        }
      },
      'statenIsland': {
        name: 'Staten Island',
        neighborhoods: {
          'southShore': {
            name: 'South Shore',
            zipCode: '10307',
            coordinates: { lat: 40.5150, lng: -74.2384 },
            elevation: '12 feet',
            femaZone: 'VE (Velocity Zone)',
            basementRisk: 'EXTREME',
            safeFloor: '2nd floor minimum, 3rd preferred',
            mainRisks: ['hurricanes', 'flooding', 'winterStorms'],
            evacuationRoutes: 'Verrazzano Bridge (only route off island)',
            stormSurge: 'EXTREME - Direct ocean exposure',
            floodHistory: 'Sandy (2012) catastrophic damage',
            recentEvent: {
              active: true,
              type: 'flooding',
              date: '2025-07-16',
              severity: 'major',
              description: 'July 2025 - 4-6 inches rain, Staten Island Railway suspended'
            },
            overallRisk: 'EXTREME',
            riskScore: 91,
            insuranceAvailable: false,
            annualRate: 15000,
            propertyImpact: 28
          }
        }
      }
    },
    michigan: {
      westMichigan: {
        name: 'West Michigan',
        neighborhoods: {
          grand_rapids: {
            name: 'Grand Rapids',
            zipCode: '49503',
            coordinates: { lat: 42.9634, lng: -85.6681 },
            elevation: '640 feet',
            femaZone: 'X (Moderate Risk)',
            basementRisk: 'MODERATE',
            safeFloor: 'Ground floor generally safe',
            mainRisks: ['winterStorms', 'flooding'],
            floodHistory: 'Grand River 2013 - major flooding',
            overallRisk: 'MODERATE',
            riskScore: 48,
            insuranceAvailable: true,
            annualRate: 1700,
            propertyImpact: 5
          }
        }
      }
    },
    oregon: {
      centralOregon: {
        name: 'Central Oregon',
        neighborhoods: {
          bend: {
            name: 'Bend',
            zipCode: '97701',
            coordinates: { lat: 44.0582, lng: -121.3153 },
            elevation: '3,623 feet',
            femaZone: 'X (Minimal Risk)',
            basementRisk: 'LOW',
            safeFloor: 'Ground floor generally safe',
            mainRisks: ['wildfires', 'drought', 'winterStorms'],
            fireZone: 'Moderate - Defensible space important',
            snowfall: '33 inches annually',
            evacuationRoutes: 'US-97, US-20',
            overallRisk: 'MODERATE',
            riskScore: 58,
            insuranceAvailable: true,
            annualRate: 3200,
            propertyImpact: 6
          }
        }
      }
    }
  }
};

// Helper function to get all neighborhoods for a state/region
function getAllNeighborhoods(stateKey: string) {
  const state = enhancedRegions[stateKey as keyof typeof enhancedRegions];
  if (!state) return [];
  
  const neighborhoods: any[] = [];
  Object.entries(state.subRegions).forEach(([subRegionKey, subRegion]) => {
    Object.entries(subRegion.neighborhoods).forEach(([neighborhoodKey, neighborhood]) => {
      neighborhoods.push({
        key: neighborhoodKey,
        stateKey: stateKey,
        subRegionKey: subRegionKey,
        ...(neighborhood as Record<string, any>)
      });
    });
  });
  
  return neighborhoods;
}

// Export for use in your components
export { enhancedRegions, getAllNeighborhoods };

// Keep legacy export for backward compatibility
export const neighborhoodData = enhancedRegions;