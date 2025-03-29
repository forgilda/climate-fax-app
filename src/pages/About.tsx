
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
                    src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2F0ZWxsaXRlJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
                    alt="Earth image showing climate data visualization"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-sm text-white">Global climate visualization</p>
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
                  Our platform combines satellite data with advanced climate models to provide personalized
                  climate risk assessments and recommendations.
                </p>
                
                <div className="mt-6 flex justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Earth visualization" 
                    className="rounded-lg shadow-md max-w-[250px] h-auto"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
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
