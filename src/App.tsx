
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import NotFound from "./pages/NotFound";
import ClimateFaxApp from "./pages/ClimateFax";
import ContactPage from "./pages/Contact";
import AboutPage from "./pages/About";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a client
const queryClient = new QueryClient();

// Define the App component as a function component
function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Public Routes - No login required */}
            <Route path="/" element={<SplashPage />} />
            <Route path="/climate-fax" element={<ClimateFaxApp />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Keep login available but not required */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin dashboard - keep protected for now */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
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
