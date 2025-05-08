
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import NotFound from "./pages/NotFound";
import ClimateFaxApp from "./pages/ClimateFax";
import ContactPage from "./pages/Contact";
import AboutPage from "./pages/About";

// Create a client
const queryClient = new QueryClient();

// Define the App component as a function component
function App() {
  // Remove all authentication logic - direct access to the app

  // Show normal app without password protection
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
