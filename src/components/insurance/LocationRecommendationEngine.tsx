import React, { useState } from 'react';
import { recommendations, stayOrGoRecommendation } from '@/lib/insurance-data';

export const LocationRecommendationEngine = () => {
  const [currentZipCode, setCurrentZipCode] = useState('90049');
  
  const getRiskColor = (level: string) => {
    switch(level) {
      case 'very-high': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'moderate': return 'bg-yellow-400';
      case 'low': return 'bg-green-400';
      default: return 'bg-gray-300';
    }
  };
  
  const getRecommendationStyle = (rec: string) => {
    switch(rec) {
      case 'Consider relocating': return 'bg-red-100 border-red-500 text-red-800';
      case 'Prepare for changes': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'Stay with precautions': return 'bg-green-100 border-green-500 text-green-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };
  
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentZipCode(e.target.value);
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Location Recommendation Engine</h2>
        <p className="text-sm text-gray-600">Personalized guidance for your climate risk decisions</p>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Your Location</label>
          <select
            value={currentZipCode}
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
        
        {stayOrGoRecommendation && (
          <div className={`border-2 rounded-lg p-4 mb-6 ${getRecommendationStyle(stayOrGoRecommendation.recommendation)}`}>
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold">{stayOrGoRecommendation.recommendation}</h3>
              <div className="bg-white px-2 py-1 rounded-full text-xs font-medium">
                {stayOrGoRecommendation.confidence}% confidence
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="font-medium mb-2">Reasons to Consider Staying</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {stayOrGoRecommendation.reasonsToStay.map((reason: string, index: number) => (
                    <li key={`stay-${index}`}>{reason}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Reasons to Consider Relocating</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {stayOrGoRecommendation.reasonsToGo.map((reason: string, index: number) => (
                    <li key={`go-${index}`}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-medium mb-4">Alternative Locations to Consider</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((location: any, index: number) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 border-b">
                  <h4 className="font-medium">{location.city}, {location.state}</h4>
                  <div className="text-sm text-gray-600">{location.zipCode}</div>
                </div>
                
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(location.riskLevel)}`}></div>
                      <span className="ml-2 text-sm">{location.riskLevel.toUpperCase()} Risk</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{location.distance} miles</span> away
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance:</span>
                      <span className="font-medium">{location.insuranceAvailability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Est. Premium:</span>
                      <span className="font-medium">${location.estimatedPremium.toLocaleString()}/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Affordability:</span>
                      <span className="font-medium">{location.affordabilityIndex}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-medium uppercase text-gray-500 mb-1">Highlights</h5>
                    <ul className="text-sm space-y-1">
                      {location.highlights.map((highlight: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <span className="text-green-500 mr-1">✓</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Match Score</div>
                    <div className="font-medium">{location.matchScore}%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${location.matchScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
