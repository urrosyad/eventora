import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, EventModel } from "@/types";
import { DataTable } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { toast } from "sonner";
import {
  FileText,
  Calendar,
  CheckCircle,
  EyeOff,
  Trash2,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";

export function AdminEvents() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected event for moderation confirmation dialog
  const [moderateEvent, setModerateEvent] = useState<{
    event: EventModel;
    action: "approve" | "hide" | "remove";
  } | null>(null);

  // Fetch events list
  const { data: eventsData, isLoading } = useQuery<ApiResponse<EventModel[]>>({
    queryKey: ["admin-events", search, statusFilter],
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;

      const res = await api.get<ApiResponse<EventModel[]>>("/events", { params });
      return res.data;
    },
  });

  // Moderation mutation
  const moderationMutation = useMutation({
    mutationFn: async ({ eventId, action }: { eventId: number; action: "approve" | "hide" | "remove" }) => {
      const res = await api.put(`/admin/events/${eventId}/moderate`, { action });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      
      const actionLabel =
        variables.action === "approve"
          ? "approved"
          : variables.action === "hide"
          ? "hidden"
          : "removed";
      toast.success(data.message || `Event successfully ${actionLabel}`);
      setModerateEvent(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Moderation action failed");
      setModerateEvent(null);
    },
  });

  const handleModerateAction = (event: EventModel, action: "approve" | "hide" | "remove") => {
    setModerateEvent({ event, action });
  };

  const columns = [
    {
      header: "ID",
      accessor: (row: EventModel) => <span className="font-semibold text-xs">{row.id}</span>,
    },
    {
      header: "Event Info",
      accessor: (row: EventModel) => (
        <div className="flex flex-col">
          <span className="font-semibold text-ink">{row.name}</span>
          <span className="text-[10px] text-muted-ink">
            Category: {row.category} | Audience: {row.target_audience}
          </span>
        </div>
      ),
    },
    {
      header: "Organizer",
      accessor: (row: EventModel) => (
        <span className="text-xs font-medium text-ink">
          {row.organization?.name || `Org ID: ${row.organization_id}`}
        </span>
      ),
    },
    {
      header: "Proposal",
      accessor: (row: EventModel) => {
        if (row.proposal_url) {
          return (
            <a
              href={row.proposal_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-xs font-semibold text-accent-blue hover:text-primary-blue hover:underline"
            >
              <FileText className="w-4 h-4 mr-1" /> View PDF
            </a>
          );
        }
        return <span className="text-xs text-muted-ink italic">No PDF uploaded</span>;
      },
    },
    {
      header: "Status",
      accessor: (row: EventModel) => <StatusBadge status={row.status} type="event" />,
    },
    {
      header: "Event Date",
      accessor: (row: EventModel) => (
        <span className="text-xs text-muted-ink">
          {row.event_date ? new Date(row.event_date).toLocaleDateString("id-ID") : "-"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row: EventModel) => (
        <div className="flex items-center space-x-2">
          {row.status !== "active" && (
            <button
              onClick={() => handleModerateAction(row, "approve")}
              className="p-1.5 rounded-lg border border-success/30 text-success hover:bg-success/10 transition-colors"
              title="Approve & Publish"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {row.status !== "hidden" && (
            <button
              onClick={() => handleModerateAction(row, "hide")}
              className="p-1.5 rounded-lg border border-warning/30 text-warning hover:bg-warning/10 transition-colors"
              title="Hide from Public"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleModerateAction(row, "remove")}
            className="p-1.5 rounded-lg border border-danger/30 text-danger hover:bg-danger/10 transition-colors"
            title="Delete Permanently"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
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
      <option value="draft">Draft</option>
      <option value="active">Active</option>
      <option value="hidden">Hidden</option>
      <option value="archived">Archived</option>
    </select>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Events Moderation</h1>
        <p className="text-sm text-muted-ink mt-1">
          Review event details, download event proposals, and control public search index visibility.
        </p>
      </div>

      <DataTable
        data={eventsData?.data || []}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search event name..."
        searchValue={search}
        onSearchChange={setSearch}
        filterComponent={filterComponent}
        emptyState={
          <div className="text-center py-12">
            <FolderOpen className="w-8 h-8 mx-auto text-silver mb-2" />
            <p className="text-sm font-medium text-ink">No events found</p>
            <p className="text-xs text-muted-ink mt-1">Adjust filters or search parameters.</p>
          </div>
        }
      />

      {/* Moderation Gate Dialog */}
      {moderateEvent && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setModerateEvent(null)}
          onConfirm={() =>
            moderationMutation.mutate({
              eventId: moderateEvent.event.id,
              action: moderateEvent.action,
            })
          }
          isLoading={moderationMutation.isPending}
          isDanger={moderateEvent.action === "remove"}
          title={
            moderateEvent.action === "approve"
              ? "Approve Event Proposal"
              : moderateEvent.action === "hide"
              ? "Hide Event from Directory"
              : "Permanently Remove Event"
          }
          description={
            <div className="space-y-3">
              <p>
                You are about to modify <span className="font-semibold">{moderateEvent.event.name}</span>.
              </p>
              {moderateEvent.action === "approve" && (
                <p className="text-xs text-muted-ink">
                  Approving this event will make it immediately active and discoverable by corporate sponsors.
                </p>
              )}
              {moderateEvent.action === "hide" && (
                <p className="text-xs text-warning border border-warning/20 bg-orange-soft p-3 rounded-lg flex items-start">
                  <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  Hiding will unpublish it from search results. Bookmarked instances and current applications will remain.
                </p>
              )}
              {moderateEvent.action === "remove" && (
                <p className="text-xs text-danger border border-danger/20 bg-danger/5 p-3 rounded-lg">
                  Warning: Removing an event is a permanent, database-destructive action. All applications related to this event will also be deleted.
                </p>
              )}
            </div>
          }
          confirmLabel={
            moderateEvent.action === "approve"
              ? "Approve & Publish"
              : moderateEvent.action === "hide"
              ? "Hide Event"
              : "Remove Permanently"
          }
          cancelLabel="Cancel"
        />
      )}
    </div>
  );
}
