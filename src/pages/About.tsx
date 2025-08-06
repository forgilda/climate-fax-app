
import React, { useState } from 'react';
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copyright } from "@/components/Copyright";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("data");

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Updated header to match the KNOW YOUR RISK page */}
      <MobileHeader title="" showBackButton={true}>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="text-2xl font-bold relative">
            <span className="text-black">Climate</span>
            <span className="text-orange-500">FAX</span>
            <span className="absolute top-0 right-0 -mt-1 -mr-3 text-xs">®</span>
          </div>
        </div>
      </MobileHeader>
      
      <main className="px-4 py-6">
        <Tabs defaultValue="data" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="data">Data Sources</TabsTrigger>
            <TabsTrigger value="about">About Us</TabsTrigger>
          </TabsList>
          
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Sources</CardTitle>
                <CardDescription>
                  ClimateFAX uses data from trusted scientific sources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* NOAA Billion-Dollar Disaster Data */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                    <span className="mr-2">💰</span>
                    NOAA Billion-Dollar Climate Disasters (1980-2024)
                  </h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Real historical data showing the dramatic increase in climate-related economic losses from NOAA's National Centers for Environmental Information.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
                    <div className="bg-white p-3 rounded border">
                      <div className="text-lg font-bold text-blue-800">403</div>
                      <div className="text-xs text-blue-600">Total Events</div>
                      <div className="text-xs text-blue-600">(1980-2024)</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <div className="text-lg font-bold text-green-800">$2.915T</div>
                      <div className="text-xs text-green-600">Total Cost</div>
                      <div className="text-xs text-green-600">(CPI-adjusted)</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <div className="text-lg font-bold text-orange-800">23/yr</div>
                      <div className="text-xs text-orange-600">Current Rate</div>
                      <div className="text-xs text-orange-600">(2020-2024)</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <div className="text-lg font-bold text-red-800">$149B</div>
                      <div className="text-xs text-red-600">Annual Cost</div>
                      <div className="text-xs text-red-600">(2020-2024 avg)</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-blue-600">
                    <p>
                      <strong>Source:</strong> NOAA National Centers for Environmental Information (NCEI) - 
                      Billion-Dollar Weather and Climate Disasters database. Data includes 16,941 total deaths 
                      from these disasters, with frequency increasing from 3 events/year in the 1980s to 23 events/year in the 2020s.
                    </p>
                  </div>
                </div>

                <ul className="list-disc pl-5 space-y-2">
                  <li>NOAA National Centers for Environmental Information (NCEI) - Billion-Dollar Disaster Database</li>
                  <li>Copernicus Climate Change Service (C3S) Satellite Arrays</li>
                  <li>Copernicus Sentinel-2 and Sentinel-3 Imagery</li>
                  <li>CALFIRE & USFS (California Wildfire Data)</li>
                  <li>NOAA Hurricane Database</li>
                  <li>NOAA Storm Prediction Center (Tornado Data)</li>
                  <li>NASA & NOAA Sea Level Monitoring</li>
                  <li>FEMA - Federal Emergency Management Agency flood zone maps and risk assessments</li>
                  <li>USGS - United States Geological Survey elevation and topographical data</li>
                  <li>NWS - National Weather Service historical storm frequency statistics</li>
                  <li>State Insurance Departments - Coverage availability and rate filing data</li>
                  <li>US Census Bureau - Geographic and demographic data for ZIP codes</li>
                </ul>
                <p className="text-sm text-gray-500 mt-4">
                  Note: Only counts significant wildfires ≥1,000 acres or causing significant damage
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>How We Calculate Risk</CardTitle>
                <CardDescription>
                  Our methodology for neighborhood-specific risk scores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  ClimateFAX combines historical frequency data with current hazard maps to create neighborhood-specific risk scores. We use:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                  <li>Official hazard designations (FEMA flood zones, CAL FIRE severity zones)</li>
                  <li>Historical event frequency from NOAA databases</li>
                  <li>Elevation data from USGS to assess flood and fire risk</li>
                  <li>Insurance availability as a market-based risk indicator</li>
                </ul>
                <p className="text-sm text-gray-600 mt-4 font-medium">
                  We do not create predictions from scratch - we aggregate and analyze existing government data to make it actionable for your housing decisions.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Model Information</CardTitle>
                <CardDescription>
                  Understanding our prediction models
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Linear Trend</h4>
                    <p className="text-sm text-gray-600">Basic projection enhanced with Copernicus satellite data</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Accelerated Change</h4>
                    <p className="text-sm text-gray-600">Uses satellite-observed acceleration patterns</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Mitigation Scenario</h4>
                    <p className="text-sm text-gray-600">Shows impact of climate action, though extreme weather events still increase</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
              <div className="max-w-md overflow-hidden rounded-xl bg-white shadow-md">
                <div className="relative h-64 w-full">
                  <img
                    src="/lovable-uploads/1567f41d-1d4b-4b70-80c3-c6e701cbeedc.png"
                    alt="Earth with climate data visualization"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-sm text-white">Global climate data visualization</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500">
                    Our models combine satellite imagery with ground-based measurements to create accurate predictions.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About ClimateFAX</CardTitle>
                <CardDescription>
                  Climate intelligence for everyone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  ClimateFAX helps individuals and communities understand their climate risks through accurate, 
                  accessible, and actionable information.
                </p>
                <p>
                  We believe that access to accurate climate information should be available to everyone,
                  not just governments and large corporations.
                </p>
                <p>
                  By democratizing access to climate data, we empower individuals to make informed decisions
                  about where they live, work, and invest.
                </p>
                
                <div className="mt-6 flex justify-center">
                  <img 
                    src="/lovable-uploads/6fbc7eea-1bd0-4194-96c2-29ea8c6189e0.png"
                    alt="Climate data visualization of Earth" 
                    className="rounded-lg shadow-md max-w-[250px] h-auto"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Copyright />
      <MobileNav />
    </div>
  );
};

export default AboutPage;
