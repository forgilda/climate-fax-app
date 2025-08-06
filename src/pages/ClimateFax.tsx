import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copyright } from "@/components/Copyright";
import { enhancedRegions } from './neighborhoodData';
import { 
  noaaDisasterTimeSeries, 
  noaaStatistics, 
  generateNOAAPredictions, 
  getRegionalRiskFromNOAA,
  type DisasterEvent 
} from '../data/noaaDisasterData';

const ClimateFaxApp = () => {
  
  
  // Main state variables
  const [data, setData] = useState([]);
  const [region, setRegion] = useState('california');
  const [variable, setVariable] = useState('wildfires');
  const [model, setModel] = useState('linear');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('riskAssessment');
  const [activeCategory, setActiveCategory] = useState('heat-fire');
  const [currentPlan, setCurrentPlan] = useState('free'); // 'free' or 'premium'
  const [zipCode, setZipCode] = useState('');
  const [zipCodeResult, setZipCodeResult] = useState(null);
  const [isSearchingZip, setIsSearchingZip] = useState(false);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [userProfile, setUserProfile] = useState({
    healthcareAccess: 'important',
    schoolQuality: 'somewhat',
    lifestylePreference: 'suburban',
    workSituation: 'hybrid',
    homeownerStatus: 'homeowner',
    currentLocation: 'california',
    familySize: '3-4',
    budgetRange: 'medium',
    timeframe: '1-2 years'
  });
  const [selectedLocationDetails, setSelectedLocationDetails] = useState(null);
  
  // Define categories
  const categories = {
    'heat-fire': {
      name: 'Heat & Fire Risks',
      variables: ['wildfires', 'drought', 'heatwaves'],
      icon: '🔥'
    },
    'water': {
      name: 'Water Threats',
      variables: ['flooding', 'atmospheric-rivers', 'landslides'],
      icon: '💧'
    },
    'coastal': {
      name: 'Coastal Hazards',
      variables: ['seaLevelRise', 'tsunamis', 'coastalErosion'],
      icon: '🌊'
    },
    'storm': {
      name: 'Storm Systems',
      variables: ['hurricanes', 'tornadoes', 'winterStorms'],
      icon: '🌪️'
    }
  };
  
  // Variables and their properties
  const variables = {
    'economicLoss': { name: 'Billion-$ Disasters', unit: 'billion USD', icon: '💰' },
    'wildfires': { name: 'Wildfires', unit: 'events', icon: '🔥' },
    'drought': { name: 'Drought Conditions', unit: 'severity index', icon: '🏜️' },
    'heatwaves': { name: 'Heat Waves', unit: 'days/year', icon: '☀️' },
    'flooding': { name: 'Flooding', unit: 'events', icon: '🌊' },
    'atmospheric-rivers': { name: 'Atmospheric Rivers', unit: 'events/year', icon: '☔' },
    'landslides': { name: 'Landslides', unit: 'events', icon: '⛰️' },
    'seaLevelRise': { name: 'Sea Level Rise', unit: 'in', icon: '🌡️' },
    'tsunamis': { name: 'Tsunamis', unit: 'events', icon: '🌊' },
    'coastalErosion': { name: 'Coastal Erosion', unit: 'feet', icon: '🏝️' },
    'hurricanes': { name: 'Hurricanes', unit: 'events', icon: '🌀' },
    'tornadoes': { name: 'Tornadoes', unit: 'events', icon: '🌪️' },
    'winterStorms': { name: 'Winter Storms', unit: 'events', icon: '❄️' }
  };

  // Sample regions with more details - FIXED REALISTIC SAFETY SCORES
  const regions = {
    'california': {
      name: 'California', 
      icon: '🏞️',
      majorCities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
      mainRisks: ['wildfires', 'drought', 'earthquakes'],
      safetyIndex: 45, // High wildfire/earthquake risk
      insuranceIndex: 25, // Very limited availability
      affordabilityIndex: 25,
      cityVariation: 'High: Coastal cities safer from fires, inland cities at higher risk'
    },
    'colorado': {
      name: 'Colorado', 
      icon: '🏔️',
      majorCities: ['Denver', 'Boulder', 'Colorado Springs'],
      mainRisks: ['wildfires', 'drought', 'landslides'],
      safetyIndex: 75, // Generally safer, some wildfire risk
      insuranceIndex: 80,
      affordabilityIndex: 45,
      cityVariation: 'Moderate: Mountain areas higher fire risk, plains areas safer'
    },
    'florida': {
      name: 'Florida', 
      icon: '🌴',
      majorCities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
      mainRisks: ['hurricanes', 'flooding', 'seaLevelRise'],
      safetyIndex: 35, // Major hurricane/flood risk
      insuranceIndex: 20, // Insurance crisis
      affordabilityIndex: 45,
      cityVariation: 'Very High: Miami/coastal extremely high risk, inland somewhat safer'
    },
    'michigan': {
      name: 'Michigan', 
      icon: '🌊',
      majorCities: ['Grand Rapids', 'Detroit', 'Ann Arbor'],
      mainRisks: ['winterStorms', 'flooding'],
      safetyIndex: 80, // Much safer from extreme weather
      insuranceIndex: 85,
      affordabilityIndex: 68,
      cityVariation: 'Low: Most cities relatively safe, some Great Lakes flooding risk'
    },
    'nyc': {
      name: 'New York City',
      icon: '🗽',
      majorCities: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'],
      mainRisks: ['flooding', 'hurricanes', 'winterStorms'],
      safetyIndex: 55, // Hurricane Sandy, flooding risk
      insuranceIndex: 70,
      affordabilityIndex: 20,
      cityVariation: 'High: Lower Manhattan flood risk, higher areas safer'
    },
    'oregon': {
      name: 'Oregon',
      icon: '🌲',
      majorCities: ['Portland', 'Bend', 'Eugene', 'Salem'],
      mainRisks: ['wildfires', 'earthquakes', 'drought'],
      safetyIndex: 65, // Some wildfire/earthquake risk
      insuranceIndex: 75,
      affordabilityIndex: 55,
      cityVariation: 'High: Eastern Oregon fire-prone, western areas earthquake risk'
    },
    'texas': {
      name: 'Texas', 
      icon: '🤠',
      majorCities: ['Houston', 'Dallas', 'Austin', 'San Antonio'],
      mainRisks: ['hurricanes', 'tornadoes', 'flooding'],
      safetyIndex: 40, // Major flood/hurricane/tornado risk
      insuranceIndex: 60,
      affordabilityIndex: 65,
      cityVariation: 'Extreme: Houston/coast very high risk, Austin/inland much safer'
    }
  };

  // Alternative locations based on risk profile - REMOVED as requested by user
  const suggestedLocations = {
    'california': ['oregon', 'michigan'],
    'florida': ['oregon', 'michigan'],
    'texas': ['oregon', 'michigan'],
    'colorado': ['oregon', 'michigan'],
    'nyc': ['oregon', 'michigan'],
    'michigan': ['oregon'],
    'oregon': ['michigan']
  };
  
  // Updated Insurance rate estimates - Reflects difficulties in California and Florida
  const insuranceRates = {
    'california': {
      'regular': 8500,
      'high-risk': 25000,
      'available': false, // Insurance generally unavailable in California
      'homeValue': 500000 // Base home value for calculation
    },
    'florida': {
      'regular': 9200,
      'high-risk': 30000,
      'available': false, // Insurance generally unavailable in Florida
      'homeValue': 500000 // Base home value for calculation
    },
    'texas': {
      'regular': 2500,
      'high-risk': 7500,
      'available': true,
      'homeValue': 500000 // Base home value for calculation
    },
    'colorado': {
      'regular': 2100,
      'high-risk': 6800,
      'available': true,
      'homeValue': 500000 // Base home value for calculation
    },
    'michigan': {
      'regular': 1687,
      'high-risk': 3200,
      'available': true,
      'homeValue': 500000
    },
    'nyc': {
      'regular': 3200,
      'high-risk': 8500,
      'available': true,
      'homeValue': 500000 // Base home value for calculation
    },
    'oregon': {
      'regular': 2400,
      'high-risk': 6200,
      'available': true,
      'homeValue': 500000 // Base home value for calculation
    }
  };

  // ZIP code database - Sample data
  const zipCodeDatabase = {
    '94025': { 
      city: 'Menlo Park', 
      state: 'California',
      region: 'california',
      riskLevel: 'High',
      mainRisks: ['wildfires', 'drought', 'earthquakes'],
      insuranceAvailable: false,
      annualRate: 9800,
      propertyImpact: 18
    },
    '94301': { 
      city: 'Palo Alto', 
      state: 'California',
      region: 'california',
      riskLevel: 'High',
      mainRisks: ['wildfires', 'drought', 'earthquakes'],
      insuranceAvailable: false,
      annualRate: 10200,
      propertyImpact: 17
    },
    '33139': { 
      city: 'Miami Beach', 
      state: 'Florida',
      region: 'florida',
      riskLevel: 'Very High',
      mainRisks: ['hurricanes', 'flooding', 'seaLevelRise'],
      insuranceAvailable: false,
      annualRate: 12500,
      propertyImpact: 25
    },
    '78701': { 
      city: 'Austin', 
      state: 'Texas',
      region: 'texas',
      riskLevel: 'Moderate',
      mainRisks: ['flooding', 'heatwaves'],
      insuranceAvailable: true,
      annualRate: 3200,
      propertyImpact: 8
    },
    '80302': { 
      city: 'Boulder', 
      state: 'Colorado',
      region: 'colorado',
      riskLevel: 'Low',
      mainRisks: ['wildfires', 'drought'],
      insuranceAvailable: true,
      annualRate: 2500,
      propertyImpact: 4
    }
  };
  
  // Handle ZIP code search
  const handleZipSearch = () => {
    if (zipCode.length !== 5 || !/^\d+$/.test(zipCode)) {
      // Invalid ZIP format
      setZipCodeResult({
        error: true,
        message: 'Please enter a valid 5-digit ZIP code'
      });
      return;
    }
    
    setIsSearchingZip(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const result = zipCodeDatabase[zipCode];
      
      if (result) {
        setZipCodeResult({
          error: false,
          data: result
        });
        
        // Update region based on ZIP
        setRegion(result.region);
      } else {
        setZipCodeResult({
          error: true,
          message: 'No data available for this ZIP code. Try 94025, 33139, 78701, or 80302 for demo.'
        });
      }
      
      setIsSearchingZip(false);
    }, 1000);
  };
  
  // Format chart data with two decimal places
  useEffect(() => {
    setLoading(true);
    
    // Use real NOAA data for billion-dollar disasters
    setTimeout(() => {
      const chartData = [];
      
      // Special handling for economic loss variable using real NOAA data
      if (variable === 'economicLoss') {
        // Historical NOAA data (1980-2024)
        noaaDisasterTimeSeries.forEach(event => {
          chartData.push({
            year: event.year,
            historicalValue: event.cost, // Billion dollars
            predictedValue: null,
            events: event.events
          });
        });
        
        // Future predictions based on NOAA trends (2025-2050)
        const predictions = generateNOAAPredictions(26); // 2025-2050
        predictions.forEach(event => {
          chartData.push({
            year: event.year,
            historicalValue: null,
            predictedValue: event.cost,
            events: event.events
          });
        });
      } else {
        // Existing logic for other variables with regional adjustments based on NOAA risk
        const regionalRisk = getRegionalRiskFromNOAA(region);
        const riskMultiplier = regionalRisk / 50; // Normalize to baseline of 50
        
        let lastHistoricalValue = null;
        
        for (let year = 1980; year <= 2050; year++) {
          let value;
          
          if (year <= 2024) {
            // Historical data with NOAA-informed regional risk
            if (variable === 'wildfires') {
              value = (10 + (year - 1980) * 0.8 + Math.sin(year * 0.2) * 8) * riskMultiplier;
            } else if (variable === 'tsunamis' && region === 'texas') {
              value = 0; // Based on NOAA data - no significant tsunamis in TX
            } else if (variable === 'coastalErosion' && region === 'florida') {
              const baseSeaLevelRise = (year - 1980) * 0.12;
              value = 0.8 + (baseSeaLevelRise * 1.8) + (Math.random() * 0.4);
            } else if (variable === 'seaLevelRise' && region === 'florida') {
              value = (year - 1980) * 0.12 + (Math.sin(year * 0.1) * 0.05);
            } else if ((variable === 'seaLevelRise' || variable === 'tsunamis' || variable === 'coastalErosion' || variable === 'hurricanes') && region === 'colorado') {
              value = 0; // Colorado has no coastal issues
            } else {
              value = (5 + (year - 1980) * 0.5 + Math.sin(year * 0.3) * 5) * riskMultiplier;
            }
            
            // Add climate pattern variations
            if (year >= 1998 && year <= 2002) {
              value -= 10 * (1 - Math.abs(year - 2000) / 2) * riskMultiplier;
            }
            
            value = Math.max(0, value);
            value = Number(value.toFixed(2));
            
            if (year === 2024) {
              lastHistoricalValue = value;
            }
            
            chartData.push({
              year,
              historicalValue: value,
              predictedValue: null
            });
          } else {
            // Prediction data with model adjustments
            if (!lastHistoricalValue) lastHistoricalValue = 50 * riskMultiplier;
            
            if (model === 'accelerated') {
              value = lastHistoricalValue * (1 + (year - 2024) * 0.05);
            } else if (model === 'mitigation') {
              value = lastHistoricalValue * (1 + (year - 2024) * 0.01);
            } else {
              value = lastHistoricalValue + (year - 2024) * 2;
            }
            
            // Apply regional risk and constraints
            if (variable === 'tsunamis' && region === 'texas') {
              value = 0;
            } else if ((variable === 'seaLevelRise' || variable === 'tsunamis' || variable === 'coastalErosion' || variable === 'hurricanes') && region === 'colorado') {
              value = 0;
            }
            
            value = Number(value.toFixed(2));
            
            chartData.push({
              year,
              historicalValue: null,
              predictedValue: value
            });
          }
        }
      }
      
      setData(chartData);
      setLoading(false);
    }, 500);
  }, [region, variable, model]);

  useEffect(() => {
    console.log('Region changed to:', region);
    if (region === 'michigan') {
      console.log('Michigan selected! enhancedRegions["michigan"]:', enhancedRegions['michigan']);
      console.log('Michigan subRegions:', enhancedRegions['michigan']?.subRegions);
      console.log('Keys of subRegions:', Object.keys(enhancedRegions['michigan']?.subRegions || {}));
    }
    if (region && enhancedRegions[region]) {
      const areas = Object.keys(enhancedRegions[region].subRegions);
      console.log('Available areas for', region, ':', areas);
      setSelectedArea(areas[0] || '');
      setSelectedNeighborhood('');
    } else {
      console.log('No enhancedRegions data found for:', region);
    }
  }, [region]);

  useEffect(() => {
    if (region && selectedArea && enhancedRegions[region]?.subRegions[selectedArea]) {
      const neighborhoods = Object.keys(enhancedRegions[region].subRegions[selectedArea].neighborhoods);
      setSelectedNeighborhood(neighborhoods[0] || '');
    }
  }, [region, selectedArea]);
  
  const getCurrentNeighborhood = () => {
    if (selectedNeighborhood && enhancedRegions[region]?.subRegions[selectedArea]?.neighborhoods[selectedNeighborhood]) {
      return enhancedRegions[region].subRegions[selectedArea].neighborhoods[selectedNeighborhood];
    }
    return null;
  };
  
  // Calculate overall risk score (0-100) - Fixed to differentiate threats properly
  const calculateRiskScore = () => {
    const neighborhood = getCurrentNeighborhood();
    
    // Use threat-specific calculation instead of generic neighborhood score
    // The old logic returned neighborhood.riskScore here, but that ignored the specific threat
    
    // Threat-specific risk scores by region (from NOAA data and regional studies)
    const threatRiskMatrix = {
      'economicLoss': {
        'california': 75, 'florida': 85, 'texas': 88, 'louisiana': 82,
        'michigan': 38, 'colorado': 52, 'nyc': 65, 'oregon': 45
      },
      'wildfires': {
        'california': 90, 'oregon': 75, 'colorado': 65, 'texas': 45,
        'michigan': 25, 'florida': 35, 'nyc': 10
      },
      'hurricanes': {
        'florida': 95, 'texas': 80, 'nyc': 60, 'california': 15,
        'michigan': 5, 'colorado': 0, 'oregon': 25
      },
      'flooding': {
        'texas': 75, 'florida': 85, 'nyc': 70, 'michigan': 55,
        'california': 45, 'colorado': 35, 'oregon': 50
      },
      'drought': {
        'california': 85, 'texas': 70, 'colorado': 60, 'oregon': 55,
        'florida': 45, 'nyc': 30, 'michigan': 25
      },
      'heatwaves': {
        'texas': 90, 'california': 80, 'florida': 75, 'colorado': 50,
        'nyc': 65, 'oregon': 45, 'michigan': 40
      },
      'winterStorms': {
        'colorado': 80, 'michigan': 75, 'nyc': 70, 'oregon': 45,
        'texas': 35, 'california': 20, 'florida': 5
      },
      'tornadoes': {
        'texas': 85, 'colorado': 60, 'michigan': 50, 'nyc': 25,
        'oregon': 20, 'california': 15, 'florida': 40
      },
      'seaLevelRise': {
        'florida': 95, 'nyc': 80, 'california': 70, 'oregon': 45,
        'texas': 65, 'michigan': 0, 'colorado': 0
      },
      'tsunamis': {
        'california': 65, 'oregon': 70, 'nyc': 25, 'florida': 15,
        'texas': 0, 'michigan': 0, 'colorado': 0
      },
      'coastalErosion': {
        'florida': 90, 'california': 75, 'nyc': 65, 'oregon': 55,
        'texas': 50, 'michigan': 0, 'colorado': 0
      },
      'landslides': {
        'california': 70, 'oregon': 65, 'colorado': 55, 'nyc': 30,
        'texas': 25, 'michigan': 20, 'florida': 15
      },
      'atmospheric-rivers': {
        'california': 80, 'oregon': 85, 'colorado': 25, 'texas': 20,
        'nyc': 30, 'michigan': 15, 'florida': 10
      }
    };
    
    // Get base risk score for this threat-region combination
    let riskScore = threatRiskMatrix[variable]?.[region] || 50;
    
    // Enforce geographic constraints for impossible scenarios
    if ((variable === 'tsunamis' || variable === 'seaLevelRise' || variable === 'coastalErosion') && 
        (region === 'colorado')) {
      riskScore = 0; // Landlocked regions have no coastal risks
    }
    
    if (variable === 'tsunamis' && (region === 'texas' || region === 'michigan')) {
      riskScore = 0; // Gulf of Mexico and Great Lakes have no tsunami risk
    }
    
    if (variable === 'hurricanes' && region === 'colorado') {
      riskScore = 0; // No hurricanes in landlocked mountainous regions
    }
    
    // Apply neighborhood-specific modifiers if available
    if (neighborhood && variable === 'wildfires') {
      if (neighborhood.fireZone === 'Very High Fire Hazard Severity Zone') {
        riskScore = Math.min(95, riskScore + 20);
      }
      else if (neighborhood.elevation && parseInt(neighborhood.elevation) < 50 && neighborhood.name.includes('Venice')) {
        riskScore = Math.max(10, riskScore - 30); // Coastal areas with less wildfire risk
      }
    }
    
    // Apply elevation-based adjustments for coastal risks
    if (neighborhood && (variable === 'seaLevelRise' || variable === 'flooding') && riskScore > 0) {
      const elevation = parseInt(neighborhood.elevation);
      if (elevation < 20) riskScore = Math.min(95, riskScore + 15);
      else if (elevation > 100) riskScore = Math.max(10, riskScore - 15);
    }
    
    // Apply climate model modifier
    const modelModifier = model === 'accelerated' ? 10 : (model === 'mitigation' ? -5 : 0);
    
    return Math.min(95, Math.max(0, riskScore + modelModifier));
  };
  
  // Get risk category based on score
  const getRiskCategory = (score) => {
    if (score >= 85) return 'Very High';
    if (score >= 70) return 'High';
    if (score >= 55) return 'Moderate';
    if (score >= 40) return 'Low';
    return 'Very Low';
  };

  // Calculate property impact (for now, simplified calculation)
  const calculatePropertyImpact = () => {
    const riskScore = calculateRiskScore();
    
    // Base property impact based on risk score
    let impact = (riskScore / 100) * 25; // Up to 25% impact
    
    // Adjust based on region-specific factors
    if (region === 'florida' && ['hurricanes', 'seaLevelRise', 'flooding'].includes(variable)) {
      impact *= 1.3; // Florida coastal properties face higher devaluation
    } else if (region === 'california' && variable === 'wildfires') {
      impact *= 1.2; // California wildfire zones
    }
    
    return Math.min(30, Math.round(impact)); // Cap at 30%
  };

  // Get insurance information
  const getInsuranceInfo = () => {
    const regionInfo = insuranceRates[region];
    if (!regionInfo) return { available: true, annualRate: 3000, includesFlood: false, notes: '' };
    
    const riskScore = calculateRiskScore();
    const isHighRisk = riskScore > 70;
    
    return {
      available: regionInfo.available,
      annualRate: isHighRisk ? regionInfo['high-risk'] : regionInfo.regular,
      includesFlood: ['flooding', 'hurricanes', 'seaLevelRise'].includes(variable),
      notes: regionInfo.available ? 
        (isHighRisk ? 'High-risk premium applied due to elevated climate risks' : 'Standard rates available') :
        'Private insurance largely unavailable; state programs may have limited coverage'
    };
  };

  // Calculate timeline data for alternative chart
  const calculateTimelineData = () => {
    const currentYear = 2024;
    const timelineData = [];
    
    for (let i = 0; i <= 26; i++) { // Next 26 years (2024-2050)
      const year = currentYear + i;
      const baseRisk = calculateRiskScore();
      
      // Risk escalation over time
      let riskIncrease = 0;
      if (model === 'accelerated') {
        riskIncrease = i * 1.5; // Risk increases 1.5 points per year
      } else if (model === 'mitigation') {
        riskIncrease = i * 0.3; // Slower increase with mitigation
      } else {
        riskIncrease = i * 0.8; // Linear baseline increase
      }
      
      const adjustedRisk = Math.min(95, baseRisk + riskIncrease);
      
      timelineData.push({
        year,
        riskScore: Math.round(adjustedRisk),
        propertyImpact: Math.round((adjustedRisk / 100) * 25), // Property impact as % of risk
        insuranceCost: Math.round(getInsuranceInfo().annualRate * (1 + (adjustedRisk / 100)))
      });
    }
    
    return timelineData;
  };

  // Generate stay-or-go recommendation
  const generateRecommendation = () => {
    const riskScore = calculateRiskScore();
    const propertyImpact = calculatePropertyImpact();
    const insuranceInfo = getInsuranceInfo();
    
    // Strong factors that could lead to "Go" recommendation
    const criticalFactors = [
      (!insuranceInfo.available), // No insurance available
      (propertyImpact > 20), // Severe property devaluation
      (riskScore > 85) // Very high risk score
    ];
    
    // Count critical factors
    const criticalCount = criticalFactors.filter(Boolean).length;
    
    // Generate recommendation
    if (criticalCount >= 2) {
      return {
        recommendation: "Consider Relocating",
        color: "#F44336",
        icon: "🚗",
        reasons: [
          !insuranceInfo.available ? "Insurance unavailable or prohibitively expensive" : null,
          propertyImpact > 20 ? `Projected property devaluation of ${propertyImpact}% over 10 years` : null,
          riskScore > 85 ? "Extremely high climate risk score" : null
        ].filter(Boolean)
      };
    } else if (riskScore > 70 || propertyImpact > 15) {
      return {
        recommendation: "Caution",
        color: "#FF9800",
        icon: "⚠️",
        reasons: [
          riskScore > 70 ? "High climate risk in this area" : null,
          propertyImpact > 15 ? `Significant property value impact (${propertyImpact}% over 10 years)` : null,
          insuranceInfo.available ? null : "Limited insurance options"
        ].filter(Boolean)
      };
    } else {
      return {
        recommendation: "Stay & Adapt",
        color: "#4CAF50",
        icon: "🏡",
        reasons: [
          "Manageable climate risk levels",
          `Reasonable property value projection (${propertyImpact}% impact over 10 years)`,
          insuranceInfo.available ? "Insurance remains available" : null
        ].filter(Boolean)
      };
    }
  };

  // Add this helper function to generate chart data
  const generateChartData = () => {
    return data.map(d => ({
      ...d,
      combinedValue: d.historicalValue || d.predictedValue
    }));
  };

  // Generate pie chart data for risk distribution
  const generateRiskDistribution = () => {
    const riskCategories = Object.keys(categories).map(catKey => {
      const category = categories[catKey];
      const avgRisk = category.variables.reduce((sum, variable) => {
        // Temporarily set variable to calculate risk
        const tempVariable = variable;
        // This is a simplified calculation - in a real app you'd want a more robust approach
        return sum + (Math.random() * 30 + 20); // Placeholder calculation
      }, 0) / category.variables.length;
      
      return {
        name: category.name,
        value: Math.round(avgRisk),
        icon: category.icon
      };
    });
    
    return riskCategories;
  };

  // Color mapping for charts
  const getRiskColor = (score) => {
    if (score >= 85) return '#F44336';
    if (score >= 70) return '#FF9800';
    if (score >= 55) return '#FFC107';
    if (score >= 40) return '#8BC34A';
    return '#4CAF50';
  };

  const formatTooltip = (value, name) => {
    if (name === 'historicalValue') return [`${value} ${variables[variable]?.unit || ''}`, 'Historical'];
    if (name === 'predictedValue') return [`${value} ${variables[variable]?.unit || ''}`, 'Predicted'];
    return [`${value}`, name];
  };

  // Risk score and category
  const riskScore = calculateRiskScore();
  const riskCategory = getRiskCategory(riskScore);
  const propertyImpact = calculatePropertyImpact();
  const insuranceInfo = getInsuranceInfo();
  const timelineData = calculateTimelineData();
  const chartData = generateChartData();
  const riskDistribution = generateRiskDistribution();
  
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* 1. LOGO */}
      <MobileHeader title="" showBackButton={true}>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="text-2xl font-bold relative">
            <span className="text-black">Climate</span>
            <span className="text-orange-500">FAX</span>
            <span className="absolute top-0 right-0 -mt-1 -mr-3 text-xs">®</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">Climate Risk Intelligence</p>
        </div>
      </MobileHeader>

      {/* 2. TAB BAR (modified to show premium labels) */}
      <div className="bg-white border-b border-gray-200 px-4 pt-2">
        <div className="flex">
          <div className="flex-1 text-center">
            <div 
              className={`pb-2 ${activeTab === 'riskAssessment' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-600'}`}
              onClick={() => setActiveTab('riskAssessment')}
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-sm font-extrabold tracking-wide uppercase">Know Your Risk</span>
                <span className="mt-1 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full font-medium">Free</span>
              </div>
            </div>
          </div>
          <div className="flex-1 text-center">
            <div 
              className={`pb-2 ${activeTab === 'stayOrGo' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-600'}`}
              onClick={() => setActiveTab('stayOrGo')}
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-sm font-extrabold tracking-wide uppercase">Know Your Cost</span>
                <span className="mt-1 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full font-medium">Premium</span>
              </div>
            </div>
          </div>
          <div className="flex-1 text-center">
            <div 
              className={`pb-2 ${activeTab === 'alternatives' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-600'}`}
              onClick={() => setActiveTab('alternatives')}
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-sm font-extrabold tracking-wide uppercase">Know Your Options</span>
                <span className="mt-1 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full font-medium">Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="px-4 py-2">
        {/* Risk Assessment Tab */}
        {activeTab === 'riskAssessment' && (
          <div className="space-y-4">
            {/* 3. REGION SELECTOR */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              >
                {Object.entries(regions).map(([key, regionData]) => (
                  <option key={key} value={key}>
                    {regionData.icon} {regionData.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. THREAT CATEGORIES */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Climate Threats</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(categories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      activeCategory === key
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <span className="text-lg mr-2">{category.icon}</span>
                      <span className="font-medium text-sm">{category.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. THREAT VARIABLES */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                {categories[activeCategory]?.name} Variables
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {categories[activeCategory]?.variables.map((variableKey) => (
                  <button
                    key={variableKey}
                    onClick={() => setVariable(variableKey)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      variable === variableKey
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{variables[variableKey]?.icon}</span>
                      <div>
                        <div className="font-medium">{variables[variableKey]?.name}</div>
                        <div className="text-sm text-gray-600">Unit: {variables[variableKey]?.unit}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. MODEL SELECTION */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Projection Model</h3>
              <ToggleGroup value={model} onValueChange={setModel} type="single" className="grid grid-cols-3 gap-2">
                <ToggleGroupItem 
                  value="linear" 
                  className="data-[state=on]:bg-blue-500 data-[state=on]:text-white text-sm py-2"
                >
                  Linear
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="accelerated" 
                  className="data-[state=on]:bg-orange-500 data-[state=on]:text-white text-sm py-2"
                >
                  Accelerated
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="mitigation" 
                  className="data-[state=on]:bg-green-500 data-[state=on]:text-white text-sm py-2"
                >
                  Mitigation
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* 7. CHART */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-700">
                  {variables[variable]?.name} Trends - {regions[region]?.name}
                </h3>
                {loading && (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm text-gray-600">Loading...</span>
                  </div>
                )}
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12 }}
                      domain={['dataMin', 'dataMax']}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={formatTooltip}
                      labelStyle={{ color: '#374151' }}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="historicalValue" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Historical"
                      connectNulls={false}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predictedValue" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted"
                      connectNulls={false}
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Model explanation */}
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  <strong>{model.charAt(0).toUpperCase() + model.slice(1)} Model:</strong>{' '}
                  {model === 'linear' && 'Assumes current trends continue at the same rate.'}
                  {model === 'accelerated' && 'Assumes climate impacts will worsen more rapidly due to feedback loops.'}
                  {model === 'mitigation' && 'Assumes successful climate adaptation and mitigation efforts.'}
                </p>
              </div>
            </div>

            {/* Special notes for certain variables */}
            {variable === 'wildfires' && region === 'california' && (
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-yellow-800">Wildfire Methodology Note</h3>
                <p className="text-sm text-yellow-700">
                  This model counts significant wildfires (≥1,000 acres or causing significant damage).
                  California alone experienced over 8,000 total wildfire incidents in 2023, but most were smaller fires.
                </p>
              </div>
            )}
            
            {variable === 'tsunamis' && region === 'texas' && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-blue-800">Texas Tsunami Risk Note</h3>
                <p className="text-sm text-blue-700">
                  Texas has a very low tsunami risk due to the protected nature of the Gulf of Mexico. According to NOAA data, 
                  no significant tsunamis have affected the Texas Gulf Coast in recorded history.
                </p>
              </div>
            )}
            
            {/* 9. RISK SCORE DASHBOARD - MODIFIED TO REMOVE PROPERTY IMPACT AND INSURANCE BOXES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Overall Risk Score</h3>
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mr-4"
                       style={{ backgroundColor: getRiskColor(riskScore) }}>
                    {riskScore}
                  </div>
                  <div>
                    <div className="text-lg font-medium" style={{ color: getRiskColor(riskScore) }}>
                      {riskCategory} Risk
                    </div>
                    <div className="text-sm text-gray-600">
                      {variables[variable]?.name} in {regions[region]?.name}
                    </div>
                  </div>
                </div>
                
                {/* Risk score bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 relative">
                    <div 
                      className="h-2 rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${riskScore}%`, 
                        backgroundColor: getRiskColor(riskScore) 
                      }}
                    ></div>
                    <div 
                      className="absolute top-0 w-2 h-2 bg-white border-2 rounded-full transform -translate-y-0 transition-all duration-500"
                      style={{ 
                        left: `${riskScore}%`, 
                        borderColor: getRiskColor(riskScore) 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low Risk</span>
                    <span>High Risk</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 10. CALL TO ACTION */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-3">
                    <span className="inline-block p-2 bg-orange-100 text-orange-600 rounded-lg mr-3">💵</span>
                    <h3 className="font-medium text-gray-800">Know Your Cost</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Get detailed analysis of how climate risks affect your property value, insurance rates, and long-term costs.
                  </p>
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded"
                    onClick={() => setActiveTab('stayOrGo')}
                  >
                    Learn More
                  </button>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-3">
                    <span className="inline-block p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">🗺️</span>
                    <h3 className="font-medium text-gray-800">Know Your Options</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Discover safer alternative locations based on your lifestyle preferences and priorities.
                  </p>
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded"
                    onClick={() => setActiveTab('alternatives')}
                  >
                    Learn More
                  </button>
                </div>
              </div>

              <button 
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded"
                onClick={() => setCurrentPlan('premium')}
              >
                Try Premium Free for 30 Days
              </button>
            </div>
          </div>
        )}
        
        {/* Stay or Go Tab Content - Redirect to OPTIONS tab */}
        {activeTab === 'stayOrGo' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-blue-600 text-xl mr-2">🗺️</span>
                  <h2 className="text-lg font-bold text-blue-800">Cost Analysis Moved to Know Your Options</h2>
                </div>
              </div>
              <p className="mt-2 text-blue-700 mb-4">
                Stay or Go recommendations and cost analysis are now available in the "Know Your Options" tab for better organization.
              </p>
              <button 
                onClick={() => setActiveTab('alternatives')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Go to Know Your Options →
              </button>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-purple-600 text-xl mr-2">✨</span>
                  <h3 className="text-lg font-bold text-purple-800">Detailed Cost Analysis - Coming Soon!</h3>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                  Premium Feature
                </span>
              </div>
              <p className="text-purple-700 mb-4">
                Advanced financial analysis including property value impacts, insurance projections, and relocation costs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-purple-700">
                    <span className="mr-2">💰</span>
                    <span>Property value impact projections</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <span className="mr-2">🏠</span>
                    <span>Personalized home value analysis</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <span className="mr-2">🛡️</span>
                    <span>Detailed insurance cost modeling</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-purple-700">
                    <span className="mr-2">📊</span>
                    <span>10-year financial projections</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <span className="mr-2">🚛</span>
                    <span>Relocation cost estimates</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <span className="mr-2">⚖️</span>
                    <span>Stay vs. relocate financial comparison</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Alternatives Tab Content - PREMIUM */}
        {activeTab === 'alternatives' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            
            {/* Region Selection - FIRST on the page */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Your Region</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Region: <span className="font-bold text-blue-600">{regions[region]?.name || region}</span> {regions[region]?.icon}
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white z-50 relative"
                  >
                    {Object.entries(regions).map(([key, regionData]) => (
                      <option key={key} value={key}>
                        {regionData.icon} {regionData.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Current Region Info */}
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-medium text-gray-800 mb-3">Region Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Major Cities</h4>
                      <div className="text-sm text-gray-600">
                        {regions[region]?.majorCities?.join(', ') || 'Not available'}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Main Climate Risks</h4>
                      <div className="flex flex-wrap gap-1">
                        {regions[region]?.mainRisks?.map((risk, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            {variables[risk]?.icon || '❓'} {variables[risk]?.name || risk}
                          </span>
                        )) || <span className="text-gray-500 text-sm">Not available</span>}
                      </div>
                    </div>
                  </div>
                  
                  {/* Regional Indices with Clear Explanations */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Regional Quality Indices (0-100 scale)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center bg-gray-50 p-3 rounded-lg">
                        <div className={`text-xl font-bold ${
                          (regions[region]?.safetyIndex || 0) >= 70 ? 'text-green-600' :
                          (regions[region]?.safetyIndex || 0) >= 50 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {regions[region]?.safetyIndex || 'N/A'}
                        </div>
                        <div className="text-xs font-medium text-gray-700">Safety Index</div>
                        <div className="text-xs text-gray-500">Higher = Safer from climate disasters</div>
                      </div>
                      <div className="text-center bg-gray-50 p-3 rounded-lg">
                        <div className={`text-xl font-bold ${
                          (regions[region]?.insuranceIndex || 0) >= 70 ? 'text-green-600' :
                          (regions[region]?.insuranceIndex || 0) >= 50 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {regions[region]?.insuranceIndex || 'N/A'}
                        </div>
                        <div className="text-xs font-medium text-gray-700">Insurance Index</div>
                        <div className="text-xs text-gray-500">Higher = More Available</div>
                      </div>
                      <div className="text-center bg-gray-50 p-3 rounded-lg">
                        <div className={`text-xl font-bold ${
                          (regions[region]?.affordabilityIndex || 0) >= 70 ? 'text-green-600' :
                          (regions[region]?.affordabilityIndex || 0) >= 50 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {regions[region]?.affordabilityIndex || 'N/A'}
                        </div>
                        <div className="text-xs font-medium text-gray-700">Affordability Index</div>
                        <div className="text-xs text-gray-500">Higher = More Affordable</div>
                      </div>
                    </div>
                    
                    {/* City Variation Warning */}
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-start">
                        <span className="text-yellow-600 mr-2">⚠️</span>
                        <div>
                          <h5 className="text-sm font-medium text-yellow-800">Important: Cities Vary Within States</h5>
                          <p className="text-xs text-yellow-700 mt-1">
                            <strong>City Variation:</strong> {regions[region]?.cityVariation || 'Risk levels vary significantly between cities and neighborhoods within this region.'}
                          </p>
                          <p className="text-xs text-yellow-600 mt-2">
                            These are state/regional averages. Individual cities may be much safer or more dangerous than shown here.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stay or Go Recommendation - FIRST */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Recommendation for {regions[region]?.name}</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                {(() => {
                  const recommendation = generateRecommendation();
                  return (
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">{recommendation.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold" style={{ color: recommendation.color }}>
                            {recommendation.recommendation}
                          </h3>
                          <p className="text-sm text-gray-600">Based on current risk analysis for {regions[region]?.name}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {recommendation.reasons.map((reason, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700">
                            <span className="mr-2">•</span>
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Consolidated Premium Features - Coming Soon */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-purple-600 text-xl mr-2">✨</span>
                  <h2 className="text-lg font-bold text-purple-800">Premium Features - Coming Soon!</h2>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                  In Development
                </span>
              </div>
              <p className="text-purple-700 mb-4">
                Get city-specific risk ratings, neighborhood analysis, and advanced climate intelligence tools.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-purple-700">
                    <span className="mr-2">📍</span>
                    <span>ZIP code lookup & block-level risk scoring</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <span className="mr-2">🎯</span>
                    <span>Individual city ratings (not state averages)</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <span className="mr-2">🏘️</span>
                    <span>Neighborhood-level risk assessment</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <span className="mr-2">🗺️</span>
                    <span>Alternative safer locations analysis</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-purple-700">
                    <span className="mr-2">📊</span>
                    <span>Full location reports with historical data</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <span className="mr-2">🔬</span>
                    <span>Advanced research & methodology access</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <span className="mr-2">💰</span>
                    <span>Property value impact projections</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <span className="mr-2">📍</span>
                    <span>Precise ZIP code climate risk analysis</span>
                  </div>
                </div>
              </div>
              
              <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium">
                Get Early Access - Coming Soon
              </button>
            </div>
          </div>
        )}
      </main>
      
      <MobileNav />
      <Copyright />
    </div>
  );
};

export default ClimateFaxApp;
