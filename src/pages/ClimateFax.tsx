
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { useToast } from "@/hooks/use-toast";

const ClimateFaxApp = () => {
  const { toast } = useToast();
  
  // Main state variables
  const [data, setData] = useState([]);
  const [region, setRegion] = useState('california');
  const [variable, setVariable] = useState('wildfires');
  const [model, setModel] = useState('linear');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('riskAssessment');
  const [currentPlan, setCurrentPlan] = useState('free'); // 'free' or 'premium'
  const [selectedCategory, setSelectedCategory] = useState('heat-fire');
  const [selectedLocationDetails, setSelectedLocationDetails] = useState(null);
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    homeownerStatus: 'homeowner',
    currentLocation: 'california',
    familySize: '1-2',
    healthcareAccess: 'important',
    schoolQuality: 'important',
    lifestylePreference: 'suburban'
  });
  
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
      affordabilityIndex: 25
    },
    'texas': {
      name: 'Texas', 
      icon: '🤠',
      majorCities: ['Houston', 'Dallas', 'Austin', 'San Antonio'],
      mainRisks: ['flooding', 'tornadoes', 'drought'],
      safetyIndex: 60,
      insuranceIndex: 45,
      affordabilityIndex: 55
    }
  };
  
  // Alternative locations data
  const alternativeLocations = [
    {
      id: 'florida',
      name: 'Orlando, Florida',
      icon: '🌴',
      safetyIndex: 68,
      insuranceIndex: 45,
      affordabilityIndex: 60,
      mainRisks: [
        { name: 'Hurricanes', icon: '🌀' },
        { name: 'Flooding', icon: '🌊' }
      ]
    },
    {
      id: 'texas',
      name: 'Austin, Texas',
      icon: '🤠',
      safetyIndex: 72,
      insuranceIndex: 65,
      affordabilityIndex: 58,
      mainRisks: [
        { name: 'Heat Waves', icon: '☀️' },
        { name: 'Drought', icon: '🏜️' }
      ]
    }
  ];
  
  // Risk score and recommendations
  const riskScore = 72; // 0-100, higher is worse
  
  // Risk category based on score
  const getRiskCategory = (score) => {
    if (score < 40) return { category: 'Low', color: '#4CAF50' };
    if (score < 70) return { category: 'Moderate', color: '#FF9800' };
    return { category: 'High', color: '#F44336' };
  };
  
  const getRiskColor = (score) => {
    if (score < 40) return '#4CAF50';
    if (score < 70) return '#FF9800';
    return '#F44336';
  };
  
  const riskCategory = getRiskCategory(riskScore);
  
  // Recommendation info
  const recommendation = {
    recommendation: 'Consider Relocating',
    icon: '⚠️',
    color: '#F44336',
    reasons: [
      'High wildfire risk projected to increase by 35% in next decade',
      'Property insurance availability decreasing annually',
      'Drought conditions negatively impacting home values'
    ]
  };
  
  // Property impact
  const propertyImpact = 18; // percentage decrease in 10 years
  
  // Insurance info
  const insuranceInfo = {
    available: false,
    annualRate: 4500,
    notes: 'Many insurance providers no longer offering new policies in high-risk wildfire zones.'
  };
  
  // Data for comparison charts
  const insuranceComparisonData = [
    { name: 'California', value: 4500 },
    { name: 'Florida', value: 3200 },
    { name: 'Texas', value: 2100 }
  ];
  
  const valueImpactData = [
    { name: 'California', impact: 18 },
    { name: 'Florida', impact: 12 },
    { name: 'Texas', impact: 7 }
  ];
  
  // Toggle location details
  const toggleLocationDetails = (locationId) => {
    if (selectedLocationDetails === locationId) {
      setSelectedLocationDetails(null);
    } else {
      setSelectedLocationDetails(locationId);
    }
  };
  
  // Tooltip component for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium text-sm">{`Year: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value} ${variables[variable]?.unit || ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Simulate loading data
  useEffect(() => {
    setLoading(true);
    
    // Simulating API fetch with timeout
    const fetchData = async () => {
      // Simulating API fetch with timeout
      setTimeout(() => {
        // Generate data based on region and variable
        const historicalYears = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
        const futureYears = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
        
        // Base values adjusted by region and variable
        let baseValue = 50;
        let growthFactor = 1.15;
        
        if (region === 'california' && variable === 'wildfires') {
          baseValue = 70;
          growthFactor = 1.25;
        } else if (region === 'florida' && variable === 'hurricanes') {
          baseValue = 60;
          growthFactor = 1.2;
        } else if (region === 'texas' && variable === 'flooding') {
          baseValue = 55;
          growthFactor = 1.18;
        }
        
        // Generate historical data
        const historicalData = historicalYears.map((year, index) => {
          // Add some randomness to make the data look realistic
          const randomFactor = 0.8 + Math.random() * 0.4; // Between 0.8 and 1.2
          const value = Math.round(baseValue * Math.pow(1.1, index) * randomFactor);
          return {
            year,
            historicalValue: value,
            predictedValue: null
          };
        });
        
        // Generate predicted data
        const lastHistoricalValue = historicalData[historicalData.length - 1].historicalValue;
        const predictedData = futureYears.map((year, index) => {
          // Add some randomness to make the data look realistic
          const randomFactor = 0.9 + Math.random() * 0.2; // Between 0.9 and 1.1
          const value = Math.round(lastHistoricalValue * Math.pow(growthFactor, index + 1) * randomFactor);
          return {
            year,
            historicalValue: null,
            predictedValue: value
          };
        });
        
        setData([...historicalData, ...predictedData]);
        setLoading(false);
        
        toast({
          title: "Data Updated",
          description: `Showing ${variables[variable]?.name || variable} data for ${regions[region]?.name || region}`,
        });
      }, 1500);
    };
    
    fetchData();
  }, [region, variable, toast]);

  // Handle category selection
  const handleCategoryChange = (categoryKey) => {
    setSelectedCategory(categoryKey);
    // Default to first variable in the category
    setVariable(categories[categoryKey].variables[0]);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <MobileHeader title="CLIMATE FAX" />
      
      <main className="flex-1 overflow-auto p-4 pb-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">CLIMATE<span className="text-orange-500">FAX</span></h1>
        <p className="text-gray-600 mb-6">Climate risk assessment and projections</p>
        
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6 -mx-4 px-4">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'riskAssessment' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('riskAssessment')}
          >
            Risk Assessment
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'stayOrGo' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('stayOrGo')}
          >
            Stay or Go
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'alternatives' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('alternatives')}
          >
            Alternatives
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'profile' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>
        
        {/* Risk Assessment Tab */}
        {activeTab === 'riskAssessment' && (
          <div>
            {/* Current Region Info */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">{regions[region].icon}</span>
                <h2 className="text-xl font-semibold">{regions[region].name}</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-orange-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Safety</div>
                  <div className="text-lg font-semibold">{regions[region].safetyIndex}/100</div>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Insurance</div>
                  <div className="text-lg font-semibold">{regions[region].insuranceIndex}/100</div>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-sm text-gray-500">Affordability</div>
                  <div className="text-lg font-semibold">{regions[region].affordabilityIndex}/100</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-sm font-medium mb-1">Main Climate Risks:</div>
                <div className="flex flex-wrap gap-1">
                  {regions[region].mainRisks.map(riskKey => (
                    <span key={riskKey} className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                      {variables[riskKey]?.icon || '⚠️'} {variables[riskKey]?.name || riskKey}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Major Cities:</div>
                <div className="flex flex-wrap gap-1">
                  {regions[region].majorCities.map(city => (
                    <span key={city} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                      🏙️ {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Risk Categories */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  className={`p-3 rounded-lg text-left ${selectedCategory === key ? 'bg-orange-500 text-white' : 'bg-white shadow-sm'}`}
                  onClick={() => handleCategoryChange(key)}
                >
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className={`text-sm font-medium ${selectedCategory === key ? 'text-white' : 'text-gray-900'}`}>
                    {category.name}
                  </div>
                </button>
              ))}
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">{variables[variable].icon}</span>
                  <div>
                    <h2 className="text-lg font-semibold">{variables[variable].name}</h2>
                    <div className="text-xs text-gray-500">Unit: {variables[variable].unit}</div>
                  </div>
                </div>
                
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={data}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip content={CustomTooltip} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="historicalValue" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Historical"
                      connectNulls
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predictedValue" 
                      stroke="#ff0000" 
                      activeDot={{ r: 8 }} 
                      name="Predicted"
                      strokeDasharray="5 5"
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-sm mb-2">Region</h3>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {Object.entries(regions).map(([key, regionData]) => (
                    <option key={key} value={key}>{regionData.icon} {regionData.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-sm mb-2">Variable</h3>
                <select
                  value={variable}
                  onChange={(e) => setVariable(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {categories[selectedCategory].variables.map((varKey) => (
                    <option key={varKey} value={varKey}>
                      {variables[varKey].icon} {variables[varKey].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Stay or Go Tab */}
        {activeTab === 'stayOrGo' && (
          <div>
            {currentPlan === 'premium' ? (
              <div>
                {/* Decision Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Location Analysis: {regions[region].name}</h2>
                  
                  <div className="border-t border-b border-gray-200 py-4 my-4">
                    <div className="flex justify-center items-center mb-4">
                      <div 
                        className="text-white font-bold text-2xl py-2 px-4 rounded-lg flex items-center"
                        style={{ backgroundColor: recommendation.color }}
                      >
                        <span className="text-3xl mr-2">{recommendation.icon}</span>
                        <span>{recommendation.recommendation}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-gray-700 mb-2">Key Factors:</h3>
                    <ul className="list-disc pl-5">
                      {recommendation.reasons.map((reason, index) => (
                        <li key={index} className="mb-1">{reason}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 mb-2">Climate Risk</h3>
                      <div className="flex items-center">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: riskCategory.color }}
                        >
                          {riskScore}
                        </div>
                        <div className="ml-3 text-sm">
                          <div style={{ color: riskCategory.color }}>{riskCategory.category} Risk</div>
                          <div className="text-gray-500">Overall Rating</div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        {regions[region].mainRisks.map((risk, index) => (
                          <span key={index} className="inline-flex items-center bg-white px-2 py-1 rounded mr-2 mb-2 border border-gray-200">
                            {variables[risk]?.icon} {variables[risk]?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 mb-2">Property Value</h3>
                      <div className="flex items-center">
                        <div className="text-3xl font-bold" style={{ color: propertyImpact > 15 ? '#F44336' : '#4CAF50' }}>
                          -{propertyImpact}%
                        </div>
                        <div className="ml-3 text-sm text-gray-500">
                          Projected 10-year impact
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-gray-600">
                        <p>
                          {propertyImpact > 15
                            ? "Properties in this area are projected to experience significant devaluation due to increasing climate risks."
                            : "Property values in this area are expected to remain relatively stable despite climate risks."}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 mb-2">Insurance</h3>
                      <div className="flex items-center">
                        <div 
                          className={`text-white font-medium px-2 py-1 rounded ${insuranceInfo.available ? 'bg-green-500' : 'bg-red-500'}`}
                        >
                          {insuranceInfo.available ? 'Available' : 'Limited'}
                        </div>
                        <div className="ml-3 text-gray-700">
                          ${insuranceInfo.annualRate.toLocaleString()}/year
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-gray-600">
                        <p>{insuranceInfo.notes}</p>
                        {!insuranceInfo.available && (
                          <p className="mt-2 text-red-600">
                            Warning: Insurance unavailability severely impacts financial security and mortgage options.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Alternative Locations Summary */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Alternative Locations to Consider</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {alternativeLocations.map(loc => (
                      <div key={loc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <span className="text-2xl mr-2">{loc.icon}</span>
                            <h3 className="font-medium text-gray-800">{loc.name}</h3>
                          </div>
                          <button 
                            onClick={() => toggleLocationDetails(loc.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {selectedLocationDetails === loc.id ? 'Hide Details' : 'See Details'}
                          </button>
                        </div>
                        
                        {selectedLocationDetails === loc.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              <div className="text-center">
                                <div className="text-sm text-gray-500">Safety</div>
                                <div 
                                  className="font-bold"
                                  style={{ color: getRiskColor(100 - loc.safetyIndex) }}
                                >
                                  {loc.safetyIndex}/100
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-gray-500">Insurance</div>
                                <div 
                                  className="font-bold"
                                  style={{ color: getRiskColor(100 - loc.insuranceIndex) }}
                                >
                                  {loc.insuranceIndex}/100
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-gray-500">Affordability</div>
                                <div 
                                  className="font-bold"
                                  style={{ color: getRiskColor(100 - loc.affordabilityIndex) }}
                                >
                                  {loc.affordabilityIndex}/100
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-3">
                              <div className="mb-1 font-medium">Primary Climate Risks:</div>
                              <div className="flex flex-wrap">
                                {loc.mainRisks.map((risk, index) => (
                                  <span key={index} className="inline-flex items-center bg-gray-100 px-2 py-1 rounded mr-2 mb-1">
                                    {risk.icon} {risk.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <button 
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                              onClick={() => setRegion(loc.id)}
                            >
                              Compare Details
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="mb-6">
                  <span className="inline-block text-5xl mb-4">💵</span>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Know Your Cost</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Understand the financial implications of climate risk on your property, insurance costs, and long-term value.
                  </p>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Insurance cost estimates and availability</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Property value impact projections</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Utility cost forecasts based on climate change</span>
                  </div>
                </div>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
                  onClick={() => setCurrentPlan('premium')}
                >
                  Try Premium Free for 30 Days
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  Then just $5/month. Cancel anytime. No commitment required.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Alternative Locations Tab */}
        {activeTab === 'alternatives' && (
          <div>
            {currentPlan === 'premium' ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Comparative Analysis</h2>
                
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Annual Insurance Costs</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={insuranceComparisonData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" label={{ value: 'Annual Premium ($)', position: 'insideBottom', offset: -5 }} />
                        <YAxis type="category" dataKey="name" width={80} />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Annual Premium']} />
                        <Bar dataKey="value" nameKey="name" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">10-Year Property Value Impact</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={valueImpactData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          label={{ value: 'Projected Value Decline (%)', position: 'insideBottom', offset: -5 }} 
                        />
                        <YAxis type="category" dataKey="name" width={80} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Value Decline']} />
                        <Bar dataKey="impact" nameKey="name">
                          {valueImpactData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.impact > 15 ? '#F44336' : (entry.impact > 10 ? '#FF9800' : '#4CAF50')} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[region, ...alternativeLocations.map(l => l.id)].map(locationId => {
                    const locationInfo = regions[locationId];
                    return (
                      <div 
                        key={locationId} 
                        className={`border rounded-lg p-4 ${region === locationId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                        onClick={() => setRegion(locationId)}
                      >
                        <div className="flex items-center mb-3">
                          <span className="text-2xl mr-2">{locationInfo.icon}</span>
                          <h3 className="font-medium">{locationInfo.name}</h3>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Safety</div>
                            <div 
                              className="font-bold text-sm"
                              style={{ color: getRiskColor(100 - locationInfo.safetyIndex) }}
                            >
                              {locationInfo.safetyIndex}/100
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Insurance</div>
                            <div 
                              className="font-bold text-sm"
                              style={{ color: getRiskColor(100 - locationInfo.insuranceIndex) }}
                            >
                              {locationInfo.insuranceIndex}/100
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Affordability</div>
                            <div 
                              className="font-bold text-sm"
                              style={{ color: getRiskColor(100 - locationInfo.affordabilityIndex) }}
                            >
                              {locationInfo.affordabilityIndex}/100
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600">
                          <div className="font-medium mb-1">Primary Risks:</div>
                          <div className="flex flex-wrap">
                            {locationInfo.mainRisks.map((risk, index) => (
                              <span key={index} className="inline-flex items-center bg-gray-100 px-1 py-0.5 rounded mr-1 mb-1 text-xs">
                                {variables[risk]?.icon} {variables[risk]?.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="mb-6">
                  <span className="inline-block text-5xl mb-4">🗺️</span>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Know Your Options</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Find climate-safer locations based on your personal lifestyle preferences and needs.
                  </p>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Personalized "Stay or Go" recommendations</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Alternative location suggestions</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Side-by-side comparisons of locations</span>
                  </div>
                </div>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
                  onClick={() => setCurrentPlan('premium')}
                >
                  Try Premium Free for 30 Days
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  Then just $5/month. Cancel anytime. No commitment required.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* User Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Personalize Your ClimateFax Experience</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-gray-700 mb-4">Your Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                    <select 
                      value={userProfile.homeownerStatus}
                      onChange={(e) => setUserProfile({...userProfile, homeownerStatus: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="homeowner">Current Homeowner</option>
                      <option value="buyer">Prospective Homebuyer</option>
                      <option value="disaster-survivor">Disaster Survivor</option>
                      <option value="relocating">Planning to Relocate</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                    <select 
                      value={userProfile.currentLocation}
                      onChange={(e) => setUserProfile({...userProfile, currentLocation: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {Object.entries(regions).map(([key, info]) => (
                        <option key={key} value={key}>{info.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Family Size</label>
                    <select 
                      value={userProfile.familySize}
                      onChange={(e) => setUserProfile({...userProfile, familySize: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="1-2">1-2 people</option>
                      <option value="3-4">3-4 people</option>
                      <option value="5+">5+ people</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-4">Your Lifestyle Priorities</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Healthcare Access</label>
                    <select 
                      value={userProfile.healthcareAccess}
                      onChange={(e) => setUserProfile({...userProfile, healthcareAccess: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="critical">Critical Priority</option>
                      <option value="important">Very Important</option>
                      <option value="somewhat">Somewhat Important</option>
                      <option value="less">Less Important</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Quality</label>
                    <select 
                      value={userProfile.schoolQuality}
                      onChange={(e) => setUserProfile({...userProfile, schoolQuality: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="critical">Critical Priority</option>
                      <option value="important">Very Important</option>
                      <option value="somewhat">Somewhat Important</option>
                      <option value="less">Less Important</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Environment</label>
                    <select 
                      value={userProfile.lifestylePreference}
                      onChange={(e) => setUserProfile({...userProfile, lifestylePreference: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="urban">Urban/City Living</option>
                      <option value="suburban">Suburban</option>
                      <option value="small-town">Small Town</option>
                      <option value="rural">Rural</option>
                    </select>
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
