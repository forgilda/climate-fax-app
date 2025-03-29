
import React, { useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

// Sample data
const data = [
  { year: 2000, historical: 4, predicted: null },
  { year: 2005, historical: 3, predicted: null },
  { year: 2010, historical: 5, predicted: null },
  { year: 2015, historical: 7, predicted: null },
  { year: 2020, historical: 8, predicted: null },
  { year: 2025, historical: null, predicted: 10 },
  { year: 2030, historical: null, predicted: 12 },
  { year: 2035, historical: null, predicted: 14 },
  { year: 2040, historical: null, predicted: 16 },
  { year: 2045, historical: null, predicted: 17 },
  { year: 2050, historical: null, predicted: 19 },
];

const ClimateFaxApp = () => {
  const [selectedRegion, setSelectedRegion] = useState("New York City, NY");
  const [selectedRisk, setSelectedRisk] = useState("Wildfire");
  const [selectedModel, setSelectedModel] = useState("Optimistic");

  return (
    <div className="pb-20">
      <MobileHeader title="Risk Assessment" />

      <main className="px-4 py-4">
        <div className="flex flex-col gap-6">
          {/* 1. Logo */}
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/6fbc7eea-1bd0-4194-96c2-29ea8c6189e0.png" 
              alt="ClimateFax Logo" 
              className="h-12" 
            />
          </div>

          {/* 3. KNOW section options */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">KNOW</h2>
            <div className="grid grid-cols-3 gap-2">
              <button className="bg-orange-500 text-white font-medium p-3 rounded-lg text-sm">Risk</button>
              <button className="bg-gray-100 text-gray-700 font-medium p-3 rounded-lg text-sm hover:bg-gray-200">Insurance</button>
              <button className="bg-gray-100 text-gray-700 font-medium p-3 rounded-lg text-sm hover:bg-gray-200">Properties</button>
            </div>
          </div>

          {/* 2. Region selection with better typeface */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Region</h2>
            <select 
              value={selectedRegion} 
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-base font-medium"
            >
              <option value="New York City, NY">New York City, NY</option>
              <option value="Los Angeles, CA">Los Angeles, CA</option>
              <option value="Miami, FL">Miami, FL</option>
              <option value="Denver, CO">Denver, CO</option>
            </select>
          </div>

          {/* 4. Climate category buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {["Wildfire", "Flood", "Drought", "Extreme Heat"].map((risk) => (
              <button
                key={risk}
                onClick={() => setSelectedRisk(risk)}
                className={`p-3 rounded-lg text-sm font-medium ${
                  selectedRisk === risk
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {risk}
              </button>
            ))}
          </div>

          {/* 5. Prediction model selection */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Prediction Model</h3>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Optimistic">Optimistic (SSP1-2.6)</option>
              <option value="Middle-of-the-Road">Middle-of-the-Road (SSP2-4.5)</option>
              <option value="Pessimistic">Pessimistic (SSP5-8.5)</option>
            </select>
          </div>

          {/* 6. Colored risk bar */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{selectedRisk} Risk Level</h3>
            <div className="w-full h-3 bg-gradient-to-r from-green-500 via-yellow-500 to-red-600 rounded-full"></div>
            <div className="w-full flex justify-between mt-1">
              <span className="text-xs text-gray-500">Low</span>
              <span className="text-xs text-gray-500">Medium</span>
              <span className="text-xs text-gray-500">High</span>
              <span className="text-xs text-gray-500">Extreme</span>
            </div>
          </div>

          {/* 7. Graph with historical and predicted data */}
          <div className="p-4 border border-gray-200 rounded-lg bg-white mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{selectedRisk} Risk Over Time</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="historical"
                  stroke="#8884d8"
                  name="Historical"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#82ca9d"
                  name="Predicted"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 8. Wildfire methodology note if applicable */}
          {selectedRisk === "Wildfire" && (
            <Alert variant="outline" className="mb-4">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Wildfire Risk Assessment Methodology</AlertTitle>
              <AlertDescription>
                This assessment uses data from the First Street Foundation and NASA satellite imagery to calculate risk scores.
              </AlertDescription>
            </Alert>
          )}

          {/* 9. Overall risk score with other three variables */}
          <div className="p-4 border border-gray-200 rounded-lg bg-white mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Risk Dashboard</h3>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded">
                <div className="text-xs text-gray-600">Overall Risk Score</div>
                <div className="text-lg font-bold text-orange-600">86/100</div>
              </div>
              <div className="p-2 bg-gray-100 rounded">
                <div className="text-xs text-gray-600">Wildfire</div>
                <div className="text-lg font-bold text-gray-700">High</div>
              </div>
              <div className="p-2 bg-gray-100 rounded">
                <div className="text-xs text-gray-600">Flood</div>
                <div className="text-lg font-bold text-gray-700">Medium</div>
              </div>
              <div className="p-2 bg-gray-100 rounded">
                <div className="text-xs text-gray-600">Drought</div>
                <div className="text-lg font-bold text-gray-700">High</div>
              </div>
            </div>
          </div>

          {/* 10. Premium features box */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Premium Features</h3>
            <ul className="text-sm text-gray-600 mb-3 space-y-2">
              <li className="flex items-center">
                <span className="mr-2 text-orange-500">✓</span> Detailed property-level risk assessment
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-orange-500">✓</span> Mitigation recommendations
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-orange-500">✓</span> Insurance savings estimates
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-orange-500">✓</span> PDF reports for insurance and home sales
              </li>
            </ul>
          </div>

          {/* 11. Try premium free box */}
          <div className="bg-orange-500 p-4 rounded-lg text-white text-center">
            <h3 className="font-bold mb-2">Try Premium Free for 14 Days</h3>
            <p className="text-sm mb-2">Get access to all features and detailed reports.</p>
            <button className="bg-white text-orange-500 font-bold py-2 px-4 rounded-full">
              Start Free Trial
            </button>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default ClimateFaxApp;
