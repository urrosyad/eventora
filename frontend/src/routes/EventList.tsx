import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ApiResponse, EventModel } from "@/types";
import { Plus, Calendar, MapPin, Eye, FileText, ArrowRight } from "lucide-react";

export function EventList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: eventsRes, isLoading, refetch } = useQuery<ApiResponse<EventModel[]>>({
    queryKey: ["organizer-events"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<EventModel[]>>("/events");
      return res.data;
    },
    enabled: !!user,
  });

  const events = eventsRes?.data || [];

  if (isLoading) {
    return <LoadingState type="page" />;
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Your Events</h1>
          <p className="text-xs text-muted-ink mt-0.5">
            Manage your event configurations, check statuses, and link validated PDF proposal decks.
          </p>
        </div>
        <Link
          to="/events/create"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-xl text-white bg-primary-blue hover:bg-primary-blue/90 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="No events found"
          description="Create your first event file, add details, and upload your validated sponsorship proposal deck to get started."
          actionLabel="Create Event"
          onAction={() => navigate("/events/create")}
          icon={<Calendar className="w-6 h-6 text-silver" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-border rounded-2xl shadow-sm hover:border-accent-blue/30 shadow-sm hover:shadow transition-all p-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-ink bg-surface-soft px-2 py-0.5 rounded border border-border">
                    {event.category}
                  </span>
                  <StatusBadge status={event.status} type="event" />
                </div>

                {/* Title & Desc */}
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-ink line-clamp-1 hover:text-accent-blue transition-colors">
                    {event.name}
                  </h3>
                  <p className="text-xs text-muted-ink line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Meta details */}
                <div className="pt-3 border-t border-border/60 grid grid-cols-2 gap-2 text-xs text-muted-ink">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-silver flex-shrink-0" />
                    <span className="truncate">{event.city}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-silver flex-shrink-0" />
                    <span>{new Date(event.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-5 mt-4 border-t border-border flex items-center justify-between">
                <span className="text-[10px] font-semibold text-primary-blue bg-soft-blue px-2 py-0.5 rounded">
                  {event.budget_range}
                </span>

                <Link
                  to={`/events/${event.id}`}
                  className="inline-flex items-center justify-center text-xs font-bold text-accent-blue hover:text-primary-blue"
                >
                  Manage Details
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
