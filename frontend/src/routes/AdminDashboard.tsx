import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types";
import {
  Users,
  Building2,
  Calendar,
  Layers,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface SponsorshipStats {
  all: number;
  accepted: number;
  rejected: number;
  pending: number;
  reviewed: number;
}

interface RecentLog {
  type: "user_registered" | "sponsorship_applied" | "event_created";
  description: string;
  created_at: string;
}

interface CategoryAnalytic {
  category: string;
  count: number;
}

interface DashboardStatsResponse {
  stats: {
    total_organizations: number;
    total_companies: number;
    total_active_events: number;
    sponsorships: SponsorshipStats;
  };
  recent_logs: RecentLog[];
  analytics: {
    categories: CategoryAnalytic[];
  };
}

export function AdminDashboard() {
  const [filter, setFilter] = useState<"all" | "today" | "7days" | "30days">("all");

  const { data: dashboardData, isLoading } = useQuery<ApiResponse<DashboardStatsResponse>>({
    queryKey: ["admin-dashboard", filter],
    queryFn: async () => {
      const res = await api.get<ApiResponse<DashboardStatsResponse>>("/admin/dashboard", {
        params: { filter },
      });
      return res.data;
    },
  });

  const stats = dashboardData?.data?.stats;
  const recentLogs = dashboardData?.data?.recent_logs || [];
  const categoryData = dashboardData?.data?.analytics?.categories || [];

  const COLORS = ["#1E3A5F", "#2E86AB", "#A7B4C2", "#EAF4FF", "#1F9D55", "#B7791F"];

  const formatLogTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const timeFilters = [
    { label: "All Time", value: "all" },
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "7days" },
    { label: "Last 30 Days", value: "30days" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-border w-48 rounded-lg animate-pulse" />
          <div className="h-10 bg-border w-64 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-border rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-border rounded-2xl animate-pulse" />
          <div className="h-96 bg-border rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Map sponsorship status details for grid view
  const sponsorshipDetails = [
    {
      label: "Pending Review",
      value: stats?.sponsorships?.pending || 0,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-orange-soft",
      borderColor: "border-warning/20",
    },
    {
      label: "Reviewed",
      value: stats?.sponsorships?.reviewed || 0,
      icon: AlertCircle,
      color: "text-accent-blue",
      bgColor: "bg-soft-blue",
      borderColor: "border-accent-blue/20",
    },
    {
      label: "Accepted (Partners)",
      value: stats?.sponsorships?.accepted || 0,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/5",
      borderColor: "border-success/20",
    },
    {
      label: "Rejected / Declined",
      value: stats?.sponsorships?.rejected || 0,
      icon: XCircle,
      color: "text-danger",
      bgColor: "bg-danger/5",
      borderColor: "border-danger/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header section with title and time filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">System Control Center</h1>
          <p className="text-sm text-muted-ink mt-1">
            Monitor real-time system performance, user sign-ups, and sponsorship statistics.
          </p>
        </div>

        {/* Time Filters */}
        <div className="inline-flex rounded-xl bg-white border border-border p-1 shadow-sm self-start sm:self-center">
          {timeFilters.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setFilter(tf.value as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === tf.value
                  ? "bg-primary-blue text-white shadow"
                  : "text-muted-ink hover:text-ink"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main stats card grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Organizations */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-soft-blue rounded-xl">
            <Building2 className="w-6 h-6 text-primary-blue" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-ink uppercase tracking-wider">
              Total Organizations
            </p>
            <h3 className="text-2xl font-bold text-ink mt-0.5">
              {stats?.total_organizations || 0}
            </h3>
          </div>
        </div>

        {/* Companies */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-soft-blue rounded-xl">
            <Users className="w-6 h-6 text-accent-blue" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-ink uppercase tracking-wider">
              Total Companies
            </p>
            <h3 className="text-2xl font-bold text-ink mt-0.5">
              {stats?.total_companies || 0}
            </h3>
          </div>
        </div>

        {/* Active Events */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-success/10 rounded-xl">
            <Calendar className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-ink uppercase tracking-wider">
              Active Events
            </p>
            <h3 className="text-2xl font-bold text-ink mt-0.5">
              {stats?.total_active_events || 0}
            </h3>
          </div>
        </div>
      </div>

      {/* Sponsorship Application Details Card Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-ink">Sponsorship Performance</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {sponsorshipDetails.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`bg-white border ${item.borderColor} rounded-2xl p-5 shadow-sm relative overflow-hidden`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-muted-ink max-w-[120px]">
                    {item.label}
                  </span>
                  <div className={`p-1.5 rounded-lg ${item.bgColor}`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-ink mt-2">{item.value}</h3>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Charts & Live Activities Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category breakdown (Recharts) */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm lg:col-span-2">
          <h3 className="text-base font-bold text-ink mb-6">Popular Event Categories</h3>
          <div className="h-80 w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F5F7" />
                  <XAxis dataKey="category" tick={{ fill: "#5B6573", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#5B6573", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#FFFFFF",
                      border: "1px solid #E3E7ED",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "#0B0F19",
                    }}
                  />
                  <Bar dataKey="count" fill="#1E3A5F" radius={[4, 4, 0, 0]}>
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-ink">
                No event data available to display categories.
              </div>
            )}
          </div>
        </div>

        {/* Live system logs / activity */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-ink mb-6">Live Activity Log</h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {recentLogs.length > 0 ? (
                recentLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-accent-blue flex-shrink-0" />
                    <div className="flex-grow space-y-0.5">
                      <p className="text-ink leading-relaxed font-medium">
                        {log.description}
                      </p>
                      <p className="text-[10px] text-muted-ink">
                        {formatLogTime(log.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-ink text-center py-12">
                  No recent activities recorded.
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-border mt-4 pt-4 text-center">
            <span className="text-[10px] text-muted-ink uppercase tracking-wider font-semibold">
              Real-time update active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
