import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RouteGuard, PublicRoute } from "@/components/auth/RouteGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Login from "./pages/Login";
import Books from "./pages/dashboard/Books";
import Categories from "./pages/dashboard/Categories";
import Authors from "./pages/dashboard/Authors";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <RouteGuard>
                <DashboardLayout />
              </RouteGuard>
            }>
              <Route index element={<Navigate to="/dashboard/books" replace />} />
              <Route path="books" element={<Books />} />
              <Route path="categories" element={<Categories />} />
              <Route path="authors" element={<Authors />} />
              <Route path="management/users" element={
                <RouteGuard requiredRoles={['Admin', 'SuperAdmin']}>
                  <div className="p-8 text-center text-muted-foreground">User management coming soon...</div>
                </RouteGuard>
              } />
              <Route path="management/roles" element={
                <RouteGuard requiredRoles={['SuperAdmin']}>
                  <div className="p-8 text-center text-muted-foreground">Role management coming soon...</div>
                </RouteGuard>
              } />
            </Route>

            {/* Error Pages */}
            <Route path="/forbidden" element={<Forbidden />} />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
