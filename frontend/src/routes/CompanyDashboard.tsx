import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ApiResponse, SponsorshipApplication } from "@/types";
import {
  Building2,
  Clock,
  Layers,
  CheckCircle,
  XCircle,
  Inbox,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export function CompanyDashboard() {
  const navigate = useNavigate();
  const { user, company } = useAuthStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all incoming sponsorships sent to this company
  const { data: sponsorshipsRes, isLoading } = useQuery<ApiResponse<SponsorshipApplication[]>>({
    queryKey: ["company-sponsorships", search, statusFilter],
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

  // Aggregated Stats
  const pendingRequests = sponsorships.filter((s) => s.status === "pending");
  const reviewedRequests = sponsorships.filter((s) => s.status === "reviewed");
  const acceptedContracts = sponsorships.filter((s) => s.status === "accepted");
  const rejectedContracts = sponsorships.filter((s) => s.status === "rejected");

  if (isLoading) {
    return <LoadingState type="page" />;
  }

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            Incoming Review Inbox, {company?.name || "Corporate Committee"}
          </h1>
          <p className="text-xs text-muted-ink mt-0.5">
            Review event proposal decks, evaluate target audience metrics, and approve sponsor allocations.
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-border text-xs font-semibold rounded-xl text-ink bg-white hover:bg-surface-soft transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-muted-ink" />
            Filter Inbox
          </button>
        </div>
      </div>

      {/* Corporate Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 bg-yellow-50 text-warning rounded-xl border border-warning/15">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-muted-ink uppercase tracking-wider block">Pending</span>
            <span className="text-xl font-bold text-ink block mt-0.5">{pendingRequests.length}</span>
          </div>
        </div>

        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 bg-soft-blue text-accent-blue rounded-xl border border-accent-blue/15">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-muted-ink uppercase tracking-wider block">Reviewed</span>
            <span className="text-xl font-bold text-ink block mt-0.5">{reviewedRequests.length}</span>
          </div>
        </div>

        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 bg-green-50 text-success rounded-xl border border-success/15">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-muted-ink uppercase tracking-wider block">Accepted</span>
            <span className="text-xl font-bold text-ink block mt-0.5">{acceptedContracts.length}</span>
          </div>
        </div>

        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 bg-red-50 text-danger rounded-xl border border-danger/15">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-muted-ink uppercase tracking-wider block">Rejected</span>
            <span className="text-xl font-bold text-ink block mt-0.5">{rejectedContracts.length}</span>
          </div>
        </div>
      </div>

      {/* Show Inbox Filters */}
      {showFilters && (
        <div className="bg-white border border-border p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-scale-up">
          <div className="relative flex-grow max-w-sm">
            <input
              type="text"
              placeholder="Search organizer or event name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 pl-9 text-xs bg-[#F7F8FA] border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue text-ink placeholder:text-muted-ink"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-silver" />
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            {[
              { label: "All Incoming", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Reviewed", value: "reviewed" },
              { label: "Accepted", value: "accepted" },
              { label: "Rejected", value: "rejected" },
            ].map((stat) => (
              <button
                key={stat.value}
                onClick={() => setStatusFilter(stat.value)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  statusFilter === stat.value
                    ? "bg-accent-blue border-accent-blue text-white shadow-sm"
                    : "bg-white border-border text-muted-ink hover:text-ink hover:border-border-strong"
                }`}
              >
                {stat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Inbox queue list */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-ink border-b border-border pb-2">
          Sponsorship Proposal Inbox Queue
        </h2>

        {sponsorships.length === 0 ? (
          <EmptyState
            title="No sponsorship requests yet"
            description="Incoming applications from event organizers will appear here. Complete your Company Profile preferences so organizers can find you."
            actionLabel="Complete Company Profile"
            onAction={() => navigate("/account")}
            icon={<Inbox className="w-6 h-6 text-silver" />}
          />
        ) : (
          <div className="bg-white border border-border rounded-2xl shadow-sm divide-y divide-border overflow-hidden">
            {sponsorships.map((app) => (
              <div
                key={app.id}
                onClick={() => navigate(`/sponsorships/${app.id}`)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F7F8FA]/60 cursor-pointer transition-colors"
              >
                <div className="text-left space-y-1.5 truncate max-w-xl">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-ink hover:text-accent-blue transition-colors">
                      {app.organization?.name || "Event Organizer"}
                    </h4>
                    {app.status === "pending" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" title="New Application" />
                    )}
                  </div>
                  <p className="text-xs text-muted-ink truncate">
                    Event Target: <span className="font-medium text-ink">{app.event?.name || "Deleted Event"}</span>
                  </p>
                  <p className="text-[10px] text-muted-ink">
                    Requested Support: <span className="font-semibold text-primary-blue">{app.support_type_requested}</span> &bull; Submitted {app.created_at ? new Date(app.created_at).toLocaleDateString() : ""}
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
    </div>
  );
}
