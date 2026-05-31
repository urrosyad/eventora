import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Bell, Bookmark, LogOut, User as UserIcon, Calendar, Compass, ShieldAlert, Award, FileText, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, Notification } from "@/types";

export function TopNavbar() {
  const { user, organization, company, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // Ignore logout errors and proceed with frontend clear
    } finally {
      clearAuth();
      navigate("/");
    }
  };

  // Fetch unread notifications count
  const { data: notificationsData } = useQuery<ApiResponse<{ notifications: Notification[]; unread_count: number }>>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ notifications: Notification[]; unread_count: number }>>("/notifications");
      return res.data;
    },
    enabled: !!user,
    refetchInterval: 15000, // Poll notifications every 15 seconds
  });

  const unreadCount = notificationsData?.data?.unread_count || 0;

  const role = user?.role;
  const isOrg = role === "organisasi";
  const name = isOrg ? organization?.name || "Event Organizer" : company?.name || "Company Admin";

  const getNavLinkClass = (path: string) => {
    const isActive = location.pathname === path || location.pathname.startsWith(path + "/");
    return `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all ${
      isActive
        ? "border-accent-blue text-ink"
        : "border-transparent text-muted-ink hover:text-ink hover:border-border-strong"
    }`;
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center mr-8">
              <Link to="/dashboard" className="text-xl font-bold tracking-tight text-primary-blue">
                Eventora
              </Link>
            </div>

            {/* Navigation links based on role */}
            {user?.is_verified && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {isOrg ? (
                  <>
                    <Link to="/dashboard" className={getNavLinkClass("/dashboard")}>
                      Dashboard
                    </Link>
                    <Link to="/events" className={getNavLinkClass("/events")}>
                      Events
                    </Link>
                    <Link to="/companies" className={getNavLinkClass("/companies")}>
                      Find Sponsors
                    </Link>
                    <Link to="/sponsorships" className={getNavLinkClass("/sponsorships")}>
                      Sponsorships
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className={getNavLinkClass("/dashboard")}>
                      Dashboard
                    </Link>
                    <Link to="/sponsorships" className={getNavLinkClass("/sponsorships")}>
                      Requests
                    </Link>
                    <Link to="/history" className={getNavLinkClass("/history")}>
                      History
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications Bell */}
            {user?.is_verified && (
              <Link
                to="/notifications"
                className="relative p-2 rounded-full text-muted-ink hover:text-ink hover:bg-surface-soft transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-danger rounded-full transform translate-x-1/2 -translate-y-1/2">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Bookmarks link for organizers */}
            {isOrg && user?.is_verified && (
              <Link
                to="/bookmarks"
                className="p-2 rounded-full text-muted-ink hover:text-ink hover:bg-surface-soft transition-colors"
                title="Bookmarked Sponsors"
              >
                <Bookmark className="w-5 h-5" />
              </Link>
            )}

            {/* Profile Menu settings */}
            <Link
              to="/account"
              className="flex items-center space-x-2 text-sm font-medium text-ink px-3 py-1.5 rounded-lg hover:bg-surface-soft transition-colors"
            >
              <UserIcon className="w-4 h-4 text-muted-ink" />
              <span className="hidden md:inline max-w-[120px] truncate">{name}</span>
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-muted-ink hover:text-danger hover:bg-danger/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
