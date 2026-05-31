import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, SponsorshipApplication } from "@/types";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Layers,
  ArrowRight,
  User,
  Building,
  Calendar,
  X,
  FileText,
  Clock,
  Coins,
} from "lucide-react";

export function AdminSponsorshipMonitoring() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Detail dialog state
  const [selectedApplication, setSelectedApplication] = useState<SponsorshipApplication | null>(null);

  // Query to fetch all platform sponsorships
  const { data: sponsorshipsData, isLoading } = useQuery<ApiResponse<SponsorshipApplication[]>>({
    queryKey: ["admin-sponsorships", search, statusFilter],
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;

      const res = await api.get<ApiResponse<SponsorshipApplication[]>>("/admin/sponsorships", {
        params,
      });
      return res.data;
    },
  });

  const columns = [
    {
      header: "ID",
      accessor: (row: SponsorshipApplication) => <span className="font-semibold text-xs">{row.id}</span>,
    },
    {
      header: "Partnership Flow",
      accessor: (row: SponsorshipApplication) => (
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex flex-col">
            <span className="font-semibold text-ink truncate max-w-[130px]" title={row.organization?.name}>
              {row.organization?.name || "Organizer"}
            </span>
            <span className="text-[10px] text-muted-ink">Organizer</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-silver flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-ink truncate max-w-[130px]" title={row.company?.name}>
              {row.company?.name || "Sponsor"}
            </span>
            <span className="text-[10px] text-muted-ink">Corporate</span>
          </div>
        </div>
      ),
    },
    {
      header: "Event",
      accessor: (row: SponsorshipApplication) => (
        <div className="flex flex-col">
          <span className="font-semibold text-ink text-xs truncate max-w-[150px]" title={row.event?.name}>
            {row.event?.name || "Event Name"}
          </span>
          <span className="text-[10px] text-muted-ink bg-surface-soft border border-border px-1.5 py-0.5 rounded self-start mt-0.5">
            {row.event?.category || "General"}
          </span>
        </div>
      ),
    },
    {
      header: "Support Type",
      accessor: (row: SponsorshipApplication) => (
        <span className="text-xs font-semibold text-ink">{row.support_type_requested}</span>
      ),
    },
    {
      header: "Status",
      accessor: (row: SponsorshipApplication) => <StatusBadge status={row.status} type="sponsorship" />,
    },
    {
      header: "Submission Date",
      accessor: (row: SponsorshipApplication) => (
        <span className="text-xs text-muted-ink">
          {row.created_at ? new Date(row.created_at).toLocaleDateString("id-ID") : "-"}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: (row: SponsorshipApplication) => (
        <button
          onClick={() => setSelectedApplication(row)}
          className="px-3 py-1 text-xs font-semibold rounded-lg border border-border text-ink bg-white hover:bg-surface-soft transition-colors"
        >
          Review Details
        </button>
      ),
    },
  ];

  const filterComponent = (
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="px-3 py-1.5 text-xs bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
    >
      <option value="all">All Statuses</option>
      <option value="pending">Pending</option>
      <option value="reviewed">Reviewed</option>
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Sponsorship Applications</h1>
        <p className="text-sm text-muted-ink mt-1">
          Monitor all cross-role application records in read-only audit mode.
        </p>
      </div>

      <DataTable
        data={sponsorshipsData?.data || []}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search by event or company..."
        searchValue={search}
        onSearchChange={setSearch}
        filterComponent={filterComponent}
        emptyState={
          <div className="text-center py-12">
            <Layers className="w-8 h-8 mx-auto text-silver mb-2" />
            <p className="text-sm font-medium text-ink">No sponsorships recorded</p>
            <p className="text-xs text-muted-ink mt-1">Adjust filters or search parameters.</p>
          </div>
        }
      />

      {/* Read-Only Application Detail Dialog */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-muted-ink uppercase tracking-wider">
                  Audit View | Application #{selectedApplication.id}
                </span>
                <h3 className="text-lg font-bold text-ink mt-0.5">Sponsorship Detail</h3>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-1 text-muted-ink hover:text-ink hover:bg-surface-soft rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* Event & Status Row */}
              <div className="flex justify-between items-start gap-4 flex-wrap bg-[#F7F8FA] p-4 rounded-xl border border-border">
                <div>
                  <p className="text-xs text-muted-ink">For Event</p>
                  <p className="font-bold text-ink mt-0.5">{selectedApplication.event?.name || "Event Title"}</p>
                  <p className="text-[10px] text-muted-ink mt-0.5">
                    Category: {selectedApplication.event?.category} | Participants: {selectedApplication.event?.participant_count}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-xs text-muted-ink mb-1">Status</p>
                  <StatusBadge status={selectedApplication.status} type="sponsorship" />
                </div>
              </div>

              {/* Partners details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-ink uppercase tracking-wider text-xs mb-2 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1 text-silver" /> Organisasi Pencari
                  </h4>
                  <p className="font-semibold text-ink">{selectedApplication.organization?.name}</p>
                  <p className="text-xs text-muted-ink mt-0.5">{selectedApplication.organization?.email || "No email"}</p>
                  <p className="text-xs text-muted-ink mt-0.5">
                    {selectedApplication.organization?.city}, {selectedApplication.organization?.province}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-ink uppercase tracking-wider text-xs mb-2 flex items-center">
                    <Building className="w-3.5 h-3.5 mr-1 text-silver" /> Perusahaan Penerima
                  </h4>
                  <p className="font-semibold text-ink">{selectedApplication.company?.name}</p>
                  <p className="text-xs text-muted-ink mt-0.5">{selectedApplication.company?.email || "No email"}</p>
                  <p className="text-xs text-muted-ink mt-0.5">
                    {selectedApplication.company?.city}, {selectedApplication.company?.province}
                  </p>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <h4 className="font-bold text-ink uppercase tracking-wider text-xs mb-2 flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1 text-silver" /> Cover Letter (Surat Pengantar)
                </h4>
                <p className="text-muted-ink leading-relaxed bg-[#F7F8FA] p-4 rounded-xl border border-border whitespace-pre-line text-xs">
                  {selectedApplication.cover_letter || "No cover letter provided."}
                </p>
              </div>

              {/* Additional message / feedback */}
              {(selectedApplication.additional_message || selectedApplication.response_message) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
                  {selectedApplication.additional_message && (
                    <div>
                      <h4 className="font-semibold text-ink text-xs mb-1">Additional Message</h4>
                      <p className="text-xs text-muted-ink leading-relaxed">
                        {selectedApplication.additional_message}
                      </p>
                    </div>
                  )}
                  {selectedApplication.response_message && (
                    <div>
                      <h4 className="font-semibold text-ink text-xs mb-1">Sponsor Response Feedback</h4>
                      <p className="text-xs text-muted-ink leading-relaxed">
                        {selectedApplication.response_message}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Metadata dates */}
              <div className="grid grid-cols-3 gap-2 border-t border-border pt-4 text-xs text-muted-ink">
                <div>
                  <span className="block font-semibold">Submitted</span>
                  <span>{selectedApplication.created_at ? new Date(selectedApplication.created_at).toLocaleString("id-ID") : "-"}</span>
                </div>
                <div>
                  <span className="block font-semibold">Reviewed</span>
                  <span>{selectedApplication.reviewed_at ? new Date(selectedApplication.reviewed_at).toLocaleString("id-ID") : "-"}</span>
                </div>
                <div>
                  <span className="block font-semibold">Decided</span>
                  <span>{selectedApplication.decided_at ? new Date(selectedApplication.decided_at).toLocaleString("id-ID") : "-"}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-[#F7F8FA] flex justify-between items-center text-[10px] text-muted-ink uppercase font-semibold">
              <span>Read-Only Audit Monitor</span>
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-border text-ink bg-white hover:bg-surface-soft transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
