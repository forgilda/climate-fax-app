
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const PASSWORD = "CF101M"; // Updated password

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if already authenticated
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === PASSWORD) {
      // Set authentication in sessionStorage instead of localStorage
      sessionStorage.setItem("isAuthenticated", "true");
      
      // Redirect to the page they were trying to access or home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
      
      toast.success("Successfully logged in");
    } else {
      setError(true);
      toast.error("Incorrect password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <Card className="w-[350px] shadow-lg border-orange-200">
        <CardHeader className="pb-6">
          <div className="flex justify-center mb-4">
            <div className="text-4xl font-bold relative inline-block">
              <span className="text-black">Climate</span>
              <span className="text-orange-500">FAX</span>
              <span className="absolute top-0 right-0 -mt-1 -mr-3 text-xs">®</span>
            </div>
          </div>
          <CardTitle className="text-center text-orange-700">ClimateFAX Access</CardTitle>
          <CardDescription className="text-center text-orange-600">
            Enter your password to access the site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={`${error ? "border-red-500" : "border-orange-200"} focus-visible:ring-orange-500`}
                autoFocus
              />
              
              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Access ClimateFAX
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
