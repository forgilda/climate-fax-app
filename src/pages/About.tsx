
import React, { useState } from 'react';
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("data");

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <MobileHeader title="About ClimateFAX" showBackButton={true} />
      
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
                <ul className="list-disc pl-5 space-y-2">
                  <li>Copernicus Climate Change Service (C3S) Satellite Arrays</li>
                  <li>Copernicus Sentinel-2 and Sentinel-3 Imagery</li>
                  <li>CALFIRE & USFS (California Wildfire Data)</li>
                  <li>NOAA Hurricane Database</li>
                  <li>NOAA Storm Prediction Center (Tornado Data)</li>
                  <li>NASA & NOAA Sea Level Monitoring</li>
                </ul>
                <p className="text-sm text-gray-500 mt-4">
                  Note: Only counts significant wildfires ≥1,000 acres or causing significant damage
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
                  We believe that access to accurate climate information should be available to everyone,
                  not just governments and large corporations.
                </p>
                <p>
                  By democratizing access to climate data, we empower individuals to make informed decisions
                  about where they live, work, and invest.
                </p>
                
                <p>
                  ClimateFAX helps individuals and communities understand their climate risks through accurate, 
                  accessible, and actionable information.
                </p>
                
                <div className="mt-6 flex justify-center">
                  <img 
                    src="/lovable-uploads/ab0ad9d7-9e62-4fe2-882a-9efc53cfd25d.jpeg"
                    alt="Climate change visualization" 
                    className="rounded-lg shadow-md max-w-[250px] h-auto"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <MobileNav />
    </div>
  );
};

export default AboutPage;
