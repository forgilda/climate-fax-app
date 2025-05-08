
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Key } from "lucide-react";

const PASSWORD = "climate2025"; // Hard-coded password

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === PASSWORD) {
      // Set authentication in localStorage
      localStorage.setItem("isAuthenticated", "true");
      
      // Redirect to the page they were trying to access or home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
      
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
    } else {
      setError(true);
      toast({
        title: "Error",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Card className="w-[350px]">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Key className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-center">Password Protected</CardTitle>
          <CardDescription className="text-center">
            Enter the password to access the site
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
                className={error ? "border-red-500" : ""}
                autoFocus
              />
              
              <Button type="submit" className="w-full">
                Access Site
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
