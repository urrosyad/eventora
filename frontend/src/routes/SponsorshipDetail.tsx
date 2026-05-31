import { useState } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ApiResponse, SponsorshipApplication, PitchingSession } from "@/types";
import {
  ArrowLeft,
  Calendar,
  Building2,
  MapPin,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Mail,
  Phone,
  Globe,
  Plus,
  Video,
  Info,
  ChevronRight,
  Loader2,
  Trash2,
  CalendarDays,
} from "lucide-react";

export function SponsorshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { user, organization, company } = useAuthStore();

  const [cancelOpen, setCancelOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Pitching form States
  const [pitchingType, setPitchingType] = useState<"online" | "offline">("online");
  const [meetLink, setMeetLink] = useState("");
  const [location, setLocation] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmittingPitching, setIsSubmittingPitching] = useState(false);
  const [showPitchingForm, setShowPitchingForm] = useState(searchParams.get("schedule") === "pitching");

  // 1. Fetch Sponsorship application details
  const { data: appRes, isLoading, refetch } = useQuery<ApiResponse<SponsorshipApplication>>({
    queryKey: ["sponsorship-detail", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<SponsorshipApplication>>(`/sponsorships/${id}`);
      return res.data;
    },
    enabled: !!id && !!user,
  });

  const app = appRes?.data;
  const isOrg = user?.role === "organisasi";
  const isCompanyActor = user?.role === "perusahaan";

  // Mutate: Cancel Application
  const cancelMutation = useMutation({
    mutationFn: async () => {
      await api.put(`/sponsorships/${id}/cancel`);
    },
    onSuccess: () => {
      toast.success("Sponsorship application cancelled successfully.");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["organizer-sponsorships"] });
      setCancelOpen(false);
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.message || "Failed to cancel application.");
      setCancelOpen(false);
    },
  });

  // Mutate: Decide Sponsorship (Accept/Reject for corporate committees)
  const [decideStatus, setDecideStatus] = useState<"accepted" | "rejected" | null>(null);
  const [decideMessage, setDecideMessage] = useState("");
  const [decideOpen, setDecideOpen] = useState(false);
  const [isDeciding, setIsDeciding] = useState(false);

  const decideMutation = useMutation({
    mutationFn: async () => {
      if (!decideStatus) return;
      await api.put(`/sponsorships/${id}/decide`, {
        status: decideStatus,
        response_message: decideMessage,
      });
    },
    onSuccess: () => {
      toast.success(`Application successfully ${decideStatus}!`);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["company-sponsorships"] });
      setDecideOpen(false);
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.message || "Failed to finalize decision.");
      setDecideOpen(false);
    },
  });

  // Mutate: Schedule Pitching Session
  const handlePitchingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledAt) {
      toast.error("Please select a meeting date and time.");
      return;
    }
    if (pitchingType === "online" && !meetLink.trim()) {
      toast.error("Please provide a Google Meet meeting link.");
      return;
    }
    if (pitchingType === "offline" && !location.trim()) {
      toast.error("Please provide a physical meeting location address.");
      return;
    }

    setIsSubmittingPitching(true);
    try {
      await api.post("/pitching", {
        sponsorship_application_id: app?.id,
        type: pitchingType,
        meet_link: pitchingType === "online" ? meetLink : null,
        location: pitchingType === "offline" ? location : null,
        scheduled_at: scheduledAt,
        notes: notes,
      });

      toast.success("Pitching meeting scheduled successfully!");
      setShowPitchingForm(false);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to schedule pitching session.");
    } finally {
      setIsSubmittingPitching(false);
    }
  };

  if (isLoading || !app) {
    return <LoadingState type="page" />;
  }

  // File path resolving utility for PDF proposal
  const getProposalUrl = () => {
    if (!app.event?.proposal_path) return "#";
    if (app.event.proposal_path.startsWith("http")) return app.event.proposal_path;
    return `http://127.0.0.1:8000/storage/${app.event.proposal_path}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Back button */}
      <Link
        to={isOrg ? "/sponsorships" : "/dashboard"}
        className="inline-flex items-center text-xs font-semibold text-muted-ink hover:text-ink transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Back to Pipeline Inbox
      </Link>

      {/* Corporate Overview header */}
      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4 md:space-y-0 md:flex md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-primary-blue bg-soft-blue px-2 py-0.5 rounded border border-primary-blue/15">
              Event Profile: {app.event?.name}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            {isOrg ? app.company?.name : app.organization?.name}
          </h1>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <StatusBadge status={app.status} />
          
          {/* Cancel button action for Organizers */}
          {isOrg && (app.status === "pending" || app.status === "reviewed") && (
            <button
              onClick={() => setCancelOpen(true)}
              className="px-4 py-2 border border-danger/25 text-xs font-semibold rounded-xl text-danger bg-white hover:bg-danger/5 transition-colors"
            >
              Cancel Application
            </button>
          )}
        </div>
      </div>

      {/* Decision Board for Corporate Committees */}
      {isCompanyActor && (app.status === "pending" || app.status === "reviewed") && (
        <div className="bg-white border border-accent-blue/20 p-6 rounded-2xl shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-accent-blue" />
          <h3 className="text-sm font-bold text-ink flex items-center">
            <Clock className="w-4 h-4 mr-2 text-accent-blue animate-pulse" />
            Awaiting Committee Decision
          </h3>
          <p className="text-xs text-muted-ink leading-relaxed">
            As a verified Company Sponsor, you can accept or reject this sponsorship application. Make sure to download and review their PDF proposal pitch deck before submitting your decision.
          </p>
          
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => {
                setDecideStatus("accepted");
                setDecideOpen(true);
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-success hover:bg-success/90 shadow-sm transition-all"
            >
              Accept Proposal
            </button>
            <button
              onClick={() => {
                setDecideStatus("rejected");
                setDecideOpen(true);
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-danger hover:bg-danger/90 shadow-sm transition-all"
            >
              Reject Proposal
            </button>
          </div>
        </div>
      )}

      {/* Pipeline Visual Timeline */}
      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-ink border-b border-border pb-2">
          Application Tracking Log
        </h3>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative p-4 bg-background/50 border border-border/40 rounded-xl">
          <div className="flex items-center space-x-3 text-xs text-muted-ink">
            <Clock className="w-4 h-4 text-silver" />
            <div>
              <span className="font-bold text-ink block">Submitted Application</span>
              <span>{app.created_at ? new Date(app.created_at).toLocaleString() : "Awaiting sync"}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-muted-ink">
            <Eye className="w-4 h-4 text-silver" />
            <div>
              <span className="font-bold text-ink block">Reviewed By Sponsor</span>
              <span>{app.reviewed_at ? new Date(app.reviewed_at).toLocaleString() : "Awaiting review"}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-muted-ink">
            <CheckCircle className="w-4 h-4 text-silver" />
            <div>
              <span className="font-bold text-ink block">Decision Finalized</span>
              <span>{app.decided_at ? new Date(app.decided_at).toLocaleString() : "Pending decision"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details and Letter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover Letter */}
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-ink border-b border-border pb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-primary-blue" />
              Surat Pengantar (Cover Letter)
            </h3>
            <p className="text-sm text-muted-ink leading-relaxed whitespace-pre-line bg-surface-soft/40 p-4 rounded-xl border border-border/30">
              {app.cover_letter}
            </p>
            {app.additional_message && (
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-ink block">Additional Message:</span>
                <p className="text-xs text-muted-ink leading-relaxed bg-surface-soft/20 p-3 rounded-lg">
                  {app.additional_message}
                </p>
              </div>
            )}
          </div>

          {/* Proposal Download Deck */}
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-50 text-danger rounded-xl border border-danger/10">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-ink">Pitch Deck Proposal</h4>
                <p className="text-[10px] text-muted-ink mt-0.5">
                  Format: PDF document &bull; Review audience and budget metrics.
                </p>
              </div>
            </div>
            {app.event?.proposal_path ? (
              <a
                href={getProposalUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 border border-border text-xs font-bold rounded-xl text-ink bg-white hover:bg-surface-soft transition-colors"
              >
                Download PDF
              </a>
            ) : (
              <span className="text-xs text-danger font-semibold">No Proposal Deck Attached</span>
            )}
          </div>

          {/* Company Response Message if Decided */}
          {app.response_message && (
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-ink border-b border-border pb-2 flex items-center">
                <Info className="w-4 h-4 mr-2 text-primary-blue" />
                Sponsor Committee Decision Notes
              </h3>
              <p className="text-xs text-muted-ink leading-relaxed bg-surface-soft/60 p-4 rounded-xl border border-border/40 font-medium">
                {app.response_message}
              </p>
            </div>
          )}
        </div>

        {/* Right side contact information / pitching */}
        <div className="space-y-6">
          {/* Support specs */}
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-ink border-b border-border pb-2">
              Requested Support Type
            </h3>
            <span className="inline-block px-3 py-1.5 bg-soft-blue border border-primary-blue/15 text-xs font-bold text-primary-blue rounded-xl">
              {app.support_type_requested}
            </span>
          </div>

          {/* Contact activation upon Accepted */}
          {app.status === "accepted" ? (
            <div className="bg-white border border-success/20 p-6 rounded-2xl shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-1 w-full bg-success" />
              <h3 className="text-sm font-bold text-ink border-b border-border pb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-success" />
                Unlocked Legal Contacts
              </h3>
              
              <div className="space-y-3 text-xs text-muted-ink">
                {isOrg ? (
                  // Display Company Contacts
                  <>
                    <p className="text-[10px] leading-relaxed">
                      Sponsorship has been accepted. Contact their business representative directly to draft legal partnership agreements.
                    </p>
                    {app.company?.email && (
                      <div>
                        <span className="text-[9px] block">Corporate Email</span>
                        <span className="font-semibold text-ink block mt-0.5 select-all">{app.company.email}</span>
                      </div>
                    )}
                    {app.company?.phone && (
                      <div>
                        <span className="text-[9px] block">Direct Telephone</span>
                        <span className="font-semibold text-ink block mt-0.5 select-all">{app.company.phone}</span>
                      </div>
                    )}
                    {app.company?.website && (
                      <div>
                        <span className="text-[9px] block">Website Portal</span>
                        <a href={app.company.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent-blue block mt-0.5 hover:underline">
                          {app.company.website}
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  // Display Organizer Contacts
                  <>
                    <p className="text-[10px] leading-relaxed">
                      Sponsorship has been accepted. Contact the event organizing committee to draft terms.
                    </p>
                    {app.organization?.email && (
                      <div>
                        <span className="text-[9px] block">Committee Email</span>
                        <span className="font-semibold text-ink block mt-0.5 select-all">{app.organization.email}</span>
                      </div>
                    )}
                    {app.organization?.phone && (
                      <div>
                        <span className="text-[9px] block">Event Lead Telephone</span>
                        <span className="font-semibold text-ink block mt-0.5 select-all">{app.organization.phone}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Pitching details or schedule trigger */}
              {isOrg && !app.pitching_session && (
                <div className="pt-2">
                  <button
                    onClick={() => setShowPitchingForm(true)}
                    className="w-full inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold rounded-xl text-white bg-success hover:bg-success/90 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Schedule Pitching Meeting
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-3 text-center">
              <Clock className="w-6 h-6 text-silver mx-auto mb-2" />
              <h4 className="text-xs font-bold text-ink">Contacts Locked</h4>
              <p className="text-[10px] text-muted-ink leading-relaxed">
                Contact information unlocks immediately upon committee sponsorship approval.
              </p>
            </div>
          )}

          {/* Active Pitching Session details if scheduled */}
          {app.pitching_session && (
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-ink border-b border-border pb-2 flex items-center">
                <CalendarDays className="w-4 h-4 mr-2 text-primary-blue" />
                Scheduled Pitching Session
              </h3>
              
              <div className="space-y-3 text-xs text-muted-ink text-left">
                <div>
                  <span className="text-[9px] block">Meeting Type</span>
                  <span className="font-bold text-ink uppercase block mt-0.5">
                    {app.pitching_session.type}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] block">Scheduled Date & Time</span>
                  <span className="font-bold text-ink block mt-0.5">
                    {new Date(app.pitching_session.scheduled_at).toLocaleString()}
                  </span>
                </div>
                {app.pitching_session.type === "online" ? (
                  <div>
                    <span className="text-[9px] block">Google Meet Invitation Link</span>
                    <a
                      href={app.pitching_session.meet_link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-accent-blue block mt-0.5 hover:underline truncate"
                    >
                      {app.pitching_session.meet_link || "Link not synced"}
                    </a>
                  </div>
                ) : (
                  <div>
                    <span className="text-[9px] block">Physical Location Address</span>
                    <span className="font-semibold text-ink block mt-0.5">
                      {app.pitching_session.location || "Location not synced"}
                    </span>
                  </div>
                )}
                {app.pitching_session.notes && (
                  <div>
                    <span className="text-[9px] block">Meeting agenda notes</span>
                    <p className="text-[10px] text-muted-ink bg-surface-soft p-2 rounded mt-1">
                      {app.pitching_session.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic inline pitching creation form overlay */}
      {showPitchingForm && isOrg && !app.pitching_session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-md w-full overflow-hidden p-6 animate-scale-up text-left">
            <h3 className="text-lg font-bold text-ink mb-2">Schedule Pitching Meeting</h3>
            <p className="text-xs text-muted-ink mb-4">
              Coordinate an online video call or face-to-face workshop with {app.company?.name} representatives.
            </p>

            <form onSubmit={handlePitchingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Meeting Type</label>
                <div className="grid grid-cols-2 gap-2 bg-surface-soft p-1 rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => setPitchingType("online")}
                    className={`py-1.5 text-xs font-bold rounded transition-all ${
                      pitchingType === "online" ? "bg-white text-primary-blue shadow-sm" : "text-muted-ink"
                    }`}
                  >
                    Google Meet
                  </button>
                  <button
                    type="button"
                    onClick={() => setPitchingType("offline")}
                    className={`py-1.5 text-xs font-bold rounded transition-all ${
                      pitchingType === "offline" ? "bg-white text-primary-blue shadow-sm" : "text-muted-ink"
                    }`}
                  >
                    Physical / Offline
                  </button>
                </div>
              </div>

              {pitchingType === "online" ? (
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Google Meet Link</label>
                  <input
                    type="url"
                    required
                    placeholder="https://meet.google.com/abc-defg-hij"
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-border rounded-xl focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Physical Meeting Location</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="PT Acme office suite, 14th floor, Jakarta"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-border rounded-xl resize-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-border rounded-xl focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Meeting Notes / Agenda (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Introduce agendas or notes for the presentation..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-border rounded-xl resize-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPitchingForm(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold border border-border rounded-lg text-ink bg-white hover:bg-surface-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPitching}
                  className="px-5 py-1.5 text-xs font-bold rounded-lg text-white bg-success hover:bg-success/90 shadow-sm inline-flex items-center disabled:opacity-50"
                >
                  {isSubmittingPitching && <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />}
                  Schedule Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirms Dialog: Cancel Sponsorship */}
      <ConfirmDialog
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => cancelMutation.mutate()}
        title="Cancel Sponsorship Application"
        isDanger={true}
        isLoading={cancelMutation.isPending}
        confirmLabel="Cancel Application"
        description="Are you absolutely sure you want to cancel this sponsorship application? This action will formally withdraw your request from the sponsor committee dashboard and cannot be undone."
      />

      {/* Confirms Dialog: Accept/Reject decide overlay for Company */}
      <ConfirmDialog
        isOpen={decideOpen}
        onClose={() => setDecideOpen(false)}
        onConfirm={() => decideMutation.mutate()}
        title={`${decideStatus === "accepted" ? "Accept" : "Reject"} Sponsorship Application`}
        isDanger={decideStatus === "rejected"}
        isLoading={decideMutation.isPending}
        confirmLabel={`Finalize ${decideStatus === "accepted" ? "Accept" : "Reject"}`}
        description={
          <div className="space-y-4">
            <span className="text-xs">
              Are you absolutely sure you want to finalize this sponsorship application decision?{" "}
              <strong>This decision is permanent and cannot be altered.</strong>
            </span>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Provide feedback notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder={`Provide any closing remarks or terms for the organizer...`}
                value={decideMessage}
                onChange={(e) => setDecideMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F7F8FA] border border-border rounded-xl focus:ring-1 focus:ring-accent-blue resize-none text-ink placeholder:text-silver"
              />
            </div>
          </div>
        }
      />
    </div>
  );
}
