
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

  // Sample regions with more details - Updated Colorado risks to be more accurate
  const regions = {
    'california': {
      name: 'California', 
      icon: '🏞️',
      majorCities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
      mainRisks: ['wildfires', 'drought', 'earthquakes'],
      safetyIndex: 65,
      insuranceIndex: 35,
      affordabilityIndex: 25
    },
    'colorado': {
      name: 'Colorado', 
      icon: '🏔️',
      majorCities: ['Denver', 'Boulder', 'Colorado Springs'],
      mainRisks: ['wildfires', 'drought', 'landslides'],
      safetyIndex: 80,
      insuranceIndex: 65,
      affordabilityIndex: 45
    },
    'florida': {
      name: 'Florida', 
      icon: '🌴',
      majorCities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
      mainRisks: ['hurricanes', 'flooding', 'seaLevelRise'],
      safetyIndex: 55,
      insuranceIndex: 30,
      affordabilityIndex: 45
    },
    'michigan': {
      name: 'Michigan', 
      icon: '🌊',
      majorCities: ['Grand Rapids'],
      mainRisks: ['winterStorms', 'flooding'],
      safetyIndex: 45,
      insuranceIndex: 85,
      affordabilityIndex: 68
    },
    'nyc': {
      name: 'New York City',
      icon: '🗽',
      majorCities: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'],
      mainRisks: ['flooding', 'hurricanes', 'winterStorms'],
      safetyIndex: 60,
      insuranceIndex: 55,
      affordabilityIndex: 20
    },
    'oregon': {
      name: 'Oregon',
      icon: '🌲',
      majorCities: ['Portland', 'Bend', 'Eugene', 'Salem'],
      mainRisks: ['wildfires', 'earthquakes', 'drought'],
      safetyIndex: 75,
      insuranceIndex: 70,
      affordabilityIndex: 55
    },
    'texas': {
      name: 'Texas', 
      icon: '🤠',
      majorCities: ['Houston', 'Dallas', 'Austin', 'San Antonio'],
      mainRisks: ['hurricanes', 'tornadoes', 'flooding'],
      safetyIndex: 70,
      insuranceIndex: 60,
      affordabilityIndex: 65
    }
  };

  // Alternative locations based on risk profile
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
  
  // Calculate overall risk score (0-100) - Using real NOAA data
  const calculateRiskScore = () => {
    // Use the same real NOAA risk calculation used elsewhere in the app
    return getRegionalRiskFromNOAA(region);
  };
  // Get risk category based on score
  const getRiskCategory = (score) => {
    if (score < 25) return { category: 'Very Low', color: '#4CAF50' };
    if (score < 50) return { category: 'Low', color: '#8BC34A' };
    if (score < 70) return { category: 'Moderate', color: '#FFC107' };
    if (score < 85) return { category: 'High', color: '#FF9800' };
    return { category: 'Very High', color: '#F44336' };
  };
  
  // Calculate property value impact
  const calculatePropertyImpact = () => {
    const neighborhood = getCurrentNeighborhood();
    
    // If we have neighborhood property impact data, use it
    if (neighborhood && neighborhood.propertyImpact) {
      return neighborhood.propertyImpact;
    }
    
    // Otherwise use existing logic
    const baseImpacts = {
      'california': { low: 5, high: 15 },
      'florida': { low: 8, high: 25 },
      'michigan': { low: 2, high: 6 },
      'texas': { low: 3, high: 12 },
      'colorado': { low: 2, high: 8 },
      'nyc': { low: 6, high: 18 },
      'oregon': { low: 3, high: 9 }
    };
    
    let multiplier = 1.0;
    if (model === 'accelerated') multiplier = 1.5;
    if (model === 'mitigation') multiplier = 0.7;
    
    const isHighImpact = 
      (variable === 'wildfires' && region === 'california') ||
      (variable === 'hurricanes' && region === 'florida') ||
      (variable === 'seaLevelRise' && region === 'florida') ||
      (variable === 'flooding' && region === 'florida');
    
    const impact = isHighImpact ? baseImpacts[region].high : baseImpacts[region].low;
    
    return Math.round(impact * multiplier);
  };

  // Get corresponding insurance information - Updated logic
  const getInsuranceInfo = () => {
    const neighborhood = getCurrentNeighborhood();
    
    // If we have neighborhood insurance data, use it
    if (neighborhood && neighborhood.annualRate) {
      const needsFloodInsurance = neighborhood.mainRisks?.includes('flooding') || 
                                  neighborhood.mainRisks?.includes('seaLevelRise');
      
      return {
        available: neighborhood.insuranceAvailable,
        annualRate: neighborhood.annualRate,
        notes: neighborhood.insuranceAvailable ? 
          "Standard insurance coverage available in this area." : 
          "Insurance coverage is unavailable in this high-risk neighborhood.",
        includesFlood: needsFloodInsurance,
        homeValue: 500000 // Base calculation on $500k home
      };
    }
    
    // Fall back to state data if no neighborhood selected
    const isAvailable = insuranceRates[region]?.available || false;
    const rateType = 'regular';
    let rate = insuranceRates[region]?.[rateType] || 2000;
    
    const needsFloodInsurance = variable === 'flooding' || variable === 'seaLevelRise';
    const floodInsuranceCost = needsFloodInsurance ? 2800 : 0;
    
    const homeValue = insuranceRates[region]?.homeValue || 500000;
    
    let notes = "";
    if (!isAvailable) {
      notes = "Insurance coverage is unavailable in this high-risk region.";
    } else if (needsFloodInsurance) {
      notes = "Standard insurance available, with separate flood insurance required.";
    } else {
      notes = "Standard insurance coverage should be available in this area.";
    }
    
    return {
      available: isAvailable,
      annualRate: rate + floodInsuranceCost,
      notes: notes,
      includesFlood: needsFloodInsurance,
      homeValue: homeValue
    };
  };

  // Get alternative locations data
  const getAlternativeLocations = () => {
    return (suggestedLocations[region] || []).map(loc => {
      const regionData = regions[loc];
      return {
        id: loc,
        name: regionData.name,
        icon: regionData.icon,
        safetyIndex: regionData.safetyIndex,
        insuranceIndex: regionData.insuranceIndex,
        affordabilityIndex: regionData.affordabilityIndex,
        mainRisks: regionData.mainRisks.map(risk => ({ 
          name: variables[risk]?.name || risk,
          icon: variables[risk]?.icon || '❓'
        }))
      };
    });
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
          propertyImpact > 15 ? `Significant property value impact (-${propertyImpact}% over 10 years)` : null,
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
          `Reasonable property value projection (-${propertyImpact}% impact over 10 years)`,
          insuranceInfo.available ? "Insurance coverage available" : null
        ].filter(Boolean)
      };
    }
  };
  
  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0];
      const dataKey = dataPoint.dataKey;
      const value = dataPoint.value;
      
      // Format to 2 decimal places
      const formattedValue = Number.isInteger(value) ? 
        value.toString() : 
        value.toFixed(2);
      
      const type = dataKey === 'historicalValue' ? 'Historical' : 'Predicted';
      
      return (
        <div className="p-2 bg-white border rounded shadow-sm">
          <p className="text-sm font-medium">Year: {label}</p>
          <p className="text-sm font-semibold">
            {type}: {formattedValue} {variables[variable]?.unit || ''}
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Toggle locations detail panel
  const toggleLocationDetails = (locationId) => {
    if (selectedLocationDetails === locationId) {
      setSelectedLocationDetails(null);
    } else {
      setSelectedLocationDetails(locationId);
    }
  };

  // Get risk color for visualization
  const getRiskColor = (score) => {
    if (score < 25) return '#4CAF50'; // Very Low - Green
    if (score < 50) return '#8BC34A'; // Low - Light Green
    if (score < 70) return '#FFC107'; // Moderate - Yellow
    if (score < 85) return '#FF9800'; // High - Orange
    return '#F44336'; // Very High - Red
  };

  // Get property impact color - Updated to show negative values in orange/red
  const getPropertyImpactColor = (impact) => {
    if (impact < 5) return '#FF9800'; // Low impact but still negative - Orange
    if (impact < 15) return '#FF9800'; // Moderate impact - Orange
    if (impact < 25) return '#FF9800'; // High impact - Orange
    return '#F44336'; // Very high impact - Red
  };
  
  // Risk score and category
  const riskScore = calculateRiskScore();
  const riskCategory = getRiskCategory(riskScore);
  const propertyImpact = calculatePropertyImpact();
  const insuranceInfo = getInsuranceInfo();
  const recommendation = generateRecommendation();
  const alternativeLocations = getAlternativeLocations();

  // Insurance comparison data
  const insuranceComparisonData = [
    { name: regions[region].name, value: insuranceInfo.annualRate, fill: '#8884d8' },
    ...alternativeLocations.map(loc => ({ 
      name: loc.name, 
      value: insuranceRates[loc.id]?.regular || 2000,
      fill: '#82ca9d'
    }))
  ];

  // Property value impact comparison
  const valueImpactData = [
    { name: regions[region].name, impact: -propertyImpact },
    ...alternativeLocations.map(loc => {
      const baseImpacts = {
        'california': 10,
        'florida': 15,
        'michigan': 4,
        'texas': 8,
        'colorado': 4
      };
      return { name: loc.name, impact: -(baseImpacts[loc.id] || 5) };
    })
  ];

  // Handle category selection
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    // Set the first variable in the selected category
    if (categories[category]) {
      const firstVar = categories[category].variables[0];
      setVariable(firstVar);
    }
  };
  
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
        </div>
      </MobileHeader>

      {/* Feature Tabs with Subscription Status Indicators */}
      <div className="flex items-center mx-auto my-4 max-w-2xl px-4">
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

      <main className="px-4 py-2">
        {/* Risk Assessment Tab */}
        {activeTab === 'riskAssessment' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* 2. REGION SELECTION with improved font */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">Select State</label>
                  <select 
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-medium"
                  >
                    {Object.entries(regions || {}).map(([key, info]) => (
                      <option key={key} value={key}>{info.icon} {info.name}</option>
                    ))}
                  </select>
                </div>
                
                {enhancedRegions[region] && (
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">Select Region</label>
                    <select 
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-medium"
                    >
                      {Object.entries(enhancedRegions[region]?.subRegions || {}).map(([key, area]) => (
                        <option key={key} value={key}>{(area as any).name}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {selectedArea && enhancedRegions[region]?.subRegions[selectedArea] && (
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">Select Neighborhood</label>
                    <select 
                      value={selectedNeighborhood}
                      onChange={(e) => setSelectedNeighborhood(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-medium"
                    >
                      {Object.entries(enhancedRegions[region]?.subRegions?.[selectedArea]?.neighborhoods || {}).map(([key, neighborhood]) => (
                        <option key={key} value={key}>{(neighborhood as any).name} ({(neighborhood as any).zipCode})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              {selectedNeighborhood && enhancedRegions[region]?.subRegions[selectedArea]?.neighborhoods[selectedNeighborhood] && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Selected Location:</span> {enhancedRegions[region].subRegions[selectedArea].neighborhoods[selectedNeighborhood].name}
                    <span className="ml-2">•</span>
                    <span className="ml-2">Elevation: {enhancedRegions[region].subRegions[selectedArea].neighborhoods[selectedNeighborhood].elevation}</span>
                    <span className="ml-2">•</span>
                    <span className="ml-2">FEMA Zone: {enhancedRegions[region].subRegions[selectedArea].neighborhoods[selectedNeighborhood].femaZone}</span>
                  </div>
                  
                  {/* Show recent event if exists */}
                  {enhancedRegions[region].subRegions[selectedArea].neighborhoods[selectedNeighborhood].recentEvent && (
                    <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded">
                      <span className="text-red-800 font-medium">🔴 RECENT EVENT: </span>
                      <span className="text-red-700">
                        {enhancedRegions[region].subRegions[selectedArea].neighborhoods[selectedNeighborhood].recentEvent.description}
                      </span>
                    </div>
                  )}
                  
                  {/* Show flood history if exists */}
                  {enhancedRegions[region].subRegions[selectedArea].neighborhoods[selectedNeighborhood].floodHistory && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-gray-700">Flood History:</span> 
                      <span className="text-gray-600 ml-1">
                        {enhancedRegions[region].subRegions[selectedArea].neighborhoods[selectedNeighborhood].floodHistory}
                      </span>
                    </div>
                  )}
                  
                  {/* Show safe floor recommendation */}
                  {enhancedRegions[region].subRegions[selectedArea].neighborhoods[selectedNeighborhood].safeFloor && (
                    <div className="mt-1 text-sm">
                      <span className="font-medium text-gray-700">Safe Floor:</span> 
                      <span className="text-gray-600 ml-1">
                        {enhancedRegions[region].subRegions[selectedArea].neighborhoods[selectedNeighborhood].safeFloor}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* 4. CLIMATE CATEGORIES BOXES */}
            <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-base font-semibold text-gray-800 mb-2">Select Threat</label>
              <ToggleGroup
                type="single" 
                value={activeCategory} 
                onValueChange={(value) => value && handleCategoryChange(value)}
                className="flex flex-wrap gap-2 justify-between"
              >
                {Object.entries(categories || {}).map(([key, category]) => (
                  <ToggleGroupItem 
                    key={key} 
                    value={key}
                    className="flex-1 min-w-[100px] h-20 px-2 py-2 flex flex-col items-center justify-center gap-1 text-sm border border-gray-300 rounded-md hover:border-blue-500 data-[state=on]:border-blue-600 data-[state=on]:bg-blue-50"
                    aria-label={category.name}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="text-xs font-medium whitespace-normal text-center">{category.name}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <br />
            </div>

            {/* 5. PREDICTION MODEL */}
            <div className="mb-6 mt-8 bg-white p-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {categories[activeCategory]?.name || 'Climate Variable'}
                  </label>
                  <select 
                    value={variable}
                    onChange={(e) => setVariable(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {activeCategory && categories[activeCategory] ? (
                      categories[activeCategory].variables.map((varKey) => (
                        <option key={varKey} value={varKey}>
                          {variables[varKey]?.icon} {variables[varKey]?.name}
                        </option>
                      ))
                    ) : (
                      Object.entries(variables || {}).map(([key, info]) => (
                        <option key={key} value={key}>{info.icon} {info.name}</option>
                      ))
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prediction Model</label>
                  <select 
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="linear">Linear Trend</option>
                    <option value="accelerated">Accelerated Change</option>
                    <option value="mitigation">Mitigation Scenario</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 6. COLORED RISK BAR */}
            <div className="bg-gray-50 p-4 rounded mb-6">
              <div className="h-10 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-lg relative">
                <div 
                  className="absolute top-0 h-full w-1 bg-black" 
                  style={{ left: `${riskScore}%` }}
                >
                  <div className="absolute -top-6 -ml-6 text-sm font-bold w-12 text-center">
                    Risk
                  </div>
                </div>
                <div className="flex justify-between px-4 pt-2">
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                </div>
              </div>
            </div>
            
            {/* 7. DATA VISUALIZATION CHART */}
            {loading ? (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                <p className="mt-2 text-gray-600">Loading climate data...</p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  {regions[region].name} {variables[variable]?.name || variable} ({model.charAt(0).toUpperCase() + model.slice(1)} Model)
                </h2>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        label={{ value: 'Year', position: 'insideBottomRight', offset: 0 }}
                      />
                      <YAxis 
                        domain={[0, 'auto']}
                        label={{ 
                          value: `${variables[variable]?.name || ''} (${variables[variable]?.unit || ''})`, 
                          angle: -90, 
                          position: 'insideLeft',
                          offset: 5,
                          style: { textAnchor: 'middle' }
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="historicalValue" 
                        stroke="#8884d8" 
                        dot={{ r: 1 }}
                        name="Historical" 
                        strokeWidth={2}
                        connectNulls
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predictedValue" 
                        stroke="#ff0000" 
                        dot={{ r: 1 }}
                        name="Predicted" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        connectNulls
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* 8. WILDFIRE METHODOLOGY NOTE if applicable */}
            {variable === 'wildfires' && (
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
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: riskCategory.color }}
                  >
                    {riskScore}
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-semibold" style={{ color: riskCategory.color }}>
                      {riskCategory.category}
                    </div>
                    <div className="text-sm text-gray-500">
                      Risk Level
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Key Risks</h3>
                <div className="flex flex-col">
                  {regions[region].mainRisks.map((risk, index) => (
                    <div key={index} className="flex items-center mb-1">
                      <span className="mr-2">{variables[risk]?.icon || '❓'}</span>
                      <span className="text-sm">{variables[risk]?.name || risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 10. PREMIUM FEATURES BOX */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Premium Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
            
            {/* 11. TRY PREMIUM FREE BOX */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-blue-600 text-xl mr-2">✨</span>
                <h3 className="font-medium text-blue-800">Want More Detailed Analysis?</h3>
              </div>
              <p className="text-sm text-blue-700 mb-3 mt-2">
                Upgrade to Premium for personalized recommendations, cost analysis, and alternative locations.
              </p>
              <button 
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded"
                onClick={() => setCurrentPlan('premium')}
              >
                Try Premium Free for 30 Days
              </button>
            </div>
          </div>
        )}
        
        {/* Stay or Go Tab Content - PREMIUM */}
        {activeTab === 'stayOrGo' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-purple-600 text-xl mr-2">✨</span>
                <h2 className="text-lg font-bold text-purple-800">Sample Premium Feature</h2>
              </div>
              <p className="mt-2 text-purple-700">
                Get insights about the financial impact of climate risk on your property and insurance.
              </p>
            </div>
            
            {/* Insurance Analysis - Moving "Stay or Go Recommendation" to the Alternatives tab */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Projected Insurance - {regions[region].name}
                {selectedNeighborhood && enhancedRegions[region]?.[selectedArea]?.neighborhoods[selectedNeighborhood] && 
                  ` - ${enhancedRegions[region][selectedArea].neighborhoods[selectedNeighborhood].name}`
                }
              </h2>
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Note:</span> Calculations based on a $500,000 home value. 
                  <span className="font-medium">Upgrade to Premium</span> to input your exact home value and get personalized estimates.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">Current Situation</h3>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Availability</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${insuranceInfo.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {insuranceInfo.available ? 'Available' : 'Limited/Unavailable'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Annual Premium</span>
                      <span className="text-sm font-bold">${insuranceInfo.annualRate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Includes Flood Insurance</span>
                      <span className="text-sm">{insuranceInfo.includesFlood ? 'Yes (+$2,800)' : 'No'}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 italic">
                    {insuranceInfo.notes}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">5-Year Insurance Projection</h3>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Estimated Premium Increase</span>
                      <span className="text-sm font-bold text-amber-600">+{model === 'accelerated' ? '65' : (model === 'mitigation' ? '35' : '45')}%</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Projected Annual Cost</span>
                      <span className="text-sm font-bold">
                        ${Math.round(insuranceInfo.annualRate * (1 + (model === 'accelerated' ? 0.65 : (model === 'mitigation' ? 0.35 : 0.45)))).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">5-Year Total Cost</span>
                      <span className="text-sm font-bold">
                        ${Math.round(insuranceInfo.annualRate * 5 * (1 + (model === 'accelerated' ? 0.65 : (model === 'mitigation' ? 0.35 : 0.45)) / 2)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {!insuranceInfo.available && (
                    <div className="bg-red-50 p-3 rounded border border-red-200">
                      <p className="text-sm text-red-700">
                        <strong>Warning:</strong> Insurance may become completely unavailable in this area within 5 years under current projections.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-5">
                <h3 className="font-medium text-gray-700 mb-3">Insurance Cost Comparison</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={insuranceComparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Annual Premium ($)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => ['$' + value.toLocaleString(), 'Annual Premium']} />
                      <Legend />
                      <Bar dataKey="value" name="Annual Premium" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Property Value Impact */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Projected Valuation - {regions[region].name}
                {selectedNeighborhood && enhancedRegions[region]?.[selectedArea]?.neighborhoods[selectedNeighborhood] && 
                  ` - ${enhancedRegions[region][selectedArea].neighborhoods[selectedNeighborhood].name}`
                }
              </h2>
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Note:</span> Projections based on a $500,000 home value. 
                  <span className="font-medium">Upgrade to Premium</span> for analysis based on your actual property value.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">Current Value</h3>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Estimated Home Value</span>
                      <span className="text-lg font-bold">${insuranceInfo.homeValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Location</span>
                      <span className="text-sm">{regions[region].name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">10-Year Valuation Projection</h3>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Climate Impact</span>
                      <span className="text-sm font-bold text-red-600">-{propertyImpact}%</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Value After Climate Impact</span>
                      <span className="text-sm font-bold">
                        ${Math.round(insuranceInfo.homeValue * (1 - propertyImpact/100)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">Potential Loss</span>
                      <span className="text-sm font-bold text-red-600">
                        -${Math.round(insuranceInfo.homeValue * (propertyImpact/100)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {propertyImpact > 15 && (
                    <div className="bg-amber-50 p-3 rounded border border-amber-200">
                      <p className="text-sm text-amber-700">
                        <strong>Note:</strong> This area is projected to see significant property devaluation due to increasing climate risks.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Property Value Impact Comparison</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={valueImpactData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        label={{ value: 'Property Value Impact (%)', angle: -90, position: 'insideLeft' }}
                        domain={[-50, 0]}
                        ticks={[-50, -40, -30, -20, -10, 0]}
                      />
                      <Tooltip formatter={(value) => [value + '%', 'Property Value Loss']} />
                      <Legend />
                      <Bar dataKey="impact" name="Value Loss %" fill="#DC2626">
                        {valueImpactData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.impact < -30 ? '#991B1B' : '#DC2626'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* OPTIONS Tab Content */}
        {activeTab === 'alternatives' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            
            {/* Regional Overview */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Regional Overview: {regions[region].name}</h2>
              
              {/* State Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select State/Region</label>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {Object.entries(regions).map(([key, info]) => (
                    <option key={key} value={key}>{info.icon} {info.name}</option>
                  ))}
                </select>
              </div>
              {/* Area and Neighborhood Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {enhancedRegions[region] && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Area</label>
                    <select 
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      {Object.entries(enhancedRegions[region]?.subRegions || {}).map(([key, area]) => (
                        <option key={key} value={key}>{(area as any).name}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {selectedArea && enhancedRegions[region]?.subRegions[selectedArea] && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Neighborhood</label>
                    <select 
                      value={selectedNeighborhood}
                      onChange={(e) => setSelectedNeighborhood(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      {Object.entries(enhancedRegions[region]?.subRegions?.[selectedArea]?.neighborhoods || {}).map(([key, neighborhood]) => (
                        <option key={key} value={key}>{(neighborhood as any).name} ({(neighborhood as any).zipCode})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              {/* Regional Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Climate Safety Score</h3>
                  <div className="flex items-center">
                    <span className={`text-lg font-semibold ${
                      (getCurrentNeighborhood()?.riskScore ? (100 - getCurrentNeighborhood().riskScore) : (100 - getRegionalRiskFromNOAA(region))) >= 70 ? 'text-green-600' : 
                      (getCurrentNeighborhood()?.riskScore ? (100 - getCurrentNeighborhood().riskScore) : (100 - getRegionalRiskFromNOAA(region))) >= 40 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {getCurrentNeighborhood()?.riskScore ? (100 - getCurrentNeighborhood().riskScore) : (100 - getRegionalRiskFromNOAA(region))}/100
                    </span>
                    <span className="ml-2 text-xs text-gray-500">Higher is safer</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Insurance Availability</h3>
                  <div className="flex items-center">
                    <span className={`text-lg font-semibold ${
                      (getCurrentNeighborhood()?.insuranceScore || (insuranceRates[region]?.available ? 80 : 20)) >= 70 ? 'text-green-600' : 
                      (getCurrentNeighborhood()?.insuranceScore || (insuranceRates[region]?.available ? 80 : 20)) >= 40 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {getCurrentNeighborhood()?.insuranceScore || (insuranceRates[region]?.available ? 80 : 20)}/100
                    </span>
                    <span className="ml-2 text-xs text-gray-500">Higher is better</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Affordability Index</h3>
                  <div className="flex items-center">
                    <span className={`text-lg font-semibold ${
                      (getCurrentNeighborhood()?.affordabilityScore || Math.round(Math.max(20, 100 - getRegionalRiskFromNOAA(region) * 1.5))) >= 70 ? 'text-green-600' : 
                      (getCurrentNeighborhood()?.affordabilityScore || Math.round(Math.max(20, 100 - getRegionalRiskFromNOAA(region) * 1.5))) >= 40 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {getCurrentNeighborhood()?.affordabilityScore || Math.round(Math.max(20, 100 - getRegionalRiskFromNOAA(region) * 1.5))}/100
                    </span>
                    <span className="ml-2 text-xs text-gray-500">Higher is more affordable</span>
                  </div>
                </div>
              </div>
              
              {/* City variation warning box */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center text-yellow-800">
                  <span className="text-xl mr-2">⚠️</span>
                  <div>
                    <h4 className="font-medium">Regional Variation</h4>
                    <p className="text-sm mt-1">Climate risks can vary significantly between cities within {regions[region].name}. Consider neighborhood-level data for precise assessments.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stay or Go Recommendation */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Stay or Go Recommendation</h2>
              <div 
                className="border-2 rounded-lg p-6"
                style={{ borderColor: recommendation.color }}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{recommendation.icon}</span>
                  <div>
                    <h3 
                      className="text-xl font-bold" 
                      style={{ color: recommendation.color }}
                    >
                      {recommendation.recommendation}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Based on climate risk, property value, and insurance analysis
                    </p>
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-700 mb-2">Key Factors:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {recommendation.reasons.map((reason, index) => (
                    <li key={index} className="text-gray-700">{reason}</li>
                  ))}
                </ul>
              </div>
            </div>


            {/* Orange Alternative Locations Comparison */}
            <div className="bg-orange-50 border-l-4 border-orange-400 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-orange-600 text-2xl mr-3">🌍</span>
                <h2 className="text-xl font-bold text-orange-800">Safer Alternative Locations</h2>
              </div>
              <p className="text-orange-700 mb-4">Based on your current location in {regions[region].name}, here are climate-safer alternatives:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alternativeLocations.slice(0, 2).map((location) => (
                  <div 
                    key={location.id} 
                    className="bg-white p-4 rounded-lg border border-orange-200 cursor-pointer hover:border-orange-300 transition-colors"
                    onClick={() => setRegion(location.id)}
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{location.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-800">{location.name}</h3>
                        <p className="text-sm text-gray-600">
                          {regions[location.id].majorCities.slice(0, 2).join(', ')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Safety:</span>
                        <span className={`font-medium ${
                          (100 - getRegionalRiskFromNOAA(location.id)) >= 70 ? 'text-green-600' : 
                          (100 - getRegionalRiskFromNOAA(location.id)) >= 40 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {100 - getRegionalRiskFromNOAA(location.id)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Insurance:</span>
                        <span className={`font-medium ${
                          (insuranceRates[location.id]?.available ? 80 : 20) >= 70 ? 'text-green-600' : 
                          (insuranceRates[location.id]?.available ? 80 : 20) >= 40 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {insuranceRates[location.id]?.available ? 80 : 20}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Affordability:</span>
                        <span className={`font-medium ${
                          Math.max(20, 100 - getRegionalRiskFromNOAA(location.id) * 1.5) >= 70 ? 'text-green-600' : 
                          Math.max(20, 100 - getRegionalRiskFromNOAA(location.id) * 1.5) >= 40 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {Math.round(Math.max(20, 100 - getRegionalRiskFromNOAA(location.id) * 1.5))}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded">
                  View All Alternatives
                </button>
              </div>
            </div>
            
            {/* Premium Features - Coming Soon! */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-purple-600 text-2xl mr-3">✨</span>
                <h2 className="text-xl font-bold text-purple-800">Premium Features - Coming Soon!</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-700 mb-2">🏠 Personalized Relocation Planning</h3>
                  <p className="text-purple-600 text-sm">Custom recommendations based on your family size, work situation, and lifestyle preferences</p>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-700 mb-2">💰 Financial Impact Calculator</h3>
                  <p className="text-purple-600 text-sm">Detailed cost analysis including moving expenses, property values, and long-term savings</p>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-700 mb-2">🔍 Neighborhood-Level Data</h3>
                  <p className="text-purple-600 text-sm">Hyperlocal climate risk assessments down to the zip code level</p>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-700 mb-2">📋 Action Plan Generator</h3>
                  <p className="text-purple-600 text-sm">Step-by-step guides for climate-smart relocation decisions</p>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-700 mb-2">🏥 Healthcare & School Mapping</h3>
                  <p className="text-purple-600 text-sm">Quality ratings and accessibility analysis for medical facilities and educational institutions</p>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-700 mb-2">📊 Real Estate Market Analysis</h3>
                  <p className="text-purple-600 text-sm">Climate-adjusted property value projections and investment potential assessments</p>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-700 mb-2">🚨 Early Warning System</h3>
                  <p className="text-purple-600 text-sm">Personalized alerts for emerging climate risks and evacuation recommendations</p>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-700 mb-2">🤝 Community Connection</h3>
                  <p className="text-purple-600 text-sm">Connect with other climate-conscious families and local support networks</p>
                </div>
              </div>
              
              <div className="text-center">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg">
                  Get Early Access - Coming Soon
                </button>
              </div>
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
