import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import DashboardPage from "./DashboardPage";
import ThemeEditor from "./ThemeEditor";
import TeamManagement from "./TeamManagement";
import ServicesManagement from "./ServicesManagement";
import JourneyManagement from "./JourneyManagement";
import WorkManagement from "./WorkManagement";
import LoginPage from "./LoginPage";

export default function AdminApp() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <MantineProvider>
      <Notifications />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/theme" element={<ThemeEditor />} />
        <Route path="/team" element={<TeamManagement />} />
        <Route path="/services" element={<ServicesManagement />} />
        <Route path="/journey" element={<JourneyManagement />} />
        <Route path="/work" element={<WorkManagement />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </MantineProvider>
  );
}
