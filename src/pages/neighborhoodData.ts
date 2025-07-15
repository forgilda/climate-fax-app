// neighborhoodData.ts
// Neighborhood-level data for ClimateFAX

export const neighborhoodData = {
  california: {
    losAngeles: {
      name: 'Los Angeles Area',
      neighborhoods: {
        pacificPalisades: {
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
          riskScore: 92,
          insuranceAvailable: false,
          annualRate: 25000,
          propertyImpact: 22
        },
        venice: {
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
          riskScore: 78,
          insuranceAvailable: false,
          annualRate: 18000,
          propertyImpact: 18
        },
        downtownLA: {
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
          riskScore: 65,
          insuranceAvailable: false,
          annualRate: 12000,
          propertyImpact: 14
        }
      }
    },
    sanFrancisco: {
      name: 'San Francisco Bay Area',
      neighborhoods: {
        marinaDistrict: {
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
          riskScore: 82,
          insuranceAvailable: false,
          annualRate: 22000,
          propertyImpact: 20
        }
      }
    }
  },
  florida: {
    miamiDade: {
      name: 'Miami-Dade County',
      neighborhoods: {
        miamiBeach: {
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
          riskScore: 95,
          insuranceAvailable: false,
          annualRate: 30000,
          propertyImpact: 28
        }
      }
    }
  },
  texas: {
    houston: {
      name: 'Houston Area',
      neighborhoods: {
        memorial: {
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
          riskScore: 86,
          insuranceAvailable: true,
          annualRate: 8500,
          propertyImpact: 12
        }
      }
    }
  },
  colorado: {
    denverBoulder: {
      name: 'Denver-Boulder',
      neighborhoods: {
        boulderCanyon: {
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
          riskScore: 81,
          insuranceAvailable: true,
          annualRate: 6800,
          propertyImpact: 8
        }
      }
    }
  }
}