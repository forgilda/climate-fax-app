import React, { useState } from 'react';
import { zipCodeForecasts } from '@/lib/insurance-data';

export const InsuranceForecastDashboard = () => {
  const [zipCode, setZipCode] = useState('90049');
  
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setZipCode(e.target.value);
  };
  
  // Get current forecast data
  const forecastData = zipCodeForecasts[zipCode] || zipCodeForecasts['90049'];
  
  // Generate chart data
  const chartData = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < 5; i++) {
    chartData.push({
      year: (currentYear + i + 1).toString(),
      nonRenewalRate: forecastData.nonRenewalRates[i],
      insurers: forecastData.insurers[i],
      premium: forecastData.premiums[i]
    });
  }
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Insurance Forecast Dashboard</h2>
        <p className="text-sm text-gray-600">5-Year Projections Based on Current Market Trends</p>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Zip Code</label>
          <select
            value={zipCode}
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border rounded p-4">
            <h3 className="text-lg font-medium mb-4">Non-Renewal Rate Projection</h3>
            <div className="h-64 flex items-center justify-center bg-gray-100">
              <p className="text-sm text-gray-500">Non-renewal rate graph would appear here</p>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Projected Non-Renewal Rates:</h4>
              <div className="overflow-x-auto mt-2">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Year</th>
                      {chartData.map((data, index) => (
                        <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-500">{data.year}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-3 py-2 text-sm font-medium">Rate</td>
                      {chartData.map((data, index) => (
                        <td key={index} className="px-3 py-2 text-sm">{data.nonRenewalRate}%</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="border rounded p-4">
            <h3 className="text-lg font-medium mb-4">Remaining Insurers</h3>
            <div className="h-64 flex items-center justify-center bg-gray-100">
              <p className="text-sm text-gray-500">Insurer availability graph would appear here</p>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Projected Insurer Availability:</h4>
              <div className="overflow-x-auto mt-2">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Year</th>
                      {chartData.map((data, index) => (
                        <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-500">{data.year}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-3 py-2 text-sm font-medium">Insurers</td>
                      {chartData.map((data, index) => (
                        <td key={index} className="px-3 py-2 text-sm">{data.insurers}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 mb-6">
          <div className="border rounded p-4">
            <h3 className="text-lg font-medium mb-4">Premium Forecast</h3>
            <div className="h-64 flex items-center justify-center bg-gray-100">
              <p className="text-sm text-gray-500">Premium forecast graph would appear here</p>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Projected Annual Premiums:</h4>
              <div className="overflow-x-auto mt-2">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Year</th>
                      {chartData.map((data, index) => (
                        <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-500">{data.year}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-3 py-2 text-sm font-medium">Premium</td>
                      {chartData.map((data, index) => (
                        <td key={index} className="px-3 py-2 text-sm">${data.premium.toLocaleString()}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
