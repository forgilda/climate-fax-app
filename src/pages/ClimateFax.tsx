
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

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
      variables: ['hurricanes', 'tornadoes', 'thunderstorms'],
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
    'thunderstorms': { name: 'Thunderstorms', unit: 'events', icon: '⛈️' }
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
  
  // Calculate overall risk score (0-100)
  const calculateRiskScore = () => {
    // Base factors per region
    const baseScores = {
      'california': 65,
      'florida': 70,
      'texas': 60,
      'colorado': 50
    };
    
    // Get the appropriate risk based on selected variable
    let riskModifier = 0;
    
    if (variable === 'wildfires' && region === 'california') riskModifier = 15;
    else if (variable === 'hurricanes' && region === 'florida') riskModifier = 20;
    else if (variable === 'flooding' && (region === 'texas' || region === 'florida')) riskModifier = 15;
    else if (variable === 'tsunamis' && region === 'texas') riskModifier = -20; // Very low risk
    else if (variable === 'seaLevelRise' && region === 'florida') riskModifier = 25;
    else if ((variable === 'seaLevelRise' || variable === 'tsunamis' || variable === 'coastalErosion' || variable === 'hurricanes') && region === 'colorado') riskModifier = -30; // No risk for these in Colorado
    else riskModifier = 5;
    
    // Risk level based on prediction model
    const modelModifier = model === 'accelerated' ? 10 : (model === 'mitigation' ? -5 : 0);
    
    // Calculate total score (capped at 0-100)
    const score = Math.min(100, Math.max(0, baseScores[region] + riskModifier + modelModifier));
    
    return score;
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
    // Base impact factors (percentage decline in 10 years)
    const baseImpacts = {
      'california': { low: 5, high: 15 },
      'florida': { low: 8, high: 25 },
      'texas': { low: 3, high: 12 },
      'colorado': { low: 2, high: 8 }
    };
    
    // Apply model modifiers
    let multiplier = 1.0;
    if (model === 'accelerated') multiplier = 1.5;
    if (model === 'mitigation') multiplier = 0.7;
    
    // Determine if this location is high impact for the selected variable
    const isHighImpact = 
      (variable === 'wildfires' && region === 'california') ||
      (variable === 'hurricanes' && region === 'florida') ||
      (variable === 'seaLevelRise' && region === 'florida') ||
      (variable === 'flooding' && region === 'florida');
    
    // Calculate range of impact
    const impact = isHighImpact ? baseImpacts[region].high : baseImpacts[region].low;
    
    return Math.round(impact * multiplier);
  };

  // Add address state
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  
  const [addressAnalyzed, setAddressAnalyzed] = useState(false);
  
  // Handle address change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle address analysis
  const handleAddressAnalysis = () => {
    setAddressAnalyzed(true);
  };

  // Get corresponding insurance information - Updated logic
  const getInsuranceInfo = () => {
    // Insurance availability is primarily determined by region
    const isAvailable = insuranceRates[region]?.available || false;
    
    // Base rate based on region and risk level
    const rateType = 'regular'; // In updated logic, risk level doesn't change rate, only region determines availability
    let rate = insuranceRates[region]?.[rateType] || 2000;
    
    // Add flood insurance if applicable (separate policy)
    const needsFloodInsurance = variable === 'flooding' || variable === 'seaLevelRise';
    const floodInsuranceCost = needsFloodInsurance ? 2800 : 0;
    
    // Home value used for calculation
    const homeValue = insuranceRates[region]?.homeValue || 500000;
    
    // Insurance notes based on availability
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
              <label className="block text-base font-semibold text-gray-800 mb-2">Select Your Region</label>
              <select 
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-medium"
              >
                {Object.entries(regions).map(([key, info]) => (
                  <option key={key} value={key}>{info.icon} {info.name}</option>
                ))}
              </select>
            </div>
            
            {/* 4. CLIMATE CATEGORIES BOXES */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
              <ToggleGroup 
                type="single" 
                value={activeCategory} 
                onValueChange={(value) => value && handleCategoryChange(value)}
                className="flex flex-wrap gap-2 justify-between"
              >
                {Object.entries(categories).map(([key, category]) => (
                  <ToggleGroupItem 
                    key={key} 
                    value={key}
                    className="flex-1 min-w-[100px] px-2 py-2 flex flex-col items-center justify-center gap-1 text-sm"
                    aria-label={category.name}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="text-xs font-medium whitespace-normal text-center">{category.name}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* 5. PREDICTION MODEL */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Climate Variable</label>
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
                      Object.entries(variables).map(([key, info]) => (
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
              <Alert className="mb-6">
                <AlertTitle>Methodology Note</AlertTitle>
                <AlertDescription>
                  Wildfire data is based on historical fire events exceeding 1,000 acres. Future projections account for climate changes, fuel availability, and historical trends.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Stay or Go Tab - Premium Feature */}
        {activeTab === 'stayOrGo' && (
          <div className="space-y-6">
            {currentPlan === 'premium' ? (
              <div>
                {/* Premium features would go here */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-2">Property Risk Analysis</h2>
                  <p className="text-sm text-gray-600 mb-4">Review how climate risk factors impact your property value and insurance.</p>
                  
                  {/* Premium feature content */}
                </div>
                
                {/* Address Analysis Feature */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-2">Specific Address Analysis</h2>
                  <p className="text-sm text-gray-600 mb-4">Get detailed climate risk assessment for a specific property address.</p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <Input
                        id="street"
                        name="street"
                        value={address.street}
                        onChange={handleAddressChange}
                        placeholder="123 Main St"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <Input
                          id="city"
                          name="city"
                          value={address.city}
                          onChange={handleAddressChange}
                          placeholder="San Francisco"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <Input
                          id="state"
                          name="state"
                          value={address.state}
                          onChange={handleAddressChange}
                          placeholder="CA"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={address.zipCode}
                        onChange={handleAddressChange}
                        placeholder="94105"
                      />
                    </div>
                    
                    <button
                      onClick={handleAddressAnalysis}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                    >
                      Analyze Address
                    </button>
                  </div>
                  
                  {addressAnalyzed && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold mb-2">Address Risk Assessment</h3>
                      <p className="text-sm">
                        <span className="font-medium">Property:</span> {address.street}, {address.city}, {address.state} {address.zipCode}
                      </p>
                      <div className="mt-3 space-y-2">
                        <div>
                          <span className="text-sm font-medium">Wildfire Risk:</span>
                          <Progress value={75} className="h-2 mt-1" />
                        </div>
                        <div>
                          <span className="text-sm font-medium">Flood Risk:</span>
                          <Progress value={30} className="h-2 mt-1" />
                        </div>
                        <div>
                          <span className="text-sm font-medium">Drought Impact:</span>
                          <Progress value={60} className="h-2 mt-1" />
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-700">This property has an elevated wildfire risk and moderate drought impact. Consider additional insurance coverage and property hardening measures.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 text-purple-500 rounded-full mx-auto flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2">Premium Feature</h2>
                <p className="text-gray-600 mb-4">Unlock our property risk assessment to see how climate risks affect your property value and insurance rates.</p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition duration-150">
                  Upgrade to Premium
                </button>
              </div>
            )}
          </div>
        )}

        {/* Alternatives Tab - Another Premium Feature */}
        {activeTab === 'alternatives' && (
          <div className="space-y-6">
            {currentPlan === 'premium' ? (
              <div>
                {/* Premium alternatives content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Alternative Locations</h2>
                  {/* Alternatives content would go here */}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 text-purple-500 rounded-full mx-auto flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2">Premium Feature</h2>
                <p className="text-gray-600 mb-4">Discover lower-risk alternative locations based on your preferences and climate projections.</p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition duration-150">
                  Upgrade to Premium
                </button>
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Bottom Navigation */}
      <MobileNav />
    </div>
  );
};

export default ClimateFaxApp;
