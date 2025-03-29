
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { 
  Bell, 
  Lock, 
  Moon, 
  ChevronRight, 
  Globe, 
  HelpCircle, 
  Info
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <MobileHeader title="Settings" />
      
      <main className="flex-1 overflow-auto p-4 pb-20">
        <Card className="mb-4">
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-500 mr-3" />
                  <span>Notifications</span>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <Moon className="h-5 w-5 text-gray-500 mr-3" />
                  <span>Dark Mode</span>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="p-0">
            <div className="divide-y">
              <button className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-gray-500 mr-3" />
                  <span>Privacy</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-500 mr-3" />
                  <span>Language</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">English</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              <button className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 text-gray-500 mr-3" />
                  <span>Help</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-4 text-left">
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-gray-500 mr-3" />
                  <span>About</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default Settings;
