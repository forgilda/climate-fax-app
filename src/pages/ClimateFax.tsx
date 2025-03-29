
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
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
  const [selectedCategory, setSelectedCategory] = useState('heat-fire');
  
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
  
  // Simulate loading data
  useEffect(() => {
    const fetchData = async () => {
      // Simulating API fetch with timeout
      setTimeout(() => {
        setData([
          { year: 2015, value: 50 },
          { year: 2016, value: 70 },
          { year: 2017, value: 65 },
          { year: 2018, value: 90 },
          { year: 2019, value: 100 },
          { year: 2020, value: 120 },
          { year: 2021, value: 110 },
          { year: 2022, value: 140 },
        ]);
        setLoading(false);
      }, 1500);
    };
    
    fetchData();
  }, [region, variable]);

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
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f97316" 
                  activeDot={{ r: 8 }} 
                  name={variables[variable].name}
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
      </main>
      
      <MobileNav />
    </div>
  );
};

export default ClimateFaxApp;
