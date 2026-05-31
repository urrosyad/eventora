import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, Notification } from "@/types";
import { toast } from "sonner";
import { Bell, Check, CheckCircle2, Clock, MailOpen, Trash2 } from "lucide-react";

interface NotificationsResponse {
  notifications: Notification[];
  unread_count: number;
}

export function Notifications() {
  const queryClient = useQueryClient();

  const { data: notificationsData, isLoading } = useQuery<ApiResponse<NotificationsResponse>>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<NotificationsResponse>>("/notifications");
      return res.data;
    },
  });

  const notifications = notificationsData?.data?.notifications || [];
  const unreadCount = notificationsData?.data?.unread_count || 0;

  // Mark single as read
  const readMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/notifications/${id}/read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Mark all as read
  const readAllMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/notifications/read-all");
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(data.message || "All notifications marked as read");
    },
    onError: () => {
      toast.error("Failed to mark all notifications as read");
    },
  });

  const handleNotificationClick = (n: Notification) => {
    if (!n.is_read) {
      readMutation.mutate(n.id);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink flex items-center">
            <Bell className="w-8 h-8 mr-3 text-accent-blue" />
            Notifications
          </h1>
          <p className="text-sm text-muted-ink mt-1">
            Stay updated with your latest application activities and reviews.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => readAllMutation.mutate()}
            disabled={readAllMutation.isPending}
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-primary-blue hover:text-white border border-primary-blue hover:bg-primary-blue rounded-xl transition-all shadow-sm disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Mark all as read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-border/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm divide-y divide-border">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-5 flex items-start space-x-4 transition-colors cursor-pointer ${
                n.is_read ? "bg-white hover:bg-surface-soft/40" : "bg-soft-blue/20 hover:bg-soft-blue/30"
              }`}
            >
              <span className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                n.is_read ? "bg-silver" : "bg-accent-blue"
              }`} />
              <div className="flex-grow space-y-1">
                <div className="flex justify-between items-start gap-4">
                  <p className={`text-sm text-ink leading-relaxed ${n.is_read ? "font-normal" : "font-semibold"}`}>
                    {n.message}
                  </p>
                  {!n.is_read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        readMutation.mutate(n.id);
                      }}
                      className="p-1 text-muted-ink hover:text-accent-blue hover:bg-surface-soft rounded-lg transition-colors flex-shrink-0"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center text-[10px] text-muted-ink space-x-1">
                  <Clock className="w-3.5 h-3.5 text-silver" />
                  <span>{formatTime(n.created_at || "")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl p-12 text-center shadow-sm">
          <MailOpen className="w-10 h-10 mx-auto text-silver mb-3" />
          <h3 className="text-sm font-semibold text-ink">Your inbox is clear</h3>
          <p className="text-xs text-muted-ink mt-1">
            No notifications recorded at this time.
          </p>
        </div>
      )}
    </div>
  );
}
