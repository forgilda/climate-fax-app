
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search, AlertCircle } from "lucide-react";

const ClimateFaxApp = () => {
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("risks");

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(e.target.value);
  };

  const handleSearch = () => {
    if (zipCode.trim().length !== 5 || !/^\d+$/.test(zipCode)) {
      toast.error("Please enter a valid 5-digit ZIP code");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 1500);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <header className="p-4 flex items-center justify-between">
        <div className="text-2xl font-bold flex items-center">
          <span className="text-black">Climate</span>
          <span className="text-orange-500">FAX</span>
          <span className="text-xs align-top">®</span>
        </div>
        <Button 
          variant="outline" 
          className="text-sm"
          onClick={handleGoBack}
        >
          Home
        </Button>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Property Climate Risk Report</h1>
          <p className="text-gray-600">Enter a ZIP code to assess climate risks</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={zipCode}
              onChange={handleZipCodeChange}
              placeholder="Enter ZIP code"
              className="pl-10"
              maxLength={5}
            />
            <Button 
              className="absolute right-0 top-0 bottom-0 bg-orange-500 hover:bg-orange-600"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {searched && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="risks">Risks</TabsTrigger>
                <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
              </TabsList>

              <TabsContent value="risks" className="p-4">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Climate Risks for {zipCode}</h2>
                  <p className="text-gray-600">Based on historical data and climate models</p>
                </div>

                <div className="space-y-4">
                  <RiskCard 
                    title="Wildfire Risk" 
                    level="High" 
                    description="This area has seen a 35% increase in wildfire frequency over the past decade."
                  />
                  <RiskCard 
                    title="Flood Risk" 
                    level="Moderate" 
                    description="Flooding events occur approximately once every 7 years in this region."
                  />
                  <RiskCard 
                    title="Drought Risk" 
                    level="Moderate" 
                    description="Extended drought periods are becoming more common in this area."
                  />
                  <RiskCard 
                    title="Extreme Heat Risk" 
                    level="Very High" 
                    description="Annual average temperatures have increased by 2.3°F since 1970."
                  />
                </div>
              </TabsContent>

              <TabsContent value="alternatives" className="p-4">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Safer Alternatives</h2>
                  <p className="text-gray-600">Areas with lower climate risk profiles</p>
                </div>

                <div className="space-y-4">
                  <AlternativeCard 
                    zipCode="97201" 
                    city="Portland, OR" 
                    distance="320 miles" 
                    riskLevel="Low"
                    affordability="Moderate"
                  />
                  <AlternativeCard 
                    zipCode="83814" 
                    city="Coeur d'Alene, ID" 
                    distance="410 miles" 
                    riskLevel="Very Low"
                    affordability="High"
                  />
                  <AlternativeCard 
                    zipCode="59715" 
                    city="Bozeman, MT" 
                    distance="680 miles" 
                    riskLevel="Low"
                    affordability="Moderate"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      <footer className="p-4 text-center text-gray-600 text-sm">
        © 2023 ClimateFAX. All rights reserved.
      </footer>
    </div>
  );
};

interface RiskCardProps {
  title: string;
  level: 'Low' | 'Moderate' | 'High' | 'Very High';
  description: string;
}

const RiskCard = ({ title, level, description }: RiskCardProps) => {
  const getLevelColor = () => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Very High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">{title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor()}`}>
            {level}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        
        {/* Make all "Learn More" buttons the same height with flex-grow-0 and min-h-[44px] */}
        <div className="flex">
          <Button variant="outline" className="text-blue-600 border-blue-600 w-full min-h-[44px] flex-grow-0">
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface AlternativeCardProps {
  zipCode: string;
  city: string;
  distance: string;
  riskLevel: string;
  affordability: string;
}

const AlternativeCard = ({ zipCode, city, distance, riskLevel, affordability }: AlternativeCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold">{city}</h3>
            <p className="text-sm text-gray-500">ZIP: {zipCode}</p>
          </div>
          <span className="text-sm text-gray-500">{distance}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-500">Risk Level</p>
            <p className="font-medium">{riskLevel}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-500">Affordability</p>
            <p className="font-medium">{affordability}</p>
          </div>
        </div>
        
        <Button variant="outline" className="w-full text-blue-600 border-blue-600">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClimateFaxApp;
