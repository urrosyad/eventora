import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  Layers,
  FileBarChart,
  User,
  LogOut,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";

export function AdminSidebar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // Proceed with frontend clear regardless of backend failure
    } finally {
      clearAuth();
      navigate("/");
    }
  };

  const menuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "User Management", path: "/admin/users", icon: Users },
    { label: "Companies", path: "/admin/companies", icon: Building2 },
    { label: "Organizations", path: "/admin/organizations", icon: Sparkles },
    { label: "Events Moderation", path: "/admin/events", icon: Calendar },
    { label: "Sponsorships", path: "/admin/sponsorships", icon: Layers },
    { label: "Reports & Analytics", path: "/admin/reports", icon: FileBarChart },
    { label: "Account Settings", path: "/admin/account", icon: User },
  ];

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path || location.pathname.startsWith(path + "/");
    return `flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
      isActive
        ? "bg-surface-soft text-primary-blue border-l-2 border-primary-blue rounded-l-none"
        : "text-muted-ink hover:bg-surface-soft hover:text-ink"
    }`;
  };

  return (
    <aside className="w-64 bg-white border-r border-border h-screen sticky top-0 flex flex-col justify-between flex-shrink-0">
      {/* Upper Brand / Nav Section */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <img src="/eventoraLogo.png" alt="EVENTORA" className="h-6 w-auto object-contain" />
            <span className="text-xs font-semibold text-accent-blue px-1.5 py-0.5 bg-soft-blue rounded-md uppercase ml-1.5">Admin</span>
          </Link>
        </div>

        {/* Sidebar Links */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className={getLinkClass(item.path)}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Lower Profile / Action Section */}
      <div className="p-4 border-t border-border bg-surface-soft/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 max-w-[140px]">
            <div className="w-8 h-8 rounded-full bg-primary-blue/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary-blue" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-ink truncate">Administrator</p>
              <p className="text-[10px] text-muted-ink truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-muted-ink hover:text-danger hover:bg-danger/10 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
