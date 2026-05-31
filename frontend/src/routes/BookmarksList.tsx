import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ApiResponse, Bookmark } from "@/types";
import { Bookmark as BookmarkIcon, MapPin, Layers, Trash2, ArrowRight, Compass } from "lucide-react";

export function BookmarksList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: bookmarksRes, isLoading } = useQuery<ApiResponse<Bookmark[]>>({
    queryKey: ["bookmarks-list"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Bookmark[]>>("/bookmarks");
      return res.data;
    },
    enabled: !!user,
  });

  const bookmarks = bookmarksRes?.data || [];

  // Remove Bookmark Mutation
  const removeBookmarkMutation = useMutation({
    mutationFn: async (bookmarkId: number) => {
      await api.delete(`/bookmarks/${bookmarkId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks-list"] });
      toast.success("Bookmark removed.");
    },
    onError: () => {
      toast.error("Failed to remove bookmark.");
    },
  });

  if (isLoading) {
    return <LoadingState type="page" />;
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-ink tracking-tight flex items-center">
          <BookmarkIcon className="w-6 h-6 mr-2 text-primary-blue" />
          Bookmarked Sponsors
        </h1>
        <p className="text-xs text-muted-ink mt-0.5">
          Quickly review favorited corporate partners and draft targeted applications.
        </p>
      </div>

      {/* Bookmarks Grid list */}
      {bookmarks.length === 0 ? (
        <EmptyState
          title="No bookmarked sponsors"
          description="Save matching corporate sponsors from the directory to build a shortlist of partnership opportunities."
          actionLabel="Find Sponsors"
          onAction={() => navigate("/companies")}
          icon={<Compass className="w-6 h-6 text-silver" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bm) => {
            const comp = bm.company;
            if (!comp) return null;
            return (
              <div
                key={bm.id}
                className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:border-accent-blue/30 shadow-sm hover:shadow transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Category & Remove action */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-ink bg-surface-soft px-2 py-0.5 rounded border border-border">
                      {comp.industry || "General Sponsor"}
                    </span>
                    
                    <button
                      onClick={() => removeBookmarkMutation.mutate(bm.id)}
                      className="p-1.5 rounded-lg border border-border/80 text-muted-ink hover:text-danger hover:bg-danger/10 hover:border-danger/15 transition-all"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-ink truncate">
                      {comp.name}
                    </h3>
                    <p className="text-xs text-muted-ink line-clamp-2 leading-relaxed">
                      {comp.description || "Verified corporate sponsor on Eventora. Click below to view preferences."}
                    </p>
                  </div>

                  {/* Meta properties */}
                  <div className="pt-3 border-t border-border/60 text-xs text-muted-ink space-y-2">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-silver flex-shrink-0" />
                      <span className="truncate">{comp.city}, {comp.province}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <Layers className="w-3.5 h-3.5 text-silver flex-shrink-0" />
                        <span>Support Scope:</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pl-5">
                        {comp.support_types_offered?.slice(0, 2).map((scope) => (
                          <span
                            key={scope}
                            className="px-1.5 py-0.5 bg-surface-soft border border-border text-[9px] rounded font-semibold text-ink"
                          >
                            {scope}
                          </span>
                        ))}
                        {(comp.support_types_offered?.length || 0) > 2 && (
                          <span className="text-[9px] text-muted-ink font-semibold">
                            +{(comp.support_types_offered?.length || 0) - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Actions */}
                <div className="pt-5 mt-4 border-t border-border flex items-center justify-between">
                  <Link
                    to={`/companies/${comp.id}`}
                    className="text-xs font-semibold text-muted-ink hover:text-ink"
                  >
                    View Preferences
                  </Link>

                  <Link
                    to={`/companies/${comp.id}?apply=sponsorship`}
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold rounded-lg text-white bg-primary-blue hover:bg-primary-blue/90 shadow-sm hover:shadow transition-all"
                  >
                    Apply Sponsor
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
