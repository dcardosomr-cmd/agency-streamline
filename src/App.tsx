import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Permission, UserRole } from "@/types/auth";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import SocialMediaPostDetail from "./pages/SocialMediaPostDetail";
import ClientSocialMediaCalendar from "./pages/ClientSocialMediaCalendar";
import ClientSocialMediaPostDetail from "./pages/ClientSocialMediaPostDetail";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Messages from "./pages/Messages";
import ClientMessages from "./pages/ClientMessages";
import Approvals from "./pages/Approvals";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppRoutes = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />
      
      {/* Onboarding - only accessible if logged in but not completed onboarding */}
      <Route 
        path="/onboarding" 
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : user.hasCompletedOnboarding ? (
            <Navigate to="/" replace />
          ) : (
            <Onboarding />
          )
        } 
      />

      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : !user.hasCompletedOnboarding ? (
            <Navigate to="/onboarding" replace />
          ) : (
            <Index />
          )
        } 
      />
            
      {/* Clients - Only agency users can see all clients */}
      <Route 
        path="/clients" 
        element={
          <ProtectedRoute requiredPermission={Permission.VIEW_ALL_CLIENTS}>
            <Clients />
          </ProtectedRoute>
        } 
      />
      
      {/* Projects - Only agency users */}
      <Route 
        path="/projects" 
        element={
          <ProtectedRoute requiredPermission={Permission.VIEW_ALL_CLIENTS}>
            <Projects />
          </ProtectedRoute>
        } 
      />
      
      {/* Campaigns - Only agency users (who can create content) */}
      <Route 
        path="/campaigns" 
        element={
          <ProtectedRoute requiredPermission={Permission.CREATE_CONTENT}>
            <Campaigns />
          </ProtectedRoute>
        } 
      />
      
      {/* Campaign Detail */}
      <Route 
        path="/campaigns/campaign/:id" 
        element={
          <ProtectedRoute requiredPermission={Permission.CREATE_CONTENT}>
            <CampaignDetail />
          </ProtectedRoute>
        } 
      />
      
      {/* Social Media Post Detail */}
      <Route 
        path="/campaigns/post/:id" 
        element={
          <ProtectedRoute requiredPermission={Permission.CREATE_CONTENT}>
            <SocialMediaPostDetail />
          </ProtectedRoute>
        } 
      />
      
      {/* Client Social Media Calendar */}
      <Route 
        path="/campaigns/calendar" 
        element={
          <ProtectedRoute requiredPermission={Permission.APPROVE_CONTENT}>
            <ClientSocialMediaCalendar />
          </ProtectedRoute>
        } 
      />
      
      {/* Client Social Media Post Detail */}
      <Route 
        path="/campaigns/post/:id/client" 
        element={
          <ProtectedRoute requiredPermission={Permission.APPROVE_CONTENT}>
            <ClientSocialMediaPostDetail />
          </ProtectedRoute>
        } 
      />
      
      {/* Blogs - Only agency users */}
      <Route 
        path="/blogs" 
        element={
          <ProtectedRoute requiredPermission={Permission.CREATE_CONTENT}>
            <Blogs />
          </ProtectedRoute>
        } 
      />
      
      {/* Blog Detail */}
      <Route 
        path="/blogs/:id" 
        element={
          <ProtectedRoute requiredPermission={Permission.CREATE_CONTENT}>
            <BlogDetail />
          </ProtectedRoute>
        } 
      />
      
      {/* Messages - All authenticated users */}
      <Route 
        path="/messages" 
        element={!user ? <Navigate to="/login" replace /> : <Messages />} 
      />
      
      {/* Client Messages */}
      <Route 
        path="/messages/client" 
        element={!user ? <Navigate to="/login" replace /> : <ClientMessages />} 
      />
      
      {/* Approvals - CLIENT_ADMIN and AGENCY_ADMIN can approve */}
      <Route 
        path="/approvals" 
        element={
          <ProtectedRoute requiredPermission={Permission.APPROVE_CONTENT}>
            <Approvals />
          </ProtectedRoute>
        } 
      />
      
      {/* Analytics - CLIENT_ADMIN and agency users */}
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute requiredPermission={Permission.VIEW_ANALYTICS}>
            <Analytics />
          </ProtectedRoute>
        } 
      />
      
      {/* Users/Team - CLIENT_ADMIN and agency users */}
      <Route 
        path="/users" 
        element={
          <ProtectedRoute requiredPermission={Permission.MANAGE_USERS}>
            <Users />
          </ProtectedRoute>
        } 
      />
      
      {/* Billing - CLIENT_ADMIN and AGENCY_ADMIN */}
      <Route 
        path="/billing" 
        element={
          <ProtectedRoute requiredPermission={Permission.BILLING_MANAGEMENT}>
            <Billing />
          </ProtectedRoute>
        } 
      />
      
      {/* Settings - Only agency users */}
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute requiredPermission={Permission.SYSTEM_CONFIG}>
            <Settings />
          </ProtectedRoute>
        } 
      />
      
      {/* Notifications - accessible to all authenticated users */}
      <Route 
        path="/notifications" 
        element={!user ? <Navigate to="/login" replace /> : <Notifications />} 
      />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
