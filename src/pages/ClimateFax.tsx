
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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

  // Sample regions with more details
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
      mainRisks: ['wildfires', 'drought', 'flooding'],
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
  
  // Insurance rate estimates (per year) - Updated to reflect difficulty in California and Florida
  const insuranceRates = {
    'california': {
      'regular': 8500,
      'high-risk': 25000
    },
    'florida': {
      'regular': 9200,
      'high-risk': 30000
    },
    'texas': {
      'regular': 2500,
      'high-risk': 7500
    },
    'colorado': {
      'regular': 2100,
      'high-risk': 6800
    }
  };
  
  // Generate data when variables change
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
          } else {
            value = 5 + (year - 1980) * 0.5 + Math.sin(year * 0.3) * 5;
          }
          
          // Add a dip around 2000 to show climate patterns
          if (year >= 1998 && year <= 2002) {
            value -= 10 * (1 - Math.abs(year - 2000) / 2);
          }
          
          value = Math.max(0, value);
          
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
          }
          
          chartData.push({
            year,
            historicalValue: null,
            predictedValue: Math.max(0, value)
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

  // Get corresponding insurance information
  const getInsuranceInfo = () => {
    // Determine if this area is high risk for the selected variable
    const isHighRisk = 
      (variable === 'wildfires' && region === 'california') ||
      (variable === 'hurricanes' && region === 'florida') ||
      (variable === 'seaLevelRise' && region === 'florida') ||
      (variable === 'flooding' && region === 'texas');
    
    // Special case for California and Florida - nearly impossible to insure
    const isNearlyUninsurable = 
      (region === 'california' && (variable === 'wildfires' || variable === 'drought')) ||
      (region === 'florida' && (variable === 'hurricanes' || variable === 'seaLevelRise'));
    
    const rateType = isHighRisk ? 'high-risk' : 'regular';
    let rate = insuranceRates[region]?.[rateType] || 2000;
    
    // Apply additional surcharge for nearly uninsurable areas
    if (isNearlyUninsurable) {
      rate = rate * 2; // 100% surcharge for these high-risk areas
    }
    
    // Insurance availability
    const notAvailable = 
      (region === 'california' && variable === 'wildfires') ||
      (region === 'california' && variable === 'drought') ||
      (region === 'florida' && variable === 'hurricanes') ||
      (region === 'florida' && variable === 'seaLevelRise');
    
    return {
      available: !notAvailable,
      annualRate: rate,
      notes: notAvailable ? 
        "Insurance coverage is unavailable in this high-risk area." : 
        (isHighRisk ? 
          "This area has extremely limited insurance availability and very high premiums due to elevated risk." : 
          "Standard insurance coverage should be available in this area.")
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
            className={`pb-2 ${activeTab === 'riskAssessment' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('riskAssessment')}
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm font-medium">Know Your Risk</span>
              <span className="mt-1 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Free</span>
            </div>
          </div>
        </div>
        <div className="flex-1 text-center">
          <div 
            className={`pb-2 ${activeTab === 'stayOrGo' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('stayOrGo')}
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm font-medium">Know Your Cost</span>
              <span className="mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">Premium</span>
            </div>
          </div>
        </div>
        <div className="flex-1 text-center">
          <div 
            className={`pb-2 ${activeTab === 'alternatives' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('alternatives')}
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-sm font-medium">Know Your Options</span>
              <span className="mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">Premium</span>
            </div>
          </div>
        </div>
      </div>

      <main className="px-4 py-2">
        {/* Region Selection - Moved to top as requested */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
          <select 
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(regions).map(([key, info]) => (
              <option key={key} value={key}>{info.icon} {info.name}</option>
            ))}
          </select>
        </div>
        
        {/* Climate Category Selection */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Climate Risk Categories</h3>
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

        {/* Variable and Model Selection */}
        <div className="grid grid-cols-1 gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
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
        
        {/* Risk Assessment Tab */}
        {activeTab === 'riskAssessment' && (
          <div>
            {/* Risk Score Dashboard */}
            <div className="grid grid-cols-1 gap-4 mb-6">
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
                <h3 className="text-lg font-medium text-gray-700 mb-2">Property Value Impact</h3>
                <div className="flex items-center">
                  <div className="text-2xl font-bold" style={{ color: propertyImpact > 15 ? '#F44336' : '#4CAF50' }}>
                    -{propertyImpact}%
                  </div>
                  <div className="ml-4 text-sm text-gray-500">
                    Projected 10-year impact
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Insurance Availability</h3>
                <div className="flex items-center">
                  <div 
                    className={`text-white font-bold px-2 py-1 rounded ${insuranceInfo.available ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    {insuranceInfo.available ? 'Available' : 'Unavailable'}
                  </div>
                  <div className="ml-3 text-gray-700">
                    ${insuranceInfo.annualRate}/year
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">{insuranceInfo.notes}</div>
              </div>
            </div>

            {/* Historical/Predicted Data Chart */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Historical and Predicted Data</h3>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="historicalValue" 
                        name="Historical" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predictedValue" 
                        name="Predicted" 
                        stroke="#82ca9d" 
                        strokeDasharray="5 5"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="text-center mt-4 text-sm text-gray-500">
                <div className="font-medium">
                  {variables[variable]?.name || variable} in {regions[region]?.name || region}
                </div>
                <div>
                  Historical data (1980-2024) and predictions (2025-2050) based on {
                    model === 'linear' ? 'linear trends' : 
                    model === 'accelerated' ? 'accelerated change scenarios' : 
                    'mitigation efforts scenarios'
                  }
                </div>
              </div>
            </div>

            {/* Stay or Go Recommendation */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Recommendation for {regions[region]?.name || region}
              </h3>
              <div className="flex items-start mt-4">
                <div 
                  className="flex items-center justify-center rounded-full w-12 h-12 text-xl flex-shrink-0"
                  style={{ backgroundColor: recommendation.color, color: 'white' }}
                >
                  {recommendation.icon}
                </div>
                <div className="ml-4">
                  <div className="text-lg font-semibold" style={{ color: recommendation.color }}>
                    {recommendation.recommendation}
                  </div>
                  <ul className="text-sm text-gray-600 list-disc pl-5 mt-1">
                    {recommendation.reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Cost Analysis Tab */}
        {activeTab === 'stayOrGo' && (
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Insurance Cost Analysis</h3>
              <p className="text-sm text-gray-600 mb-4">
                Annual premium estimates for homeowners insurance in your selected region.
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={insuranceComparisonData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Annual Premium']} />
                    <Legend />
                    <Bar dataKey="value" name="Annual Premium ($)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Property Value Impact</h3>
              <p className="text-sm text-gray-600 mb-4">
                Projected property value impact over 10 years due to climate risks.
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={valueImpactData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Value Decrease']} />
                    <Legend />
                    <Bar dataKey="impact" name="Value Decrease (%)" fill="#FF9800" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
        {/* Alternative Locations Tab */}
        {activeTab === 'alternatives' && (
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Alternative Locations</h3>
              <p className="text-sm text-gray-600 mb-4">
                Based on your risk profile, these locations may offer better long-term resilience.
              </p>
              
              {alternativeLocations.length > 0 ? (
                <div className="space-y-4">
                  {alternativeLocations.map((location) => (
                    <div key={location.id} className="border rounded-lg overflow-hidden">
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleLocationDetails(location.id)}
                      >
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{location.icon}</span>
                          <span className="font-medium">{location.name}</span>
                        </div>
                        <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {location.safetyIndex}% safer
                        </div>
                      </div>
                      
                      {selectedLocationDetails === location.id && (
                        <div className="p-4 bg-gray-50 border-t">
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="text-center">
                              <div className="text-lg font-medium">{location.safetyIndex}</div>
                              <div className="text-xs text-gray-500">Safety</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-medium">{location.insuranceIndex}</div>
                              <div className="text-xs text-gray-500">Insurance</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-medium">{location.affordabilityIndex}</div>
                              <div className="text-xs text-gray-500">Affordability</div>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-1">Main Climate Risks:</div>
                            <div className="flex flex-wrap gap-2">
                              {location.mainRisks.map((risk, idx) => (
                                <span key={idx} className="inline-flex items-center bg-gray-200 px-2 py-1 rounded text-xs">
                                  <span className="mr-1">{risk.icon}</span> {risk.name}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            <p>Insurance is generally {location.insuranceIndex > 50 ? 'more available' : 'less available'} in this region compared to your current location.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-lg font-medium mb-2">
                    No alternative locations available
                  </div>
                  <p className="text-sm text-gray-600">
                    We couldn't find any suitable alternative locations based on your current selection.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      <MobileNav />
    </div>
  );
};

export default ClimateFaxApp;
