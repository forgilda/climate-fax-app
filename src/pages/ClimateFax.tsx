import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Sparkles, Shield, HelpCircle } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import * as Recharts from "recharts";

const regions = {
  "New York": ["New York City", "Buffalo", "Rochester"],
  California: ["Los Angeles", "San Francisco", "San Diego"],
  Texas: ["Houston", "Austin", "Dallas"],
  Florida: ["Miami", "Tampa", "Orlando"],
  Illinois: ["Chicago", "Aurora", "Rockford"],
};

const neighborhoodData = {
  "New York City": {
    riskScore: 78,
    annualRate: 2500,
    propertyImpact: 30,
    populationDensity: "High",
    climateRiskFactors: ["Flooding", "Heatwaves"],
  },
  Buffalo: {
    riskScore: 62,
    annualRate: 1800,
    propertyImpact: 15,
    populationDensity: "Medium",
    climateRiskFactors: ["Snowstorms", "Lake Effect Flooding"],
  },
  Rochester: {
    riskScore: 55,
    annualRate: 1600,
    propertyImpact: 10,
    populationDensity: "Medium",
    climateRiskFactors: ["Snowstorms", "Flooding"],
  },
  "Los Angeles": {
    riskScore: 85,
    annualRate: 3200,
    propertyImpact: 40,
    populationDensity: "High",
    climateRiskFactors: ["Wildfires", "Drought"],
  },
  "San Francisco": {
    riskScore: 90,
    annualRate: 4000,
    propertyImpact: 50,
    populationDensity: "High",
    climateRiskFactors: ["Sea Level Rise", "Earthquakes"],
  },
  "San Diego": {
    riskScore: 75,
    annualRate: 2800,
    propertyImpact: 25,
    populationDensity: "Medium",
    climateRiskFactors: ["Drought", "Wildfires"],
  },
  Houston: {
    riskScore: 88,
    annualRate: 3500,
    propertyImpact: 45,
    populationDensity: "High",
    climateRiskFactors: ["Hurricanes", "Flooding"],
  },
  Austin: {
    riskScore: 70,
    annualRate: 2200,
    propertyImpact: 20,
    populationDensity: "Medium",
    climateRiskFactors: ["Heatwaves", "Drought"],
  },
  Dallas: {
    riskScore: 65,
    annualRate: 2000,
    propertyImpact: 18,
    populationDensity: "Medium",
    climateRiskFactors: ["Tornadoes", "Heatwaves"],
  },
  Miami: {
    riskScore: 95,
    annualRate: 4500,
    propertyImpact: 60,
    populationDensity: "High",
    climateRiskFactors: ["Hurricanes", "Sea Level Rise"],
  },
  Tampa: {
    riskScore: 80,
    annualRate: 3000,
    propertyImpact: 35,
    populationDensity: "Medium",
    climateRiskFactors: ["Hurricanes", "Flooding"],
  },
  Orlando: {
    riskScore: 72,
    annualRate: 2400,
    propertyImpact: 22,
    populationDensity: "Medium",
    climateRiskFactors: ["Hurricanes", "Heatwaves"],
  },
  Chicago: {
    riskScore: 60,
    annualRate: 1700,
    propertyImpact: 12,
    populationDensity: "High",
    climateRiskFactors: ["Flooding", "Extreme Cold"],
  },
  Aurora: {
    riskScore: 50,
    annualRate: 1400,
    propertyImpact: 8,
    populationDensity: "Medium",
    climateRiskFactors: ["Flooding", "Extreme Cold"],
  },
  Rockford: {
    riskScore: 45,
    annualRate: 1300,
    propertyImpact: 5,
    populationDensity: "Low",
    climateRiskFactors: ["Flooding", "Extreme Cold"],
  },
};

const riskFactorsData = {
  Flooding: {
    description: "Increased rainfall and rising sea levels leading to property damage.",
    recommendations: ["Elevate property", "Install flood barriers", "Purchase flood insurance"],
  },
  Heatwaves: {
    description: "Prolonged periods of high temperatures causing health risks and infrastructure strain.",
    recommendations: ["Install energy-efficient cooling systems", "Create shaded outdoor spaces", "Ensure access to cooling centers"],
  },
  Wildfires: {
    description: "Increased frequency and intensity of wildfires threatening homes and ecosystems.",
    recommendations: ["Create defensible space around property", "Use fire-resistant building materials", "Develop evacuation plan"],
  },
  Drought: {
    description: "Extended periods of low rainfall leading to water scarcity and agricultural losses.",
    recommendations: ["Implement water conservation measures", "Invest in drought-resistant landscaping", "Explore alternative water sources"],
  },
  "Sea Level Rise": {
    description: "Rising sea levels inundating coastal areas and increasing erosion.",
    recommendations: ["Relocate vulnerable structures", "Construct seawalls and levees", "Restore coastal wetlands"],
  },
  Earthquakes: {
    description: "Seismic activity causing ground shaking and structural damage.",
    recommendations: ["Retrofit buildings to withstand earthquakes", "Secure heavy objects", "Develop earthquake preparedness plan"],
  },
  Hurricanes: {
    description: "Strong tropical cyclones with high winds and heavy rainfall causing widespread damage.",
    recommendations: ["Reinforce roofs and windows", "Trim trees and remove debris", "Evacuate when necessary"],
  },
  Snowstorms: {
    description: "Heavy snowfall and blizzard conditions disrupting transportation and causing power outages.",
    recommendations: ["Stock up on emergency supplies", "Clear snow from roofs and walkways", "Insulate pipes to prevent freezing"],
  },
  "Lake Effect Flooding": {
    description: "Localized flooding caused by heavy snowfall and rapid melting near large bodies of water.",
    recommendations: ["Improve drainage systems", "Elevate structures above flood level", "Monitor weather forecasts"],
  },
  "Extreme Cold": {
    description: "Prolonged periods of sub-freezing temperatures causing hypothermia and infrastructure damage.",
    recommendations: ["Insulate homes and pipes", "Dress in layers", "Ensure access to heating sources"],
  },
  Tornadoes: {
    description: "Violent rotating columns of air causing destruction along their path.",
    recommendations: ["Seek shelter in a basement or interior room", "Stay away from windows", "Monitor weather alerts"],
  },
};

export default function ClimateFaxApp() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [propertyImpact, setPropertyImpact] = useState(10);
  const [activeTab, setActiveTab] = useState("overview");

  const neighborhoods = regions[selectedRegion] || [];

  useEffect(() => {
    if (selectedNeighborhood) {
      setPropertyImpact(neighborhoodData[selectedNeighborhood]?.propertyImpact || 10);
    }
  }, [selectedNeighborhood]);

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    setSelectedNeighborhood("");
  };

  const handleNeighborhoodChange = (neighborhood) => {
    setSelectedNeighborhood(neighborhood);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Climate Risk Assessment Tool <Sparkles className="inline-block text-yellow-500" />
          </h1>
          <p className="text-gray-600">
            Evaluate climate risks and make informed decisions about your property.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Location Selection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="region">Region</Label>
              <Select onValueChange={handleRegionChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(regions).map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Select
                onValueChange={handleNeighborhoodChange}
                disabled={!selectedRegion}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a neighborhood" />
                </SelectTrigger>
                <SelectContent>
                  {neighborhoods.map((neighborhood) => (
                    <SelectItem key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {selectedNeighborhood && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Overview of {selectedNeighborhood}
                </CardTitle>
                <CardDescription>
                  Key climate risk indicators for the selected neighborhood.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-blue-700">Risk Score</div>
                    <div className="text-2xl font-bold text-blue-900">{selectedNeighborhood && neighborhoodData[selectedNeighborhood].riskScore}/100</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm text-green-700">Annual Insurance Rate</div>
                    <div className="text-2xl font-bold text-green-900">${selectedNeighborhood && neighborhoodData[selectedNeighborhood].annualRate?.toLocaleString()}</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-sm text-yellow-700">Property Value Impact</div>
                    <div className="text-2xl font-bold text-yellow-900">-{selectedNeighborhood && neighborhoodData[selectedNeighborhood].propertyImpact}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
                <TabsTrigger value="insurance">Insurance</TabsTrigger>
                <TabsTrigger value="stay-or-go">Stay or Go</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Neighborhood Overview</CardTitle>
                    <CardDescription>General information about the selected neighborhood.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Population Density</Label>
                        <Input type="text" value={selectedNeighborhood && neighborhoodData[selectedNeighborhood].populationDensity} disabled />
                      </div>
                      <div>
                        <Label>Climate Risk Factors</Label>
                        <Input type="text" value={selectedNeighborhood && neighborhoodData[selectedNeighborhood].climateRiskFactors.join(", ")} disabled />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Climate Risk Factors</CardTitle>
                    <CardDescription>Detailed information about specific climate risks.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedNeighborhood && neighborhoodData[selectedNeighborhood].climateRiskFactors.map((risk, index) => (
                      <div key={index} className="mb-4">
                        <h3 className="text-lg font-semibold">{risk}</h3>
                        <p className="text-gray-700">{riskFactorsData[risk].description}</p>
                        <h4 className="font-semibold mt-2">Recommendations</h4>
                        <ul className="list-disc list-inside">
                          {riskFactorsData[risk].recommendations.map((recommendation, i) => (
                            <li key={i}>{recommendation}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insurance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Insurance Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <p>
                        Understanding your insurance needs is crucial in areas prone to climate-related risks.
                        Here's a breakdown of potential insurance costs and coverage options for {selectedNeighborhood}.
                      </p>
                      <p>
                        <strong>Base Annual Rate:</strong> ${selectedNeighborhood && neighborhoodData[selectedNeighborhood].annualRate?.toLocaleString()}
                      </p>
                    </div>

                    {/* Premium Analysis - Updated to use consistent blue */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-3">Premium Analysis</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-100 p-3 rounded border border-blue-300">
                          <div className="text-sm text-blue-700">Base Rate</div>
                          <div className="text-lg font-bold text-blue-900">${selectedNeighborhood.annualRate?.toLocaleString()}</div>
                        </div>
                        <div className="bg-blue-100 p-3 rounded border border-blue-300">
                          <div className="text-sm text-blue-700">Risk Adjusted</div>
                          <div className="text-lg font-bold text-blue-900">${Math.round(selectedNeighborhood.annualRate * 1.2).toLocaleString()}</div>
                        </div>
                        <div className="bg-blue-100 p-3 rounded border border-blue-300">
                          <div className="text-sm text-blue-700">Market Rate</div>
                          <div className="text-lg font-bold text-blue-900">${Math.round(selectedNeighborhood.annualRate * 1.4).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Coverage Recommendations</h4>
                      <ul className="list-disc list-inside">
                        <li><strong>Flood Insurance:</strong> Highly recommended due to increased flood risk.</li>
                        <li><strong>Wind Damage Coverage:</strong> Essential for protection against severe storms.</li>
                        <li><strong>Property Insurance:</strong> Comprehensive coverage for overall property protection.</li>
                      </ul>
                      <p>
                        Consult with an insurance provider to tailor your coverage to the specific risks in {selectedNeighborhood}.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stay-or-go" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Decision Framework</CardTitle>
                    <CardDescription>
                      A structured approach to deciding whether to stay or relocate.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ol className="list-decimal list-inside space-y-2">
                      <li>
                        <strong>Assess Your Risk Tolerance:</strong>
                        <p>
                          Consider your comfort level with the identified climate risks. Are you willing to
                          invest in mitigation strategies, or would you prefer to avoid the risks altogether?
                        </p>
                      </li>
                      <li>
                        <strong>Evaluate Financial Implications:</strong>
                        <p>
                          Calculate the potential costs of staying, including insurance premiums, property
                          damage, and mitigation measures. Compare these costs to the potential expenses of
                          relocating, such as moving costs and new property purchases.
                        </p>
                      </li>
                      <li>
                        <strong>Consider Long-Term Projections:</strong>
                        <p>
                          Research climate change projections for {selectedNeighborhood} and consider how
                          these changes may impact your property and quality of life in the future.
                        </p>
                      </li>
                      <li>
                        <strong>Explore Alternative Locations:</strong>
                        <p>
                          Identify potential relocation destinations with lower climate risks and comparable
                          amenities. Consider factors such as community, job opportunities, and access to
                          essential services.
                        </p>
                      </li>
                      <li>
                        <strong>Make an Informed Decision:</strong>
                        <p>
                          Weigh the pros and cons of staying versus relocating based on your risk tolerance,
                          financial situation, and long-term projections. Consult with experts, such as
                          financial advisors and climate scientists, to gain additional insights.
                        </p>
                      </li>
                    </ol>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Impact Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Updated to use consistent blue styling */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-blue-900 mb-3">Cost Breakdown</h4>
                        <div className="space-y-2">
                          <div className="bg-blue-100 p-3 rounded border border-blue-300">
                            <div className="flex justify-between">
                              <span className="text-blue-700">Annual Insurance</span>
                              <span className="font-bold text-blue-900">${selectedNeighborhood.annualRate?.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="bg-blue-100 p-3 rounded border border-blue-300">
                            <div className="flex justify-between">
                              <span className="text-blue-700">Property Value Impact</span>
                              <span className="font-bold text-blue-900">-{propertyImpact}%</span>
                            </div>
                          </div>
                          <div className="bg-blue-100 p-3 rounded border border-blue-300">
                            <div className="flex justify-between">
                              <span className="text-blue-700">Risk Score</span>
                              <span className="font-bold text-blue-900">{selectedNeighborhood.riskScore}/100</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <ChartContainer
                        id="financial-impact"
                        config={{
                          insurance: { label: "Insurance", color: "hsl(var(--primary))" },
                          property: { label: "Property Value", color: "hsl(var(--destructive))" },
                          risk: { label: "Risk Score", color: "hsl(var(--secondary))" },
                        }}
                      >
                        <Recharts.ResponsiveContainer width="100%" height={300}>
                          <Recharts.BarChart data={[
                            { name: "Current", insurance: selectedNeighborhood.annualRate, property: -propertyImpact, risk: selectedNeighborhood.riskScore },
                            { name: "Projected", insurance: Math.round(selectedNeighborhood.annualRate * 1.1), property: -(propertyImpact * 1.2), risk: Math.round(selectedNeighborhood.riskScore * 1.1) },
                          ]}>
                            <Recharts.CartesianGrid strokeDasharray="3 3" />
                            <Recharts.XAxis dataKey="name" />
                            <Recharts.YAxis />
                            <Recharts.Tooltip content={<ChartTooltipContent />} />
                            <Recharts.Legend />
                            <Recharts.Bar dataKey="insurance" fill="hsl(var(--primary))" />
                            <Recharts.Bar dataKey="property" fill="hsl(var(--destructive))" />
                            <Recharts.Bar dataKey="risk" fill="hsl(var(--secondary))" />
                          </Recharts.BarChart>
                        </Recharts.ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Alternative Locations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Explore potential relocation destinations with lower climate risks and comparable
                        amenities. Consider factors such as community, job opportunities, and access to
                        essential services.
                      </p>
                      <ul className="list-disc list-inside">
                        <li><strong>Option 1:</strong> [City, State] - Lower risk score, similar amenities.</li>
                        <li><strong>Option 2:</strong> [City, State] - Moderate risk score, growing job market.</li>
                        <li><strong>Option 3:</strong> [City, State] - Minimal risk score, strong community.</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Updated comparison charts section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Insurance Cost Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Updated to use consistent blue styling */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Annual Premium Estimates</h4>
                        <p className="text-sm text-blue-700">Based on similar property values and coverage</p>
                      </div>
                      
                      <ChartContainer
                        id="insurance-comparison"
                        config={{
                          current: { label: "Current", color: "hsl(var(--primary))" },
                          alternative1: { label: "Alternative 1", color: "hsl(var(--secondary))" },
                          alternative2: { label: "Alternative 2", color: "hsl(var(--accent))" },
                        }}
                      >
                        <Recharts.ResponsiveContainer width="100%" height={300}>
                          <Recharts.BarChart data={[
                            { name: "Neighborhood", current: selectedNeighborhood.annualRate, alternative1: Math.round(selectedNeighborhood.annualRate * 0.8), alternative2: Math.round(selectedNeighborhood.annualRate * 0.9) },
                          ]}>
                            <Recharts.CartesianGrid strokeDasharray="3 3" />
                            <Recharts.XAxis dataKey="name" />
                            <Recharts.YAxis />
                            <Recharts.Tooltip content={<ChartTooltipContent />} />
                            <Recharts.Legend />
                            <Recharts.Bar dataKey="current" fill="hsl(var(--primary))" />
                            <Recharts.Bar dataKey="alternative1" fill="hsl(var(--secondary))" />
                            <Recharts.Bar dataKey="alternative2" fill="hsl(var(--accent))" />
                          </Recharts.BarChart>
                        </Recharts.ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Property Value Impact Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Updated to use consistent blue styling */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Climate Risk Impact on Property Values</h4>
                        <p className="text-sm text-blue-700">Estimated impact over next 10 years</p>
                      </div>
                      
                      <ChartContainer
                        id="property-value-comparison"
                        config={{
                          current: { label: "Current", color: "hsl(var(--primary))" },
                          alternative1: { label: "Alternative 1", color: "hsl(var(--secondary))" },
                          alternative2: { label: "Alternative 2", color: "hsl(var(--accent))" },
                        }}
                      >
                        <Recharts.ResponsiveContainer width="100%" height={300}>
                          <Recharts.BarChart data={[
                            { name: "Neighborhood", current: -propertyImpact, alternative1: -(propertyImpact * 0.5), alternative2: -(propertyImpact * 0.3) },
                          ]}>
                            <Recharts.CartesianGrid strokeDasharray="3 3" />
                            <Recharts.XAxis dataKey="name" />
                            <Recharts.YAxis />
                            <Recharts.Tooltip content={<ChartTooltipContent />} />
                            <Recharts.Legend />
                            <Recharts.Bar dataKey="current" fill="hsl(var(--primary))" />
                            <Recharts.Bar dataKey="alternative1" fill="hsl(var(--secondary))" />
                            <Recharts.Bar dataKey="alternative2" fill="hsl(var(--accent))" />
                          </Recharts.BarChart>
                        </Recharts.ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
