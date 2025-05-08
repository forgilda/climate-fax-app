
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SplashPage from "./pages/SplashPage";
import NotFound from "./pages/NotFound";
import ClimateFaxApp from "./pages/ClimateFax";
import ContactPage from "./pages/Contact";
import AboutPage from "./pages/About";
import PasswordEntry from "./components/PasswordEntry";

// Create a client
const queryClient = new QueryClient();

// Define the App component as a function component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if the user was previously authenticated
  useEffect(() => {
    const authenticated = localStorage.getItem("climatefax_authenticated");
    if (authenticated === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle successful password entry
  const handlePasswordCorrect = () => {
    setIsAuthenticated(true);
    localStorage.setItem("climatefax_authenticated", "true");
  };

  // If not authenticated, show password screen
  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner />
          <PasswordEntry 
            correctPassword="CF39M"
            onPasswordCorrect={handlePasswordCorrect}
          />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // If authenticated, show normal app
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner />
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/climate-fax" element={<ClimateFaxApp />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            {/* Redirect /index to splash page */}
            <Route path="/index" element={<Navigate to="/" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
