// Enhanced location data structure with neighborhood-level granularity
const enhancedRegions = {
  'california': {
    name: 'California',
    icon: '🏞️',
    subRegions: {
      'los_angeles': {
        name: 'Los Angeles',
        neighborhoods: {
          'pacific_palisades': {
            name: 'Pacific Palisades',
            zipCode: '90272',
            coordinates: { lat: 34.0391, lng: -118.5156 },
            elevation: '125 feet',
            femaZone: 'X (Moderate Risk)',
            basementRisk: 'LOW',
            safeFloor: 'Ground floor acceptable',
            mainRisks: ['wildfires', 'earthquakes', 'mudslides'],
            fireZone: 'Very High Fire Hazard Severity Zone',
            lastMajorFire: 'Woolsey Fire (2018)',
            evacuationRoutes: 'PCH, Sunset Blvd',
            overallRisk: 'EXTREME',
            riskScore: 92
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
          }
        }
      },
      'san_francisco': {
        name: 'San Francisco Bay Area',
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
      }
    }
  },
  'florida': {
    name: 'Florida',
    icon: '🌴',
    subRegions: {
      'miami_dade': {
        name: 'Miami-Dade County',
        neighborhoods: {
          'miami_beach': {
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
      'tampa_bay': {
        name: 'Tampa Bay Area',
        neighborhoods: {
          'downtown_tampa': {
            name: 'Downtown Tampa',
            zipCode: '33602',
            coordinates: { lat: 27.9506, lng: -82.4572 },
            elevation: '48 feet',
            femaZone: 'AE (High Risk)',
            basementRisk: 'HIGH',
            mainRisks: ['hurricanes', 'flooding', 'lightning'],
            stormSurge: 'HIGH - Tampa Bay funnel effect',
            lightningCapital: 'Highest strike density in US',
            overallRisk: 'HIGH',
            riskScore: 84
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
          'lower_manhattan': {
            name: 'Lower Manhattan (Financial District)',
            zipCode: '10004',
            coordinates: { lat: 40.7074, lng: -74.0113 },
            elevation: '6 feet',
            femaZone: 'AE (High Risk)',
            basementRisk: 'EXTREME',
            safeFloor: '3rd floor or higher',
            subwayLines: 'R, W, 1, 4, 5, 6',
            subwayRisk: 'VERY HIGH - Multiple underground lines',
            altTransport: 'Ferry, Bus, Walking',
            evacuationRoutes: 'Brooklyn Bridge, Manhattan Bridge',
            powerGrid: 'Underground (ConEd Grid 27)',
            outageProbability: 'LOW (Protected infrastructure)',
            drainageSystem: 'Combined sewer (1800s era)',
            emergencyAccess: 'Good - Multiple hospitals nearby',
            nearestWater: 'East River (0.2 miles), Hudson River (0.3 miles)',
            stormSurge: 'HIGH - Sea level location',
            permeability: 'POOR - 85% paved surfaces',
            floodFrequency: '3-4 events per decade',
            overallRisk: 'HIGH',
            riskScore: 78
          },
          'upper_east_side': {
            name: 'Upper East Side',
            zipCode: '10021',
            coordinates: { lat: 40.7736, lng: -73.9566 },
            elevation: '66 feet',
            femaZone: 'X (Moderate Risk)',
            basementRisk: 'MODERATE',
            mainRisks: ['flooding', 'power outages'],
            subwayRisk: 'MODERATE - Deep stations',
            overallRisk: 'MODERATE',
            riskScore: 55
          }
        }
      },
      'queens': {
        name: 'Queens',
        neighborhoods: {
          'queens_richmond_hill': {
            name: 'Queens - Richmond Hill',
            zipCode: '11418',
            coordinates: { lat: 40.7009, lng: -73.8370 },
            elevation: '78 feet',
            femaZone: 'X (Moderate Risk)',
            basementRisk: 'MODERATE',
            safeFloor: '2nd floor recommended',
            subwayLines: 'J, Z (elevated)',
            subwayRisk: 'LOW - Elevated stations',
            overallRisk: 'MODERATE',
            riskScore: 52
          }
        }
      },
      'brooklyn': {
        name: 'Brooklyn',
        neighborhoods: {
          'brooklyn_red_hook': {
            name: 'Brooklyn - Red Hook',
            zipCode: '11231',
            coordinates: { lat: 40.6743, lng: -74.0120 },
            elevation: '8 feet',
            femaZone: 'AE (High Risk)',
            basementRisk: 'EXTREME',
            stormSurge: 'EXTREME - Direct harbor exposure',
            overallRisk: 'EXTREME',
            riskScore: 87
          }
        }
      },
      'bronx': {
        name: 'Bronx',
        neighborhoods: {
          'bronx_hunts_point': {
            name: 'Bronx - Hunts Point',
            zipCode: '10474',
            coordinates: { lat: 40.8074, lng: -73.8826 },
            elevation: '15 feet',
            femaZone: 'AE (High Risk)',
            basementRisk: 'HIGH',
            overallRisk: 'HIGH',
            riskScore: 74
          }
        }
      },
      'staten_island': {
        name: 'Staten Island',
        neighborhoods: {
          'staten_island_south': {
            name: 'Staten Island - South Shore',
            zipCode: '10307',
            coordinates: { lat: 40.5150, lng: -74.2384 },
            elevation: '12 feet',
            femaZone: 'VE (Very High Risk - Velocity Zone)',
            basementRisk: 'EXTREME',
            stormSurge: 'EXTREME - Direct ocean exposure',
            overallRisk: 'EXTREME',
            riskScore: 91
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