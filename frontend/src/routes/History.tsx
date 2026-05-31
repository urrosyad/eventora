import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable } from "@/components/shared/DataTable";
import { LoadingState } from "@/components/shared/LoadingState";
import { ApiResponse, SponsorshipApplication } from "@/types";
import { History as HistoryIcon, Eye } from "lucide-react";

export function History() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");

  const { data: sponsorshipsRes, isLoading } = useQuery<ApiResponse<SponsorshipApplication[]>>({
    queryKey: ["company-history", search],
    queryFn: async () => {
      // Fetch sponsorships and filter down to historically decided ones
      const res = await api.get<ApiResponse<SponsorshipApplication[]>>("/sponsorships", {
        params: search ? { search } : {},
      });
      return res.data;
    },
    enabled: !!user,
  });

  const sponsorships = sponsorshipsRes?.data || [];
  // Filter only final/decided or cancelled applications for the history tab
  const historyData = sponsorships.filter(
    (s) => s.status === "accepted" || s.status === "rejected" || s.status === "cancelled"
  );

  const columns = [
    {
      header: "Organizer",
      accessor: (row: SponsorshipApplication) => (
        <span className="font-bold text-ink">{row.organization?.name || "Deleted Organizer"}</span>
      ),
    },
    {
      header: "Event",
      accessor: (row: SponsorshipApplication) => (
        <span className="text-muted-ink max-w-[200px] truncate block">{row.event?.name || "Deleted Event"}</span>
      ),
    },
    {
      header: "Support Requested",
      accessor: (row: SponsorshipApplication) => (
        <span className="font-semibold text-primary-blue">{row.support_type_requested}</span>
      ),
    },
    {
      header: "Decision Date",
      accessor: (row: SponsorshipApplication) => (
        <span className="text-xs text-muted-ink">
          {row.decided_at ? new Date(row.decided_at).toLocaleDateString() : "Cancelled"}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row: SponsorshipApplication) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      accessor: (row: SponsorshipApplication) => (
        <button
          onClick={() => navigate(`/sponsorships/${row.id}`)}
          className="inline-flex items-center justify-center p-1.5 border border-border rounded-lg text-muted-ink hover:text-ink hover:bg-surface-soft transition-colors"
          title="Open application inbox"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingState type="page" />;
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-ink tracking-tight flex items-center">
          <HistoryIcon className="w-6 h-6 mr-2 text-primary-blue" />
          Sponsorship Decision History
        </h1>
        <p className="text-xs text-muted-ink mt-0.5">
          Review historical acceptances, rejections, and cancelled partnership proposal threads.
        </p>
      </div>

      {/* Table grid */}
      <DataTable
        data={historyData}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Filter by organizer or event..."
        searchValue={search}
        onSearchChange={setSearch}
        emptyState={
          <div className="text-center py-12 text-sm text-muted-ink leading-relaxed">
            No completed sponsorship applications in history records. Decided requests will populate here.
          </div>
        }
      />
    </div>
  );
}
