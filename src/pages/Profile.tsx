
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ChevronRight, Mail, Phone, MapPin } from "lucide-react";

const Profile = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <MobileHeader title="Profile" />
      
      <main className="flex-1 overflow-auto p-4 pb-20">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-3">
            <AvatarImage src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">Jane Doe</h2>
          <p className="text-gray-500">iOS Developer</p>
        </div>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="flex items-center p-4">
                <Mail className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-sm">jane.doe@example.com</span>
              </div>
              <div className="flex items-center p-4">
                <Phone className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center p-4">
                <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {["Edit Profile", "Privacy Settings", "Help & Support", "Logout"].map((item, index) => (
                <button key={index} className="w-full flex items-center justify-between p-4 text-left">
                  <span>{item}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default Profile;
