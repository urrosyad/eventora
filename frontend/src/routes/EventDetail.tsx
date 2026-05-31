import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ApiResponse, EventModel, SponsorshipApplication } from "@/types";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Target,
  Layers,
  Award,
  Download,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  Archive,
  ChevronRight,
  Info,
  FileText,
} from "lucide-react";

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Event Details
  const { data: eventRes, isLoading, refetch } = useQuery<ApiResponse<EventModel>>({
    queryKey: ["event-detail", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<EventModel>>(`/events/${id}`);
      return res.data;
    },
    enabled: !!id && !!user,
  });

  // Fetch sponsorships associated with this specific event
  const { data: sponsorshipsRes } = useQuery<ApiResponse<SponsorshipApplication[]>>({
    queryKey: ["event-sponsorships", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<SponsorshipApplication[]>>(`/sponsorships?event_id=${id}`);
      return res.data;
    },
    enabled: !!id && !!user,
  });

  const event = eventRes?.data;
  const sponsorships = sponsorshipsRes?.data || [];

  // Check if there are active sponsorships (pending, reviewed, accepted)
  const hasActiveSponsorships = sponsorships.some(
    (s) => s.status === "pending" || s.status === "reviewed" || s.status === "accepted"
  );

  const handleStatusChange = async (newStatus: "active" | "archived") => {
    if (!id) return;
    setStatusLoading(true);
    try {
      await api.put(`/events/${id}/status`, { status: newStatus });
      toast.success(`Event successfully changed to ${newStatus}!`);
      refetch();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to update event status.");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event successfully deleted!");
      navigate("/events");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to delete event.");
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (isLoading || !event) {
    return <LoadingState type="page" />;
  }

  // File path resolving utility for local disk proposal
  const getProposalUrl = () => {
    if (!event.proposal_path) return "#";
    // Check if it's already a full URL, otherwise append storage path prefix
    if (event.proposal_path.startsWith("http")) return event.proposal_path;
    return `http://127.0.0.1:8000/storage/${event.proposal_path}`;
  };

  return (
    <div className="space-y-6 text-left">
      {/* Back button */}
      <Link
        to="/events"
        className="inline-flex items-center text-xs font-semibold text-muted-ink hover:text-ink transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Back to Events List
      </Link>

      {/* Header Panel */}
      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4 md:space-y-0 md:flex md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-3 flex-wrap gap-y-1">
            <span className="text-xs font-semibold text-primary-blue bg-soft-blue px-2 py-0.5 rounded border border-primary-blue/15">
              {event.category}
            </span>
            <StatusBadge status={event.status} type="event" />
          </div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">{event.name}</h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 flex-shrink-0 flex-wrap gap-y-2">
          <Link
            to={`/events/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-border text-xs font-semibold rounded-xl text-ink bg-white hover:bg-surface-soft transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
            Edit Profile
          </Link>

          {/* Delete action guard */}
          <button
            onClick={() => setDeleteOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-danger/25 text-xs font-semibold rounded-xl text-danger bg-white hover:bg-danger/5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Delete Event
          </button>
        </div>
      </div>

      {/* Primary Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-6">
            <div className="space-y-2">
              <h2 className="text-base font-bold text-ink border-b border-border pb-2">
                Event Description
              </h2>
              <p className="text-sm text-muted-ink leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Demographics details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-surface-soft text-muted-ink rounded-lg">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-ink block">Target Audience</span>
                  <span className="text-xs font-bold text-ink block">{event.target_audience}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-surface-soft text-muted-ink rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-ink block">Expected Participants</span>
                  <span className="text-xs font-bold text-ink block">
                    {event.participant_count.toLocaleString("en-US")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Proposal Download File */}
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-50 text-danger rounded-xl border border-danger/10">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-ink">Sponsorship Pitch Deck</h4>
                <p className="text-[10px] text-muted-ink mt-0.5">
                  Format: PDF document &bull; Click to preview/download.
                </p>
              </div>
            </div>
            {event.proposal_path ? (
              <a
                href={getProposalUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 border border-border text-xs font-bold rounded-xl text-ink bg-white hover:bg-surface-soft transition-colors"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-muted-ink" />
                Download PDF
              </a>
            ) : (
              <span className="text-xs text-danger font-semibold">No Proposal Deck Attached</span>
            )}
          </div>

          {/* Sponsorship applications lists for this event */}
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 bg-surface-soft border-b border-border">
              <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
                Event Sponsorship Tracker Pipeline
              </h3>
            </div>
            <div className="divide-y divide-border">
              {sponsorships.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-ink leading-relaxed">
                  No applications sent to corporate sponsors for this event yet. Browse company sponsor list to apply.
                </div>
              ) : (
                sponsorships.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => navigate(`/sponsorships/${app.id}`)}
                    className="p-4 flex items-center justify-between hover:bg-[#F7F8FA] cursor-pointer transition-colors"
                  >
                    <div className="text-left space-y-1">
                      <span className="font-bold text-sm text-ink hover:text-accent-blue transition-colors block">
                        {app.company?.name || "Corporate Sponsor"}
                      </span>
                      <span className="text-[10px] text-muted-ink block">
                        Support requested: <span className="font-semibold text-primary-blue">{app.support_type_requested}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <StatusBadge status={app.status} />
                      <ChevronRight className="w-4 h-4 text-silver" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right side widgets: Status Flow, Details */}
        <div className="space-y-6">
          {/* Status state machine controller */}
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-ink border-b border-border pb-2">
              Pipeline Status & Moderation
            </h3>

            {statusLoading ? (
              <LoadingState />
            ) : (
              <div className="space-y-3">
                {event.status === "draft" && (
                  <>
                    <p className="text-[11px] text-muted-ink leading-relaxed">
                      Your event is currently a Draft and hidden from the public directories. Publish it to enable sponsorship applications.
                    </p>
                    <button
                      onClick={() => handleStatusChange("active")}
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold rounded-xl text-white bg-success hover:bg-success/90 shadow-sm transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      Publish Event (Set Active)
                    </button>
                  </>
                )}

                {event.status === "active" && (
                  <>
                    <p className="text-[11px] text-muted-ink leading-relaxed">
                      Your event is Active and visible to company committees in directories. Archive it if negotiations are finalized.
                    </p>
                    <button
                      onClick={() => handleStatusChange("archived")}
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold rounded-xl border border-border text-ink bg-white hover:bg-surface-soft transition-colors"
                    >
                      <Archive className="w-3.5 h-3.5 mr-1.5 text-muted-ink" />
                      Archive Event
                    </button>
                  </>
                )}

                {event.status === "archived" && (
                  <>
                    <p className="text-[11px] text-muted-ink leading-relaxed">
                      Your event is Archived. Active proposals are frozen. Re-activate it to resume operations.
                    </p>
                    <button
                      onClick={() => handleStatusChange("active")}
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold rounded-xl text-white bg-primary-blue hover:bg-primary-blue/90 shadow-sm transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      Re-activate Event (Set Active)
                    </button>
                  </>
                )}

                {event.status === "hidden" && (
                  <div className="p-3 bg-red-50 border border-danger/10 text-danger rounded-xl flex items-start space-x-2">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed">
                      This event has been Hidden by platform moderators. Review content guidelines. Send a contact inquiry to support if this is a mistake.
                    </p>
                  </div>
                )}

                {event.status === "removed" && (
                  <div className="p-3 bg-red-50 border border-danger/10 text-danger rounded-xl flex items-start space-x-2">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed">
                      This event has been Removed permanently by platform moderators. Access has been frozen.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Specifications Info Panel */}
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-ink border-b border-border pb-2">
              Implementation Metrics
            </h3>

            <div className="space-y-3.5 text-xs text-muted-ink">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-silver mr-2" />
                  Province
                </span>
                <span className="font-bold text-ink">{event.province}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-silver mr-2" />
                  City / Location
                </span>
                <span className="font-bold text-ink">{event.city}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 text-silver mr-2" />
                  Activity Date
                </span>
                <span className="font-bold text-ink">{new Date(event.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="flex items-center">
                  <Award className="w-3.5 h-3.5 text-silver mr-2" />
                  Budget Range
                </span>
                <span className="font-bold text-primary-blue bg-soft-blue px-2 py-0.5 rounded text-[10px]">{event.budget_range}</span>
              </div>
              <div className="space-y-1.5 pt-1">
                <span className="flex items-center">
                  <Layers className="w-3.5 h-3.5 text-silver mr-2" />
                  Needed Support Scopes
                </span>
                <div className="flex flex-wrap gap-1.5 pl-5.5">
                  {event.support_types_needed.map((scope) => (
                    <span
                      key={scope}
                      className="px-2 py-0.5 bg-surface-soft border border-border rounded text-[10px] text-ink font-semibold"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete action guard confirm dialog */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Event Profile"
        isDanger={true}
        isLoading={isDeleting}
        confirmLabel="Delete Permanently"
        description={
          hasActiveSponsorships ? (
            <div className="space-y-2 text-danger">
              <p className="font-semibold">&bull; Action Blocked!</p>
              <p className="text-xs">
                This event currently has active sponsorship applications (pending, reviewed, or accepted) with partner companies. Events with active pipelines cannot be deleted.
              </p>
              <p className="text-xs font-bold">
                Recommendation: Change the status to "Archived" instead. This will hide it from new applications while preserving historical records.
              </p>
            </div>
          ) : (
            <span className="text-xs">
              Are you absolutely sure you want to permanently delete <strong>{event.name}</strong>? This action will erase all linked metadata details and cannot be undone.
            </span>
          )
        }
      />
    </div>
  );
}
