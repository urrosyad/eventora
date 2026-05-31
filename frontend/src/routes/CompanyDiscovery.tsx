import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { LocationSelect } from "@/components/shared/LocationSelect";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ApiResponse, Company, Bookmark } from "@/types";
import {
  Search,
  Building2,
  MapPin,
  Bookmark as BookmarkIcon,
  ChevronRight,
  SlidersHorizontal,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function CompanyDiscovery() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Filters State
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [supportType, setSupportType] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // 1. Fetch Companies list
  const { data: companiesRes, isLoading: isLoadingCompanies } = useQuery<ApiResponse<Company[]>>({
    queryKey: ["companies-list", search, industry, province, city, supportType],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (industry) params.industry = industry;
      if (province) params.province = province;
      if (city) params.city = city;
      if (supportType) params.support_type = supportType;

      const res = await api.get<ApiResponse<Company[]>>("/companies", { params });
      return res.data;
    },
    enabled: !!user,
  });

  // 2. Fetch bookmarks list to match favorites
  const { data: bookmarksRes } = useQuery<ApiResponse<Bookmark[]>>({
    queryKey: ["bookmarks-list"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Bookmark[]>>("/bookmarks");
      return res.data;
    },
    enabled: !!user,
  });

  const companies = companiesRes?.data || [];
  const bookmarks = bookmarksRes?.data || [];

  // Bookmarking Mutation handlers
  const addBookmarkMutation = useMutation({
    mutationFn: async (companyId: number) => {
      await api.post("/bookmarks", { company_id: companyId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks-list"] });
      toast.success("Company added to bookmarks!");
    },
    onError: () => {
      toast.error("Failed to bookmark company.");
    },
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: async (bookmarkId: number) => {
      await api.delete(`/bookmarks/${bookmarkId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks-list"] });
      toast.success("Company removed from bookmarks.");
    },
    onError: () => {
      toast.error("Failed to remove bookmark.");
    },
  });

  const handleBookmarkToggle = (companyId: number) => {
    const matchedBookmark = bookmarks.find((b) => b.company_id === companyId);
    if (matchedBookmark) {
      removeBookmarkMutation.mutate(matchedBookmark.id);
    } else {
      addBookmarkMutation.mutate(companyId);
    }
  };

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Food & Beverages",
    "Education",
    "Automotive",
    "Lainnya",
  ];

  const supportTypes = [
    "Uang Tunai",
    "Logistik & Konsumsi",
    "Media Partner",
    "Tempat & Fasilitas",
    "Lainnya",
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Sponsors Directory</h1>
          <p className="text-xs text-muted-ink mt-0.5">
            Discover verified companies, review sponsorship preferences, and target matching support budgets.
          </p>
        </div>
        
        {/* Toggle filters */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 border border-border text-xs font-semibold rounded-xl text-ink bg-white hover:bg-surface-soft transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-muted-ink" />
          Filter Directory
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm space-y-4 animate-scale-up">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Directory Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink mb-1">Industry Sectors</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
              >
                <option value="">All Industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink mb-1">Support Offered</label>
              <select
                value={supportType}
                onChange={(e) => setSupportType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
              >
                <option value="">All Support Types</option>
                {supportTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink mb-1">Company Search</label>
              <input
                type="text"
                placeholder="Search PT Acme..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue placeholder:text-silver"
              />
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <LocationSelect
              provinceValue={province}
              cityValue={city}
              onChange={(data) => {
                setProvince(data.province);
                setCity(data.city);
              }}
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              onClick={() => {
                setSearch("");
                setIndustry("");
                setProvince("");
                setCity("");
                setSupportType("");
              }}
              className="px-3 py-1.5 text-xs font-semibold text-muted-ink hover:text-ink transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-1.5 text-xs font-bold bg-primary-blue text-white hover:bg-primary-blue/90 rounded-xl transition-all"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}

      {/* Grid Content */}
      {isLoadingCompanies ? (
        <LoadingState type="skeleton" rows={4} />
      ) : companies.length === 0 ? (
        <EmptyState
          title="No companies found"
          description="We couldn't find any corporate sponsors matching your active directory search filters. Try refining your filters or reset."
          actionLabel="Reset Search Filters"
          onAction={() => {
            setSearch("");
            setIndustry("");
            setProvince("");
            setCity("");
            setSupportType("");
          }}
          icon={<Building2 className="w-6 h-6 text-silver" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {companies.map((company) => {
            const isBookmarked = bookmarks.some((b) => b.company_id === company.id);
            return (
              <div
                key={company.id}
                className="bg-white border border-border rounded-2xl shadow-sm hover:border-accent-blue/30 shadow-sm hover:shadow transition-all p-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Category & Bookmark */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-ink bg-surface-soft px-2 py-0.5 rounded border border-border">
                      {company.industry || "General Sponsor"}
                    </span>
                    
                    {/* Toggle Bookmark */}
                    <button
                      onClick={() => handleBookmarkToggle(company.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isBookmarked
                          ? "bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100"
                          : "bg-white border-border text-muted-ink hover:text-ink hover:bg-surface-soft"
                      }`}
                      title={isBookmarked ? "Remove Bookmark" : "Bookmark Sponsor"}
                    >
                      <BookmarkIcon className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-500" : ""}`} />
                    </button>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-1.5 text-left">
                    <h3 className="font-bold text-base text-ink line-clamp-1">
                      {company.name}
                    </h3>
                    <p className="text-xs text-muted-ink line-clamp-2 leading-relaxed">
                      {company.description || "Verified corporate sponsor on Eventora. Browse company details to apply."}
                    </p>
                  </div>

                  {/* Meta items */}
                  <div className="pt-3 border-t border-border/60 text-xs text-muted-ink space-y-2">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-silver flex-shrink-0" />
                      <span className="truncate">{company.city || "Jakarta"}, {company.province || "DKI Jakarta"}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-1.5">
                        <Layers className="w-3.5 h-3.5 text-silver flex-shrink-0" />
                        <span>Sponsorship Scope:</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pl-5">
                        {company.support_types_offered?.slice(0, 3).map((scope) => (
                          <span
                            key={scope}
                            className="px-1.5 py-0.5 bg-surface-soft border border-border text-[9px] rounded font-semibold text-ink"
                          >
                            {scope}
                          </span>
                        ))}
                        {(company.support_types_offered?.length || 0) > 3 && (
                          <span className="text-[9px] text-muted-ink font-semibold">
                            +{(company.support_types_offered?.length || 0) - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details / Apply Action */}
                <div className="pt-5 mt-4 border-t border-border flex items-center justify-between">
                  <Link
                    to={`/companies/${company.id}`}
                    className="inline-flex items-center text-xs font-semibold text-muted-ink hover:text-ink"
                  >
                    View Preferences
                  </Link>

                  <Link
                    to={`/companies/${company.id}?apply=sponsorship`}
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
