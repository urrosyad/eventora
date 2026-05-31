import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useAuthStore } from "@/stores/authStore";

// Layouts & Guards
import { LandingLayout } from "@/components/layout/LandingLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { RoleRoute } from "@/components/layout/RoleRoute";
import { ProfileCompletionGuard } from "@/components/layout/ProfileCompletionGuard";

// Public Pages
import { LandingPage } from "@/routes/LandingPage";
import { Login } from "@/routes/Login";
import { Register } from "@/routes/Register";
import { AboutPage, ForbiddenPage, NotFoundPage } from "@/routes/ErrorPages";

// Shared Protected Routes
import { ProfileCompletion } from "@/routes/ProfileCompletion";
import { Account } from "@/routes/Account";
import { Notifications } from "@/routes/Notifications";

// Organizer Routes
import { OrganizerDashboard } from "@/routes/OrganizerDashboard";
import { EventList } from "@/routes/EventList";
import { EventCreateEdit } from "@/routes/EventCreateEdit";
import { CompanyDiscovery } from "@/routes/CompanyDiscovery";
import { BookmarksList } from "@/routes/BookmarksList";

// Company Routes
import { CompanyDashboard } from "@/routes/CompanyDashboard";
import { History } from "@/routes/History";

// Shared Business Flow Routes
import { EventDetail } from "@/routes/EventDetail";
import { CompanyDetail } from "@/routes/CompanyDetail";
import { SponsorshipTracking } from "@/routes/SponsorshipTracking";
import { SponsorshipDetail } from "@/routes/SponsorshipDetail";

// Admin Panel Routes
import { AdminDashboard } from "@/routes/AdminDashboard";
import { AdminUsers } from "@/routes/AdminUsers";
import { AdminCompanies } from "@/routes/AdminCompanies";
import { AdminOrganizations } from "@/routes/AdminOrganizations";
import { AdminEvents } from "@/routes/AdminEvents";
import { AdminSponsorshipMonitoring } from "@/routes/AdminSponsorshipMonitoring";
import { AdminReports } from "@/routes/AdminReports";
import { AdminAccount } from "@/routes/AdminAccount";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes default
    },
  },
});

// Switches dashboard path based on active user role
function DashboardSwitcher() {
  const { user } = useAuthStore();
  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (user?.role === "organisasi") {
    return <OrganizerDashboard />;
  }
  if (user?.role === "perusahaan") {
    return <CompanyDashboard />;
  }
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* =========================================================================
              PUBLIC / GUEST ROUTING (Landing Layout)
             ========================================================================= */}
          <Route
            element={
              <LandingLayout>
                <Outlet />
              </LandingLayout>
            }
          >
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/404" element={<NotFoundPage />} />
          </Route>

          {/* =========================================================================
              AUTHENTICATED APP ROUTING (Dashboard Layout)
             ========================================================================= */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Outlet />
                </DashboardLayout>
              </ProtectedRoute>
            }
          >
            {/* Profile completion (guarded to only allow incomplete profiles) */}
            <Route
              path="/profile-completion"
              element={
                <ProfileCompletionGuard shouldBeComplete={false}>
                  <ProfileCompletion />
                </ProfileCompletionGuard>
              }
            />

            {/* General Dashboard & Settings (Requires complete profile) */}
            <Route
              element={
                <ProfileCompletionGuard shouldBeComplete={true}>
                  <Outlet />
                </ProfileCompletionGuard>
              }
            >
              <Route path="/dashboard" element={<DashboardSwitcher />} />
              <Route path="/account" element={<Account />} />
              <Route path="/notifications" element={<Notifications />} />

              {/* Shared detail viewing */}
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/companies/:id" element={<CompanyDetail />} />
              <Route path="/sponsorships" element={<SponsorshipTracking />} />
              <Route path="/sponsorships/:id" element={<SponsorshipDetail />} />

              {/* Organizer-only routes */}
              <Route
                element={
                  <RoleRoute allowedRoles={["organisasi"]}>
                    <Outlet />
                  </RoleRoute>
                }
              >
                <Route path="/events" element={<EventList />} />
                <Route path="/events/create" element={<EventCreateEdit />} />
                <Route path="/events/:id/edit" element={<EventCreateEdit />} />
                <Route path="/companies" element={<CompanyDiscovery />} />
                <Route path="/bookmarks" element={<BookmarksList />} />
              </Route>

              {/* Company-only routes */}
              <Route
                element={
                  <RoleRoute allowedRoles={["perusahaan"]}>
                    <Outlet />
                  </RoleRoute>
                }
              >
                <Route path="/history" element={<History />} />
              </Route>
            </Route>
          </Route>

          {/* =========================================================================
              PLATFORM ADMINISTRATOR PANEL (Admin Layout)
             ========================================================================= */}
          <Route
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <AdminLayout>
                    <Outlet />
                  </AdminLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/companies" element={<AdminCompanies />} />
            <Route path="/admin/organizations" element={<AdminOrganizations />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/sponsorships" element={<AdminSponsorshipMonitoring />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/account" element={<AdminAccount />} />
          </Route>

          {/* Fallback wildcard redirect to 404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
      
      {/* Toast alert system notifications */}
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
