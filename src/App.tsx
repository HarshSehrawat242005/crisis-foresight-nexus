
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Simple mock auth state for demo purposes
  // In a real app, this would be managed by a proper auth provider
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // Check for authentication on app load
  useEffect(() => {
    // Simulate an auth check
    const checkAuth = async () => {
      // For demo, consider the user logged in (no actual auth is implemented)
      // In a real app, this would check tokens, session state, etc.
      
      // Comment this line to require login:
      setIsAuthenticated(true);
      
      // Uncomment to require login:
      // setIsAuthenticated(false);
    };
    
    checkAuth();
  }, []);
  
  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={isAuthenticated ? <Navigate to="/" /> : <Auth />} />
            <Route path="/" element={isAuthenticated ? <Index /> : <Navigate to="/auth" />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
