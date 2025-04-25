import React, { useState } from 'react';
import { zipCodeData } from '@/lib/insurance-data';

export const LAInsuranceRiskMap = () => {
  const [selectedZipCode, setSelectedZipCode] = useState('90049');
  
  const getRiskColor = (level: string) => {
    switch(level) {
      case 'very-high': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-400';
      case 'low': return 'bg-green-400';
      default: return 'bg-gray-300';
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedZipCode(e.target.value);
  };
  
  // Get current data
  const currentData = zipCodeData[selectedZipCode] || zipCodeData['90049'];
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Los Angeles County Insurance Risk Map</h2>
        <p className="text-sm text-gray-600">Data from California Department of Insurance (Q1 2024) and CAL FIRE (January 2024)</p>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Zip Code</label>
          <select
            value={selectedZipCode}
            onChange={handleZipCodeChange}
            className="block w-full p-2 border border-gray-300 rounded"
          >
            <option value="90049">90049 - Brentwood</option>
            <option value="90272">90272 - Pacific Palisades</option>
            <option value="90065">90065 - Los Feliz</option>
            <option value="91011">91011 - La Cañada Flintridge</option>
            <option value="91302">91302 - Calabasas</option>
            <option value="90402">90402 - Santa Monica</option>
          </select>
        </div>
        
        <div className="mb-4">
          <div className="flex space-x-2 mb-2">
            <button
              className="px-3 py-1 text-sm rounded bg-blue-600 text-white"
            >
              Non-Renewal Rates
            </button>
            <button
              className="px-3 py-1 text-sm rounded bg-gray-200"
            >
              Fire Hazard Zones
            </button>
            <button
              className="px-3 py-1 text-sm rounded bg-gray-200"
            >
              Available Insurers
            </button>
          </div>
          
          {/* Placeholder for map visualization */}
          <div className="border rounded h-64 flex items-center justify-center bg-gray-100 relative">
            <div className="text-gray-600">
              Interactive map visualization would be integrated here
            </div>
            <div className="absolute top-2 right-2 bg-white p-2 rounded shadow-sm text-sm">
              <div className="mb-1">Risk Levels:</div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-red-600 mr-1"></div>
                <span>Very High</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                <span>High</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-1"></div>
                <span>Moderate</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-400 mr-1"></div>
                <span>Low</span>
              </div>
            </div>
          </div>
        </div>
        
        {currentData && (
          <div className="border rounded p-4 bg-gray-50">
            <h3 className="text-lg font-medium mb-2">Risk Assessment for {selectedZipCode} - {currentData.name}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Current Risk Factors</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-sm text-gray-600 w-32">Fire Hazard Zone:</span>
                    <span className={`inline-block px-2 py-1 rounded text-xs text-white ${getRiskColor(currentData.fireHazardZone)}`}>
                      {currentData.fireHazardZone.toUpperCase()}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-sm text-gray-600 w-32">Non-Renewal Rate:</span>
                    <span className="font-medium">{formatPercentage(currentData.nonRenewalRate)}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-sm text-gray-600 w-32">Insurance Hotspot:</span>
                    <span className={`inline-block rounded-full w-4 h-4 ${currentData.nonRenewalRate > 0.3 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    <span className="ml-2 text-sm">
                      {currentData.nonRenewalRate > 0.3 ? 'Yes' : 'No'}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-sm text-gray-600 w-32">Available Insurers:</span>
                    <span className="font-medium">{currentData.availableInsurers}</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Insurance Options</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-sm text-gray-600 w-40">FAIR Plan Estimate:</span>
                    <span className="font-medium">${currentData.fairPlanEstimate.toLocaleString()}/year</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-sm text-gray-600 w-40">Private Market Available:</span>
                    <span className={`inline-block rounded-full w-4 h-4 ${currentData.privateMarketAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="ml-2 text-sm">
                      {currentData.privateMarketAvailable ? 'Yes' : 'No'}
                    </span>
                  </li>
                  {currentData.privateMarketAvailable && (
                    <li className="flex items-center">
                      <span className="text-sm text-gray-600 w-40">Private Market Estimate:</span>
                      <span className="font-medium">${currentData.privateMarketEstimate.toLocaleString()}/year</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
