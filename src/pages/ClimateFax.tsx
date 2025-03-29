
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
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <MobileHeader title="CLIMATE FAX" />
      
      <main className="flex-1 overflow-auto p-4 pb-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">CLIMATE<span className="text-orange-500">FAX</span></h1>
        <p className="text-gray-600 mb-6">Climate risk assessment and projections</p>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-semibold mb-3">Data Visualization</h2>
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
                  name={variable}
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
              <option value="california">California</option>
              <option value="texas">Texas</option>
              <option value="florida">Florida</option>
            </select>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-sm mb-2">Variable</h3>
            <select
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="wildfires">Wildfires</option>
              <option value="flooding">Flooding</option>
              <option value="drought">Drought</option>
            </select>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default ClimateFaxApp;
