
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
    'florida': {
      name: 'Florida', 
      icon: '🌴',
      majorCities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
      mainRisks: ['hurricanes', 'flooding', 'seaLevelRise'],
      safetyIndex: 55,
      insuranceIndex: 30,
      affordabilityIndex: 45
    },
    'texas': {
      name: 'Texas', 
      icon: '🤠',
      majorCities: ['Houston', 'Dallas', 'Austin', 'San Antonio'],
      mainRisks: ['hurricanes', 'tornadoes', 'flooding'],
      safetyIndex: 70,
      insuranceIndex: 60,
      affordabilityIndex: 65
    },
    'colorado': {
      name: 'Colorado', 
      icon: '🏔️',
      majorCities: ['Denver', 'Boulder', 'Colorado Springs'],
      mainRisks: ['wildfires', 'drought', 'landslides'],
      safetyIndex: 80,
      insuranceIndex: 65,
      affordabilityIndex: 45
    }
  };

  // Alternative locations based on risk profile
  const suggestedLocations = {
    'california': ['colorado'],
    'florida': ['colorado'],
    'texas': ['colorado']
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
    
    // Simulate API call for data
    setTimeout(() => {
      const chartData = [];
      
      // Last historical value (to ensure smooth transition)
      let lastHistoricalValue = null;
      
      // Generate sample data
      for (let year = 1980; year <= 2050; year++) {
        let value;
        
        if (year <= 2024) {
          // Historical data (before 2025)
          if (variable === 'wildfires') {
            value = 10 + (year - 1980) * 0.8 + Math.sin(year * 0.2) * 8;
          } else if (variable === 'tsunamis' && region === 'texas') {
            value = 0; // Based on NOAA data - no significant tsunamis in TX
          } else if (variable === 'coastalErosion' && region === 'florida') {
            // Florida coastal erosion correlates with sea level rise
            const baseSeaLevelRise = (year - 1980) * 0.12; // inches per year
            value = 0.8 + (baseSeaLevelRise * 1.8) + (Math.random() * 0.4);
          } else if (variable === 'seaLevelRise' && region === 'florida') {
            // Consistent sea level rise for Florida (higher than average)
            value = (year - 1980) * 0.12 + (Math.sin(year * 0.1) * 0.05);
          } else if ((variable === 'seaLevelRise' || variable === 'tsunamis' || variable === 'coastalErosion' || variable === 'hurricanes') && region === 'colorado') {
            // Colorado has no coastal issues or hurricanes
            value = 0;
          } else {
            value = 5 + (year - 1980) * 0.5 + Math.sin(year * 0.3) * 5;
          }
          
          // Add a dip around 2000 to show climate patterns
          if (year >= 1998 && year <= 2002) {
            value -= 10 * (1 - Math.abs(year - 2000) / 2);
          }
          
          value = Math.max(0, value);
          
          // Format to 2 decimal places for display
          value = Number(value.toFixed(2));
          
          // Store last historical value to ensure smooth transition
          if (year === 2024) {
            lastHistoricalValue = value;
          }
          
          chartData.push({
            year,
            historicalValue: value,
            predictedValue: null
          });
        } else {
          // Prediction data (2025 and beyond)
          if (!lastHistoricalValue) lastHistoricalValue = 50; // Fallback
          
          // Different models
          if (model === 'accelerated') {
            value = lastHistoricalValue * (1 + (year - 2024) * 0.05);
          } else if (model === 'mitigation') {
            value = lastHistoricalValue * (1 + (year - 2024) * 0.01);
          } else {
            value = lastHistoricalValue + (year - 2024) * 2;
          }
          
          // Special cases
          if (variable === 'tsunamis' && region === 'texas') {
            value = 0; // Virtually no tsunami risk in Texas
          } else if (variable === 'coastalErosion' && region === 'florida') {
            // Florida coastal erosion follows sea level rise pattern (accelerated)
            const baseSeaLevelRise = (year - 2024) * 0.15; // Accelerating inches per year
            value = lastHistoricalValue + (baseSeaLevelRise * 1.8) + (Math.random() * 0.2);
          } else if (variable === 'seaLevelRise' && region === 'florida') {
            // Sea level rise acceleration for Florida
            const yearsInFuture = year - 2024;
            value = lastHistoricalValue * (1 + (yearsInFuture * 0.02));
          } else if ((variable === 'seaLevelRise' || variable === 'tsunamis' || variable === 'coastalErosion' || variable === 'hurricanes') && region === 'colorado') {
            // Colorado has no coastal issues or hurricanes - even in prediction
            value = 0;
          }
          
          // Format to 2 decimal places for display
          value = Number(value.toFixed(2));
          
          chartData.push({
            year,
            historicalValue: null,
            predictedValue: value
          });
        }
      }
      
      setData(chartData);
      setLoading(false);
    }, 500);
  }, [region, variable, model]);

  useEffect(() => {
    if (region && enhancedRegions[region]) {
      const areas = Object.keys(enhancedRegions[region].subRegions);
      setSelectedArea(areas[0] || '');
      setSelectedNeighborhood('');
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
  
  // Calculate overall risk score (0-100)
  const calculateRiskScore = () => {
    const neighborhood = getCurrentNeighborhood();
    
    // If neighborhood has specific risk score for this variable, use it
    if (neighborhood && neighborhood.riskScore && variable === 'wildfires' && neighborhood.mainRisks.includes('wildfires')) {
      return Math.min(95, neighborhood.riskScore);
    }
    
    // Otherwise use regional historical data
    const baseScores = {
      'california': 65,
      'florida': 70,
      'texas': 60,
      'colorado': 50
    };
    
    let riskModifier = 0;
    
    // Winter storms - based on NOAA data
    if (variable === 'winterStorms') {
      if (region === 'texas') riskModifier = 15; // 1 catastrophic event per ~20 years
      else if (region === 'colorado') riskModifier = 15; // Boulder gets 50+ inches snow/year
      else if (region === 'florida') riskModifier = -30; // Near zero occurrence
      else if (region === 'california') riskModifier = -25; // Rare except mountains
    }
    
    // Wildfire - based on CAL FIRE and local fire dept data
    if (neighborhood && variable === 'wildfires') {
      if (neighborhood.fireZone === 'Very High Fire Hazard Severity Zone') {
        riskModifier = 30; // Official CAL FIRE designation
      }
      else if (neighborhood.elevation && parseInt(neighborhood.elevation) < 50 && neighborhood.name.includes('Venice')) {
        riskModifier = -40; // Coastal, no wildland interface per CAL FIRE maps
      }
      else if (neighborhood.mainRisks.includes('wildfires')) {
        riskModifier = 25;
      }
    }
    else if (variable === 'wildfires' && region === 'california') riskModifier = 20;
    else if (variable === 'hurricanes' && region === 'florida') riskModifier = 20;
    else if (variable === 'flooding' && (region === 'texas' || region === 'florida')) riskModifier = 15;
    else if (variable === 'seaLevelRise' && region === 'florida') riskModifier = 25;
    
    // Elevation adjustment for coastal risks
    if (neighborhood && (variable === 'seaLevelRise' || variable === 'flooding')) {
      const elevation = parseInt(neighborhood.elevation);
      if (elevation < 20) riskModifier += 20;
      else if (elevation > 100) riskModifier -= 20;
    }
    
    const modelModifier = model === 'accelerated' ? 10 : (model === 'mitigation' ? -5 : 0);
    
    return Math.min(95, Math.max(0, baseScores[region] + riskModifier + modelModifier));
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
      'texas': { low: 3, high: 12 },
      'colorado': { low: 2, high: 8 }
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
    if (neighborhood) {
      return {
        available: neighborhood.insuranceAvailable,
        annualRate: neighborhood.annualRate,
        notes: neighborhood.insuranceAvailable ? 
          "Standard insurance coverage should be available in this area." : 
          "Insurance coverage is unavailable in this high-risk neighborhood.",
        includesFlood: neighborhood.mainRisks.includes('flooding') || neighborhood.mainRisks.includes('seaLevelRise'),
        homeValue: insuranceRates[region]?.homeValue || 500000
      };
    }
    
    // Fall back to existing logic if no neighborhood data
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
    { name: regions[region].name, impact: propertyImpact },
    ...alternativeLocations.map(loc => {
      const baseImpacts = {
        'california': 10,
        'florida': 15,
        'texas': 8,
        'colorado': 4
      };
      return { name: loc.name, impact: baseImpacts[loc.id] || 5 };
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
                    <label className="block text-base font-semibold text-gray-800 mb-2">Select Area</label>
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
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Insurance Analysis</h2>
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
                  <h3 className="font-medium text-gray-700 mb-3">5-Year Projection</h3>
                  
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
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Property Value Impact</h2>
              
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
                  <h3 className="font-medium text-gray-700 mb-3">10-Year Projection</h3>
                  
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
                      <YAxis label={{ value: 'Value Impact (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => ['-' + value + '%', 'Property Value Impact']} />
                      <Legend />
                      <Bar dataKey="impact" name="Value Impact %" fill="#FF9800" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Alternatives Tab Content - PREMIUM */}
        {activeTab === 'alternatives' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-purple-600 text-xl mr-2">✨</span>
                <h2 className="text-lg font-bold text-purple-800">Sample Premium Feature</h2>
              </div>
              <p className="mt-2 text-purple-700">
                Discover safer alternative locations based on your lifestyle preferences and priorities.
              </p>
            </div>
            
            {/* ZIP Code Lookup Section - NEW SECTION */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">ZIP Code Lookup</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row gap-3 mb-4">
                  <div className="flex-1">
                    <label htmlFor="zip-code" className="block text-sm font-medium text-gray-700 mb-1">
                      Enter 5-digit ZIP Code
                    </label>
                    <div className="flex">
                      <Input
                        id="zip-code"
                        type="text"
                        placeholder="e.g. 94025"
                        maxLength={5}
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value.replace(/[^0-9]/g, ''))}
                        className="rounded-r-none"
                      />
                      <Button 
                        onClick={handleZipSearch}
                        disabled={isSearchingZip || zipCode.length !== 5}
                        className="rounded-l-none"
                      >
                        {isSearchingZip ? 
                          <span className="flex items-center">
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Searching...
                          </span> : 'Search'}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Try 94025, 33139, 78701, or 80302 for demo
                    </p>
                  </div>
                </div>

                {zipCodeResult && (
                  <div className="mt-4">
                    {zipCodeResult.error ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700 text-sm">{zipCodeResult.message}</p>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg">
                        <div className="bg-gray-100 p-3 border-b border-gray-200 rounded-t-lg">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{zipCodeResult.data.city}, {zipCodeResult.data.state}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              zipCodeResult.data.riskLevel === 'Very High' ? 'bg-red-100 text-red-800' :
                              zipCodeResult.data.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                              zipCodeResult.data.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {zipCodeResult.data.riskLevel} Risk
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Climate Risks</h4>
                              <div className="space-y-1">
                                {zipCodeResult.data.mainRisks.map((risk, index) => (
                                  <div key={index} className="flex items-center">
                                    <span className="mr-2">{variables[risk]?.icon || '❓'}</span>
                                    <span className="text-sm">{variables[risk]?.name || risk}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Insurance & Property Impact</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Insurance Available:</span>
                                  <span className={`text-sm font-medium ${zipCodeResult.data.insuranceAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                    {zipCodeResult.data.insuranceAvailable ? 'Yes' : 'Limited/No'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Annual Premium:</span>
                                  <span className="text-sm font-medium">${zipCodeResult.data.annualRate.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">10-Year Property Impact:</span>
                                  <span className="text-sm font-medium text-red-600">-{zipCodeResult.data.propertyImpact}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end mt-2">
                            <Button variant="outline" className="mr-2">View Details</Button>
                            <Button
                              onClick={() => setRegion(zipCodeResult.data.region)}
                            >
                              Set as Region
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* MOVED - Stay or Go Recommendation now appears here on the Alternatives tab */}
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
            
            {/* Alternative Locations */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Alternative Locations</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Your Preferences</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Lifestyle</span>
                    <span className="capitalize">{userProfile.lifestylePreference}</span>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Work Situation</span>
                    <span className="capitalize">{userProfile.workSituation}</span>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Family Size</span>
                    <span>{userProfile.familySize}</span>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Budget</span>
                    <span className="capitalize">{userProfile.budgetRange}</span>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Healthcare</span>
                    <span className="capitalize">{userProfile.healthcareAccess}</span>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Schools</span>
                    <span className="capitalize">{userProfile.schoolQuality}</span>
                  </div>
                </div>
                
                <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded w-full md:w-auto">
                  Update Preferences
                </button>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Recommended Alternatives to {regions[region].name}</h3>
                
                {alternativeLocations.length > 0 ? (
                  <div className="space-y-4">
                    {alternativeLocations.map((location) => (
                      <div 
                        key={location.id} 
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div 
                          className="flex items-center justify-between p-4 cursor-pointer"
                          onClick={() => toggleLocationDetails(location.id)}
                        >
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{location.icon}</span>
                            <div>
                              <h4 className="font-medium">{location.name}</h4>
                              <div className="flex space-x-1 text-xs text-gray-500 mt-1">
                                {location.mainRisks.slice(0, 2).map((risk, i) => (
                                  <span key={i} className="flex items-center">
                                    {risk.icon} {risk.name}
                                    {i < Math.min(location.mainRisks.length - 1, 1) && <span className="mx-1">•</span>}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="hidden md:block">
                              <div className="flex space-x-2 items-center">
                                <div className="text-center">
                                  <div className="text-xs text-gray-500">Safety</div>
                                  <div className="mt-1 bg-gray-200 w-20 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full" style={{width: `${location.safetyIndex}%`}}></div>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-gray-500">Insurance</div>
                                  <div className="mt-1 bg-gray-200 w-20 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full" style={{width: `${location.insuranceIndex}%`}}></div>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-gray-500">Affordability</div>
                                  <div className="mt-1 bg-gray-200 w-20 h-2 rounded-full overflow-hidden">
                                    <div className="bg-purple-500 h-full" style={{width: `${location.affordabilityIndex}%`}}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded">
                                Compare
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {selectedLocationDetails === location.id && (
                          <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">Climate Risk Profile</h5>
                                <ul className="space-y-1">
                                  {location.mainRisks.map((risk, i) => (
                                    <li key={i} className="flex items-center text-sm">
                                      <span className="mr-2">{risk.icon}</span>
                                      {risk.name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">Key Metrics</h5>
                                <div className="space-y-2">
                                  <div>
                                    <div className="flex justify-between text-sm">
                                      <span>Climate Safety</span>
                                      <span className="font-medium">{location.safetyIndex}/100</span>
                                    </div>
                                    <Progress value={location.safetyIndex} className="h-2" />
                                  </div>
                                  <div>
                                    <div className="flex justify-between text-sm">
                                      <span>Insurance Availability</span>
                                      <span className="font-medium">{location.insuranceIndex}/100</span>
                                    </div>
                                    <Progress value={location.insuranceIndex} className="h-2" />
                                  </div>
                                  <div>
                                    <div className="flex justify-between text-sm">
                                      <span>Affordability</span>
                                      <span className="font-medium">{location.affordabilityIndex}/100</span>
                                    </div>
                                    <Progress value={location.affordabilityIndex} className="h-2" />
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">Major Cities</h5>
                                <div className="flex flex-wrap gap-2">
                                  {regions[location.id].majorCities.map((city, i) => (
                                    <span 
                                      key={i}
                                      className="px-2 py-1 bg-white border border-gray-200 rounded-full text-sm"
                                    >
                                      {city}
                                    </span>
                                  ))}
                                </div>
                                <div className="mt-4">
                                  <button className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
                                    Full Location Report
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center text-yellow-800">
                      <span className="text-xl mr-2">⚠️</span>
                      <p>No alternative locations found for your criteria. Try adjusting your preferences.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Your Moving Timeline */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Moving Timeline</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-3">Current Timeframe: {userProfile.timeframe}</h3>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                    <h4 className="ml-3 font-medium">Research Phase</h4>
                  </div>
                  <div className="pl-11">
                    <p className="text-sm text-gray-600 mb-2">
                      Explore alternative locations and evaluate climate risks.
                    </p>
                    <Alert variant="outline" className="mb-2">
                      <AlertTitle className="text-sm font-medium">Next Step</AlertTitle>
                      <AlertDescription className="text-xs">
                        Compare insurance and property value projections across locations.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-sm font-bold">2</div>
                    <h4 className="ml-3 font-medium text-gray-600">Planning Phase</h4>
                  </div>
                  <div className="pl-11">
                    <p className="text-sm text-gray-500">
                      Financial planning, property research, and timeline development.
                    </p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-sm font-bold">3</div>
                    <h4 className="ml-3 font-medium text-gray-600">Execution Phase</h4>
                  </div>
                  <div className="pl-11">
                    <p className="text-sm text-gray-500">
                      Selling current property, purchasing new home, and relocating.
                    </p>
                  </div>
                </div>
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
