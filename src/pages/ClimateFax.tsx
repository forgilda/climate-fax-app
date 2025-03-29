import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
        {/* Region Selection - Moved to top */}
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
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Risk Score Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                    className={`text-white font-bold px-2 py-1 rounded ${
                      region === 'florida' && variable === 'hurricanes' ? 'bg-red-500' : 'bg-green-500'
                    }`}
                  >
                    {region === 'florida' && variable === 'hurricanes' ? 'Limited' : 'Available'}
                  </div>
                  <div className="ml-3 text-gray-700">
                    {region === 'california' ? '$2,800' : (region === 'florida' ? '$3,200' : '$2,500')}/year
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {region === 'florida' && variable === 'hurricanes' 
                    ? "This area has limited insurance availability due to elevated hurricane risk." 
                    : "Standard insurance coverage should be available in this area."}
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

            {/* Climate Categories */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Climate Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(categories).map(([key, cat]) => (
                  <div 
                    key={key}
                    className={`p-4 rounded-lg border-2 cursor-pointer hover:bg-gray-50 transition
                      ${cat.variables.includes(variable) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => {
                      if (cat.variables.length > 0) {
                        setVariable(cat.variables[0]);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{cat.icon}</span>
                      <h3 className="font-medium">{cat.name}</h3>
                    </div>
                    <ul className="mt-2 text-sm text-gray-600">
                      {cat.variables.map(v => (
                        <li 
                          key={v} 
                          className={`py-1 ${v === variable ? 'font-bold text-blue-700' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setVariable(v);
                          }}
                        >
                          {variables[v].name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Visualization Chart */}
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
                
                {/* Risk Assessment - Above the chart */}
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
                
                {/* Variable-specific notes */}
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
                
                <div className="mt-6 flex justify-between">
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-medium mb-2">Data Sources</h3>
                    <ul className="list-disc pl-5 text-sm">
                      <li>NASA Earth Observations Program</li>
                      <li>NOAA Climate Data</li>
                      <li>Copernicus Climate Change Service (C3S)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded">
                    <h3 className="font-medium text-blue-800 mb-2">Want More Detailed Analysis?</h3>
                    <p className="text-sm mb-3">
                      Upgrade to Premium for personalized recommendations, cost analysis, and alternative locations.
                    </p>
                    <button 
                      className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded"
                      onClick={() => setCurrentPlan('premium')}
                    >
                      Try Premium Free for 30 Days
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Premium Feature Teaser */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
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
          </div>
        )}
        
        {/* Stay or Go Tab Content - PREMIUM */}
        {activeTab === 'stayOrGo' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-purple-600 text-xl mr-2">✨</span>
                <h2 className="text-lg font-bold text-purple-800">Premium Feature</h2>
              </div>
              <p className="mt-2 text-purple-700">
                Get insights about the financial impact of climate risk on your property and insurance.
              </p>
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
            
            {/* Insurance Analysis */}
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
                <h2 className="text-lg font-bold text-purple-800">Premium Feature</h2>
              </div>
              <p className="mt-2 text-purple-700">
                Discover safer alternative locations based on your lifestyle preferences and priorities.
              </p>
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
    </div>
  );
};

export default ClimateFaxApp;
