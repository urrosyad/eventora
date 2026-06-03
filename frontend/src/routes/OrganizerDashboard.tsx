import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ApiResponse, SponsorshipApplication, EventModel } from "@/types";
import {
  Sparkles,
  Calendar,
  Layers,
  Bookmark,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Mail,
  Phone,
  Globe,
  ChevronRight,
  ArrowRight,
  Lock,
} from "lucide-react";

export function OrganizerDashboard() {
  const navigate = useNavigate();
  const { user, organization } = useAuthStore();

  // 1. Fetch organizer's events to check if any exist
  const { data: eventsRes, isLoading: isLoadingEvents } = useQuery<ApiResponse<EventModel[]>>({
    queryKey: ["organizer-events"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<EventModel[]>>("/events");
      return res.data;
    },
    enabled: !!user,
  });

  // 2. Fetch all sponsorships sent by this organizer
  const { data: sponsorshipsRes, isLoading: isLoadingSponsorships } = useQuery<ApiResponse<SponsorshipApplication[]>>({
    queryKey: ["organizer-sponsorships"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<SponsorshipApplication[]>>("/sponsorships");
      return res.data;
    },
    enabled: !!user,
  });

  const events = eventsRes?.data || [];
  const sponsorships = sponsorshipsRes?.data || [];
  const isLoading = isLoadingEvents || isLoadingSponsorships;

  // Aggregate stats on frontend (extremely robust fallback adapter)
  const acceptedSponsors = sponsorships.filter((s) => s.status === "accepted");
  const pendingSponsors = sponsorships.filter((s) => s.status === "pending" || s.status === "reviewed");
  const rejectedSponsors = sponsorships.filter((s) => s.status === "rejected");

  if (isLoading) {
    return <LoadingState type="page" />;
  }

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            Welcome back, {organization?.name || "Organizer"}
          </h1>
          <p className="text-xs text-muted-ink mt-1">
            Manage your proposals, discover new sponsors, and oversee active event sponsorships.
          </p>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0">
          <Link
            to="/events/create"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-xl text-white bg-primary-blue hover:bg-primary-blue/90 shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Event
          </Link>
          <Link
            to="/companies"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-xl text-ink bg-white border border-border hover:bg-surface-soft transition-colors"
          >
            Find Sponsors
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-success rounded-xl border border-success/10">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-ink uppercase tracking-wider block">
              Accepted Sponsorships
            </span>
            <span className="text-2xl font-bold text-ink block mt-0.5">
              {acceptedSponsors.length}
            </span>
          </div>
        </div>

        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-orange-soft text-warning rounded-xl border border-warning/10">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-ink uppercase tracking-wider block">
              Pending Decisions
            </span>
            <span className="text-2xl font-bold text-ink block mt-0.5">
              {pendingSponsors.length}
            </span>
          </div>
        </div>

        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-danger rounded-xl border border-danger/10">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-ink uppercase tracking-wider block">
              Rejected Proposals
            </span>
            <span className="text-2xl font-bold text-ink block mt-0.5">
              {rejectedSponsors.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Latest Pipeline and Contact Cards */}
      {events.length === 0 ? (
        <EmptyState
          title="No events created yet"
          description="Create your first event, fill in description, and upload a verified PDF deck to start applying for corporate sponsor budgets."
          actionLabel="Create Event"
          onAction={() => navigate("/events/create")}
          icon={<Calendar className="w-6 h-6 text-silver" />}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Sponsorship Pipeline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h2 className="text-lg font-bold text-ink flex items-center">
                <Layers className="w-4 h-4 mr-2 text-primary-blue" />
                Latest Sponsorship Applications
              </h2>
              <Link
                to="/sponsorships"
                className="text-xs font-bold text-accent-blue hover:underline inline-flex items-center"
              >
                View Pipeline
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>

            {sponsorships.length === 0 ? (
              <div className="text-center py-10 bg-white border border-border rounded-2xl">
                <p className="text-sm text-muted-ink mb-4">You haven't submitted any sponsorship applications yet.</p>
                <Link
                  to="/companies"
                  className="inline-flex items-center text-xs font-bold text-primary-blue hover:text-accent-blue"
                >
                  Browse Sponsor Directory
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {sponsorships.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    onClick={() => navigate(`/sponsorships/${app.id}`)}
                    className="p-4 bg-white border border-border rounded-xl hover:border-accent-blue/30 shadow-sm hover:shadow cursor-pointer transition-all flex items-center justify-between gap-4"
                  >
                    <div className="truncate text-left space-y-1.5">
                      <h4 className="font-bold text-sm text-ink truncate hover:text-accent-blue transition-colors">
                        {app.company?.name || "Corporate Sponsor"}
                      </h4>
                      <p className="text-xs text-muted-ink truncate">
                        Event: <span className="font-medium text-ink">{app.event?.name || "Deleted Event"}</span>
                      </p>
                      <p className="text-[10px] text-muted-ink">
                        Requested: <span className="font-semibold text-primary-blue">{app.support_type_requested}</span>
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <StatusBadge status={app.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Locked/Unlocked Accepted Sponsors Contacts */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-border">
              <h2 className="text-lg font-bold text-ink flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-success" />
                Unlocked Sponsors Contacts
              </h2>
            </div>

            {acceptedSponsors.length === 0 ? (
              <div className="p-6 bg-white border border-border rounded-2xl text-center">
                <Lock className="w-8 h-8 text-silver mx-auto mb-3" />
                <p className="text-xs font-semibold text-ink mb-1">Contacts Locked</p>
                <p className="text-[10px] text-muted-ink leading-relaxed">
                  When a corporate sponsor accepts your application, their contact emails and direct phone numbers unlock here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {acceptedSponsors.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 bg-white border border-success/20 rounded-2xl shadow-sm space-y-4 text-left relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 h-1 w-full bg-success" />
                    <div>
                      <h4 className="font-bold text-sm text-ink">{app.company?.name}</h4>
                      <p className="text-[10px] text-muted-ink mt-0.5">
                        Approved for: <span className="font-semibold text-success">{app.support_type_requested}</span>
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-muted-ink border-t border-border pt-3">
                      {app.company?.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3.5 h-3.5 text-silver flex-shrink-0" />
                          <span className="truncate text-ink font-medium select-all">{app.company.email}</span>
                        </div>
                      )}
                      {app.company?.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3.5 h-3.5 text-silver flex-shrink-0" />
                          <span className="text-ink font-medium select-all">{app.company.phone}</span>
                        </div>
                      )}
                      {app.company?.website && (
                        <div className="flex items-center space-x-2">
                          <Globe className="w-3.5 h-3.5 text-silver flex-shrink-0" />
                          <a
                            href={app.company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-blue hover:underline truncate"
                          >
                            {app.company.website}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Schedule pitching invitation */}
                    <div className="pt-2">
                      <Link
                        to={`/sponsorships/${app.id}?schedule=pitching`}
                        className="w-full inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold rounded-xl text-white bg-success hover:bg-success/90 shadow-sm transition-colors"
                      >
                        Schedule Pitching Meeting
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
