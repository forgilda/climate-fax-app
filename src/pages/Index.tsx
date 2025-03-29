import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Home, Settings, User, BarChart2 } from "lucide-react";
import { MobileNav } from "@/components/MobileNav";
import { MobileHeader } from "@/components/MobileHeader";
import { navigateToPath } from "@/utils/navigation";
import Copyright from '@/components/Copyright';

const Index = () => {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const time = new Date().getHours();
    if (time < 12) {
      setGreeting("Good morning");
    } else if (time < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <MobileHeader title="Home" />
      
      <main className="flex-1 overflow-auto p-4 pb-20">
        <Card className="mb-4 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{greeting}</CardTitle>
            <CardDescription>Welcome to your iOS app</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              This is your React app running as a native iOS application using Capacitor
            </p>
          </CardContent>
        </Card>

        <Card className="mb-3 shadow-sm bg-gradient-to-r from-orange-500/10 to-orange-600/10">
          <CardContent className="p-0">
            <button 
              className="w-full flex items-center justify-between p-4 text-left"
              onClick={() => navigateToPath('/climate-fax')}
            >
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-orange-500" />
                <span className="font-medium">ClimateFax</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        {["Profile", "Settings", "Notifications"].map((item, index) => (
          <Card key={index} className="mb-3 shadow-sm">
            <CardContent className="p-0">
              <button className="w-full flex items-center justify-between p-4 text-left">
                <span>{item}</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </CardContent>
          </Card>
        ))}
        
        <div className="mt-6">
          <Button className="w-full" variant="default">
            Continue
          </Button>
        </div>
      </main>
      
      <Copyright />
      <MobileNav />
    </div>
  );
};

export default Index;
