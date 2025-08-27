import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/useAuth";
import { useEffect } from "react";
import { handleRedirectResult } from "./lib/firebase";

// Public Pages
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import TeamPage from "./pages/TeamPage";
import JourneyPage from "./pages/JourneyPage";
import WorkPage from "./pages/WorkPage";
import ContactPage from "./pages/ContactPage";
import BlogPostPage from "./pages/BlogPostPage";

// Admin Pages
import AdminApp from "./pages/admin/AdminApp";
import LoginPage from "./pages/admin/LoginPage";

// 404 Page
import NotFound from "./pages/not-found";

function App() {
  useEffect(() => {
    // Handle Firebase redirect on app load
    handleRedirectResult().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin/*" element={<AdminApp />} />
              
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="team" element={<TeamPage />} />
                <Route path="journey" element={<JourneyPage />} />
                <Route path="journey/:id" element={<BlogPostPage />} />
                <Route path="work" element={<WorkPage />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
