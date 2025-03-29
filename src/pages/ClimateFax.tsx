
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";

const ClimateFaxApp = () => {
  // Main state variables
  const [data, setData] = useState([]);
  const [region, setRegion] = useState('california');
  const [variable, setVariable] = useState('wildfires');
  const [model, setModel] = useState('linear');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('riskAssessment');
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
    'asheville': {
      name: 'Asheville, NC', 
      icon: '⛰️',
      majorCities: ['Asheville'],
      mainRisks: ['flooding', 'landslides'],
      safetyIndex: 75,
      insuranceIndex: 70,
      affordabilityIndex: 50
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
    'california': ['colorado', 'asheville'],
    'florida': ['asheville', 'colorado'],
    'texas': ['colorado', 'asheville']
  };
  
  // Insurance rate estimates (per year)
  const insuranceRates = {
    'california': {
      'regular': 2800,
      'high-risk': 9500
    },
    'florida': {
      'regular': 3200,
      'high-risk': 14500
    },
    'texas': {
      'regular': 2500,
      'high-risk': 7500
    },
    'asheville': {
      'regular': 1800,
      'high-risk': 4500
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
      'asheville': 55,
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
      'asheville': { low: 2, high: 10 },
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
    
    const rateType = isHighRisk ? 'high-risk' : 'regular';
    const rate = insuranceRates[region]?.[rateType] || 2000;
    
    return {
      available: !(region === 'florida' && variable === 'hurricanes' && model === 'accelerated'),
      annualRate: rate,
      notes: isHighRisk ? 
        "This area has limited insurance availability or high premiums due to elevated risk." : 
        "Standard insurance coverage should be available in this area."
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
  const CustomTooltip = ({ active, payload, label }) => {
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
        'asheville': 5,
        'colorado': 4
      };
      return { name: loc.name, impact: baseImpacts[loc.id] || 5 };
    })
  ];
  
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <MobileHeader title="ClimateFax" showBackButton={true} />

      <main className="px-4 py-4">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('riskAssessment')}
              className={`mr-4 py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'riskAssessment'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Risk Assessment
            </button>
            <button
              onClick={() => {
                setActiveTab('stayOrGo');
                if (currentPlan !== 'premium') {
                  // Option to present upgrade prompt
                }
              }}
              className={`mr-4 py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stayOrGo'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cost Analysis
            </button>
            <button
              onClick={() => {
                setActiveTab('alternatives');
                if (currentPlan !== 'premium') {
                  // Option to present upgrade prompt
                }
              }}
              className={`mr-4 py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'alternatives'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Location Options
            </button>
          </nav>
        </div>

        {/* Main Controls - Always visible */}
        <div className="grid grid-cols-1 gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div>
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Climate Variable</label>
            <select 
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(variables).map(([key, info]) => (
                <option key={key} value={key}>{info.icon} {info.name}</option>
              ))}
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

        {/* Feature Tabs with Subscription Status Indicators */}
        <div className="flex items-center mx-auto mb-6 max-w-2xl">
          <div className="flex-1 text-center">
            <div className={`border-b-2 pb-1 ${activeTab === 'riskAssessment' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
              <div className="flex justify-center items-center">
                <span className="text-sm font-medium">Know Your Risk</span>
                <span className="ml-1 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Free</span>
              </div>
            </div>
          </div>
          <div className="flex-1 text-center">
            <div className={`border-b-2 pb-1 ${activeTab === 'stayOrGo' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
              <div className="flex justify-center items-center">
                <span className="text-sm font-medium">Know Your Cost</span>
                <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">Premium</span>
              </div>
            </div>
          </div>
          <div className="flex-1 text-center">
            <div className={`border-b-2 pb-1 ${activeTab === 'alternatives' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
              <div className="flex justify-center items-center">
                <span className="text-sm font-medium">Know Your Options</span>
                <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">Premium</span>
              </div>
            </div>
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
                    {insuranceInfo.available ? 'Available' : 'Limited'}
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
                  <div className="text-xl font-bold" style={{ color: recommendation.color }}>
                    {recommendation.recommendation}
                  </div>
                  <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                    {recommendation.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cost Analysis Tab */}
        {activeTab === 'stayOrGo' && (
          <div>
            {/* Insurance Rate Comparison */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Insurance Rate Comparison
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={insuranceComparisonData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" label={{ value: 'Annual Premium ($)', position: 'insideBottom', offset: -5 }} />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Annual Premium']} />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-gray-500 mt-3">
                Estimated annual premiums for homeowners insurance based on region and risk factors.
              </div>
            </div>

            {/* Property Value Impact Comparison */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Property Value Impact Comparison
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={valueImpactData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      label={{ value: 'Projected Value Decline (%)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Value Decline']} />
                    <Bar dataKey="impact">
                      {valueImpactData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.impact > 15 ? '#F44336' : entry.impact > 10 ? '#FF9800' : '#4CAF50'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-gray-500 mt-3">
                Projected 10-year property value decline due to climate risks in each location.
              </div>
            </div>

            {/* Detailed Cost Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Stay or Go: Financial Analysis
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="font-medium text-gray-700">Insurance Premium:</div>
                  <div className="text-right">${insuranceInfo.annualRate.toLocaleString()}/year</div>
                  
                  <div className="font-medium text-gray-700">10-Year Insurance Cost:</div>
                  <div className="text-right">${(insuranceInfo.annualRate * 10).toLocaleString()}</div>
                  
                  <div className="font-medium text-gray-700">Property Value Impact:</div>
                  <div className="text-right">-{propertyImpact}% over 10 years</div>
                  
                  <div className="font-medium text-gray-700">On $500K Property:</div>
                  <div className="text-right">-${(500000 * propertyImpact / 100).toLocaleString()}</div>
                  
                  <div className="border-t pt-2 font-medium text-gray-700">Total 10-Year Cost:</div>
                  <div className="border-t pt-2 text-right font-bold text-red-600">
                    ${((insuranceInfo.annualRate * 10) + (500000 * propertyImpact / 100)).toLocaleString()}
                  </div>
                </div>
                
                <div className="mt-6 p-3 bg-gray-50 rounded-md text-sm">
                  <div className="font-medium mb-1">Recommendation:</div>
                  <div>
                    {insuranceInfo.available ? (
                      <>
                        {propertyImpact > 15 ? (
                          "Consider relocating due to significant projected property devaluation and high insurance costs."
                        ) : (
                          "Financial impact is manageable. If you're committed to this location, mitigation strategies are recommended."
                        )}
                      </>
                    ) : (
                      "Relocation strongly advised due to insurance unavailability and significant financial risks."
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alternative Locations Tab */}
        {activeTab === 'alternatives' && (
          <div>
            {/* Location Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Recommended Alternative Locations
              </h3>
              
              <div className="space-y-3">
                {alternativeLocations.length === 0 ? (
                  <div className="text-center p-4 text-gray-500">
                    No alternative locations available for the current selection.
                  </div>
                ) : (
                  alternativeLocations.map((location) => (
                    <div key={location.id} className="border rounded-lg overflow-hidden">
                      <button 
                        className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100"
                        onClick={() => toggleLocationDetails(location.id)}
                      >
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{location.icon}</span>
                          <span className="font-medium">{location.name}</span>
                        </div>
                        <div className={`transform transition-transform ${selectedLocationDetails === location.id ? 'rotate-180' : ''}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      
                      {selectedLocationDetails === location.id && (
                        <div className="p-4 bg-white border-t">
                          {/* Location Metrics */}
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="text-center">
                              <div className="mb-1 text-xs text-gray-500">Safety</div>
                              <div 
                                className="font-medium"
                                style={{ color: getRiskColor(100 - location.safetyIndex) }}
                              >
                                {location.safetyIndex}/100
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="mb-1 text-xs text-gray-500">Insurance</div>
                              <div 
                                className="font-medium"
                                style={{ color: getRiskColor(100 - location.insuranceIndex) }}
                              >
                                {location.insuranceIndex}/100
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="mb-1 text-xs text-gray-500">Affordability</div>
                              <div 
                                className="font-medium"
                                style={{ color: getRiskColor(100 - location.affordabilityIndex) }}
                              >
                                {location.affordabilityIndex}/100
                              </div>
                            </div>
                          </div>
                          
                          {/* Main Risks */}
                          <div className="mb-4">
                            <div className="text-sm font-medium mb-2">Main Climate Risks:</div>
                            <div className="flex flex-wrap gap-2">
                              {location.mainRisks.map((risk, index) => (
                                <div key={index} className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
                                  <span className="mr-1">{risk.icon}</span>
                                  <span>{risk.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <button className="flex-1 py-2 px-3 bg-blue-600 text-white rounded text-sm font-medium">
                              Compare Details
                            </button>
                            <button className="flex-1 py-2 px-3 bg-gray-200 text-gray-800 rounded text-sm font-medium">
                              View on Map
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Climate Safe Index Map */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Climate Safety Index
              </h3>
              <div className="relative pt-4 pb-8">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1333&q=80"
                  alt="Climate Safety Map" 
                  className="w-full h-52 object-cover rounded"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="px-4 py-2 bg-white/80 rounded text-sm font-medium">
                    Premium Feature - Upgrade for Interactive Map
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                A visualization of climate safety scores across regions based on multiple risk factors.
              </div>
            </div>
          </div>
        )}
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              My Profile
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                <select 
                  value={userProfile.currentLocation}
                  onChange={(e) => setUserProfile({...userProfile, currentLocation: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.entries(regions).map(([key, info]) => (
                    <option key={key} value={key}>{info.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Homeowner Status</label>
                <select 
                  value={userProfile.homeownerStatus}
                  onChange={(e) => setUserProfile({...userProfile, homeownerStatus: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="homeowner">Homeowner</option>
                  <option value="renter">Renter</option>
                  <option value="looking">Looking to buy</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Family Size</label>
                <select 
                  value={userProfile.familySize}
                  onChange={(e) => setUserProfile({...userProfile, familySize: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1-2">1-2 people</option>
                  <option value="3-4">3-4 people</option>
                  <option value="5+">5+ people</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Situation</label>
                <select 
                  value={userProfile.workSituation}
                  onChange={(e) => setUserProfile({...userProfile, workSituation: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="office">Office-based</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lifestyle Preference</label>
                <select 
                  value={userProfile.lifestylePreference}
                  onChange={(e) => setUserProfile({...userProfile, lifestylePreference: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="urban">Urban</option>
                  <option value="suburban">Suburban</option>
                  <option value="rural">Rural</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Moving Timeframe</label>
                <select 
                  value={userProfile.timeframe}
                  onChange={(e) => setUserProfile({...userProfile, timeframe: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="now">Immediate</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>
              
              <div className="pt-4">
                <button className="w-full py-2 px-4 bg-blue-600 text-white rounded font-medium">
                  Update Preferences
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Upgrade Banner - Show at bottom */}
        {currentPlan !== 'premium' && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center">
              <div className="mr-4 text-3xl">✨</div>
              <div className="flex-1">
                <h3 className="font-bold mb-1">Get Premium Access</h3>
                <p className="text-sm text-blue-100">Unlock property cost analysis, alternative locations, and interactive maps.</p>
              </div>
              <button className="px-3 py-1.5 bg-white text-blue-700 rounded font-medium text-sm">
                Upgrade
              </button>
            </div>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default ClimateFaxApp;
