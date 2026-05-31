import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ApiResponse, SponsorshipApplication } from "@/types";
import { SlidersHorizontal, Layers, ChevronRight, Search, Plus } from "lucide-react";

export function SponsorshipTracking() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: sponsorshipsRes, isLoading } = useQuery<ApiResponse<SponsorshipApplication[]>>({
    queryKey: ["organizer-sponsorships", search, statusFilter],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;

      const res = await api.get<ApiResponse<SponsorshipApplication[]>>("/sponsorships", { params });
      return res.data;
    },
    enabled: !!user,
  });

  const sponsorships = sponsorshipsRes?.data || [];

  const statuses = [
    { label: "All Statuses", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Reviewed", value: "reviewed" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
    { label: "Cancelled", value: "cancelled" },
  ];

  if (isLoading) {
    return <LoadingState type="page" />;
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Sponsorship Pipeline</h1>
          <p className="text-xs text-muted-ink mt-0.5">
            Monitor proposal application tracking, trace reviewed statuses, and access approved partner contacts.
          </p>
        </div>
        <Link
          to="/companies"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-xl text-white bg-primary-blue hover:bg-primary-blue/90 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Apply to Sponsors
        </Link>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 border border-border rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 pl-9 text-xs bg-[#F7F8FA] border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue placeholder:text-muted-ink text-ink"
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-silver" />
        </div>

        {/* Status filters */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {statuses.map((stat) => (
            <button
              key={stat.value}
              onClick={() => setStatusFilter(stat.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                statusFilter === stat.value
                  ? "bg-primary-blue border-primary-blue text-white shadow-sm"
                  : "bg-white border-border text-muted-ink hover:text-ink hover:border-border-strong"
              }`}
            >
              {stat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lists */}
      {sponsorships.length === 0 ? (
        <EmptyState
          title="No applications found"
          description="We couldn't find any sponsorship requests matching your active tracking filters. Submit applications to start negotiations."
          actionLabel="Browse Companies"
          onAction={() => navigate("/companies")}
          icon={<Layers className="w-6 h-6 text-silver" />}
        />
      ) : (
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden divide-y divide-border">
          {sponsorships.map((app) => (
            <div
              key={app.id}
              onClick={() => navigate(`/sponsorships/${app.id}`)}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F7F8FA]/60 cursor-pointer transition-colors"
            >
              <div className="space-y-1.5 text-left truncate max-w-xl">
                <h4 className="font-bold text-sm text-ink truncate hover:text-accent-blue transition-colors">
                  {app.company?.name || "Corporate Sponsor"}
                </h4>
                <p className="text-xs text-muted-ink truncate">
                  Event: <span className="font-medium text-ink">{app.event?.name || "Deleted Event"}</span>
                </p>
                <p className="text-[10px] text-muted-ink">
                  Support: <span className="font-semibold text-primary-blue">{app.support_type_requested}</span> &bull; Submitted on {app.created_at ? new Date(app.created_at).toLocaleDateString() : "Awaiting"}
                </p>
              </div>

              <div className="flex items-center space-x-4 flex-shrink-0">
                <StatusBadge status={app.status} />
                <ChevronRight className="w-4 h-4 text-silver" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
