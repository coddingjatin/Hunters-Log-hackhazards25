import React from "react"; // Ensure React is imported first
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { QuestProvider } from "./contexts/QuestContext";
import SystemLanding from "./components/SystemLanding"; // Import SystemLanding
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Store from "./pages/Store";
import ShadowSoldiers from "./pages/ShadowSoldiers";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Define App as a proper React functional component
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <QuestProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<SystemLanding />} /> {/* Add SystemLanding as homepage */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/store" element={
                  <ProtectedRoute>
                    <Store />
                  </ProtectedRoute>
                } />
                <Route path="/shadow-soldiers" element={
                  <ProtectedRoute>
                    <ShadowSoldiers />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />

                {/* Fallback route for undefined paths */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </QuestProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
