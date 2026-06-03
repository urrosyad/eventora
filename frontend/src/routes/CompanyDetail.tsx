import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { LoadingState } from "@/components/shared/LoadingState";
import { FileUpload } from "@/components/shared/FileUpload";
import { ApiResponse, Company, Bookmark, EventModel } from "@/types";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Bookmark as BookmarkIcon,
  Layers,
  Sparkles,
  Award,
  Plus,
  Send,
  Loader2,
} from "lucide-react";

export function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const isApplyMode = searchParams.get("apply") === "sponsorship";

  // Apply Form States
  const [selectedEventId, setSelectedEventId] = useState("");
  const [supportRequested, setSupportRequested] = useState("");
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [additionalMessage, setAdditionalMessage] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Company details
  const { data: companyRes, isLoading: isLoadingCompany } = useQuery<ApiResponse<Company>>({
    queryKey: ["company-detail", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Company>>(`/companies/${id}`);
      return res.data;
    },
    enabled: !!id && !!user,
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

  // 3. Fetch active events for the organizer to select in the apply form
  const { data: activeEventsRes } = useQuery<ApiResponse<EventModel[]>>({
    queryKey: ["organizer-active-events"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<EventModel[]>>("/events?status=active");
      return res.data;
    },
    enabled: !!user && user.role === "organisasi" && isApplyMode,
  });

  const company = companyRes?.data;
  const bookmarks = bookmarksRes?.data || [];
  const activeEvents = activeEventsRes?.data || [];

  const isBookmarked = bookmarks.some((b) => b.company_id === company?.id);

  // Bookmarking Mutation
  const bookmarkToggleMutation = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        const match = bookmarks.find((b) => b.company_id === company?.id);
        if (match) await api.delete(`/bookmarks/${match.id}`);
      } else {
        await api.post("/bookmarks", { company_id: company?.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks-list"] });
      toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks!");
    },
    onError: () => {
      toast.error("Failed to update bookmark.");
    },
  });

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!selectedEventId) errors.selectedEventId = "Please select an event.";
    if (!supportRequested) errors.supportRequested = "Please select requested support type.";
    if (!coverLetterFile) {
      errors.coverLetter = "Surat pengantar wajib diunggah.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please review application requirements.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("event_id", selectedEventId);
      formData.append("company_id", company?.id ? String(company.id) : "");
      formData.append("support_type_requested", supportRequested);
      if (coverLetterFile) {
        formData.append("cover_letter", coverLetterFile);
      }
      if (additionalMessage) {
        formData.append("additional_message", additionalMessage);
      }

      await api.post("/sponsorships", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Sponsorship application submitted successfully!");
      navigate("/sponsorships");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to submit application. Check duplicate apply.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCompany || !company) {
    return <LoadingState type="page" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Back link */}
      <Link
        to="/companies"
        className="inline-flex items-center text-xs font-semibold text-muted-ink hover:text-ink transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Back to Sponsor Directory
      </Link>

      {/* Corporate Header Info */}
      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-primary-blue bg-soft-blue px-2 py-0.5 rounded border border-primary-blue/15">
              {company.industry || "Corporate Partner"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">{company.name}</h1>
        </div>

        {/* Action button triggers */}
        {user?.role === "organisasi" && (
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={() => bookmarkToggleMutation.mutate()}
              className={`p-2.5 rounded-xl border transition-all ${
                isBookmarked
                  ? "bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100"
                  : "bg-white border-border text-muted-ink hover:text-ink hover:bg-surface-soft"
              }`}
            >
              <BookmarkIcon className={`w-4 h-4 ${isBookmarked ? "fill-amber-500" : ""}`} />
            </button>

            {isApplyMode ? (
              <button
                onClick={() => navigate(`/companies/${id}`)}
                className="px-4 py-2 text-xs font-semibold border border-border rounded-xl text-ink bg-white hover:bg-surface-soft transition-colors"
              >
                View Preferences
              </button>
            ) : (
              <button
                onClick={() => navigate(`/companies/${id}?apply=sponsorship`)}
                className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-primary-blue hover:bg-primary-blue/90 shadow-sm transition-all"
              >
                Apply for Sponsorship
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Switch Area */}
      {isApplyMode ? (
        // RENDER SPONSORSHIP APPLICATION FORM
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-ink border-b border-border pb-2 flex items-center">
              <Send className="w-4 h-4 mr-2 text-primary-blue" />
              Sponsorship Proposal Application Form
            </h2>
            <p className="text-[11px] text-muted-ink mt-1">
              Submit your active event profile and proposal PDF with a customized cover letter for {company.name}.
            </p>
          </div>

          <form onSubmit={handleApplySubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Select active event */}
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Select Active Event <span className="text-danger">*</span>
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue ${
                    formErrors.selectedEventId ? "border-danger text-danger focus:ring-danger" : "border-border text-ink"
                  }`}
                >
                  <option value="">Select an Active Event</option>
                  {activeEvents.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name} ({ev.category})
                    </option>
                  ))}
                </select>
                {formErrors.selectedEventId && (
                  <p className="mt-1 text-xs text-danger font-medium">{formErrors.selectedEventId}</p>
                )}
                {activeEvents.length === 0 && (
                  <p className="mt-1.5 text-[10px] text-muted-ink flex items-center">
                    No active events found.{" "}
                    <Link to="/events/create" className="text-accent-blue hover:underline ml-1 font-semibold">
                      Create event & upload PDF proposal first
                    </Link>
                  </p>
                )}
              </div>

              {/* Select requested support type */}
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Requested Support Scope <span className="text-danger">*</span>
                </label>
                <select
                  value={supportRequested}
                  onChange={(e) => setSupportRequested(e.target.value)}
                  className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue ${
                    formErrors.supportRequested ? "border-danger text-danger focus:ring-danger" : "border-border text-ink"
                  }`}
                >
                  <option value="">Select Support Type</option>
                  {company.support_types_offered?.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                  <option value="Lainnya">Lainnya (Custom Request)</option>
                </select>
                {formErrors.supportRequested && (
                  <p className="mt-1 text-xs text-danger font-medium">{formErrors.supportRequested}</p>
                )}
              </div>
            </div>

            {/* Custom Cover letter */}
            <FileUpload
              label="Surat Pengantar (Cover Letter)"
              accept="pdf"
              required={true}
              error={formErrors.coverLetter}
              onChange={(file) => {
                setCoverLetterFile(file);
                if (file && formErrors.coverLetter) {
                  setFormErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.coverLetter;
                    return copy;
                  });
                }
              }}
            />

            {/* Additional Message */}
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">
                Additional message <span className="text-muted-ink">(Optional)</span>
              </label>
              <textarea
                value={additionalMessage}
                onChange={(e) => setAdditionalMessage(e.target.value)}
                rows={2}
                placeholder="Alternative logistics notes or custom requests..."
                className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue placeholder:text-silver resize-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/companies/${id}`)}
                className="px-4 py-2.5 text-sm font-medium rounded-xl border border-border text-ink bg-white hover:bg-surface-soft transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white bg-primary-blue hover:bg-primary-blue/90 shadow-md inline-flex items-center disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit Application
              </button>
            </div>
          </form>
        </div>
      ) : (
        // RENDER COMPANY PREFERENCES AND DETAILS VIEW
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main profile */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-base font-bold text-ink border-b border-border pb-2">
                About the Corporate Partner
              </h2>
              <p className="text-sm text-muted-ink leading-relaxed whitespace-pre-line">
                {company.description || "No corporate description provided yet."}
              </p>
            </div>

            {/* Contact details */}
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-base font-bold text-ink border-b border-border pb-2">
                Office Location & Contact Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-ink">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-silver mt-0.5" />
                  <div>
                    <span className="font-semibold text-ink block">Full Address</span>
                    <span>{company.address || "Office headquarters"}, {company.city || "Jakarta"}, {company.province || "DKI Jakarta"}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <Mail className="w-4 h-4 text-silver mt-0.5" />
                  <div>
                    <span className="font-semibold text-ink block">Business Email</span>
                    <span className="select-all">{company.email || "partner@eventora.test"}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <Phone className="w-4 h-4 text-silver mt-0.5" />
                  <div>
                    <span className="font-semibold text-ink block">Direct Telephone</span>
                    <span className="select-all">{company.phone || "Not public"}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <Globe className="w-4 h-4 text-silver mt-0.5" />
                  <div>
                    <span className="font-semibold text-ink block">Corporate Website</span>
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">
                        {company.website}
                      </a>
                    ) : (
                      <span>Not provided</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences & offered support */}
          <div className="space-y-6">
            {/* Offered Support */}
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-ink border-b border-border pb-2 flex items-center">
                <Award className="w-4 h-4 mr-2 text-success" />
                Sponsorship Budgets Available
              </h3>
              <p className="text-[10px] text-muted-ink leading-relaxed">
                This company is willing to evaluate applications for the following sponsorship support types:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {company.support_types_offered?.map((scope) => (
                  <span
                    key={scope}
                    className="px-2.5 py-0.5 bg-surface-soft border border-border text-[10px] font-semibold text-ink rounded"
                  >
                    {scope}
                  </span>
                ))}
              </div>
            </div>

            {/* Event Preferences */}
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-ink border-b border-border pb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-accent-blue" />
                Sponsorship Preferences
              </h3>
              <p className="text-[10px] text-muted-ink leading-relaxed">
                Preferred event categories for matching promotional sponsorships:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {company.sponsorship_preferences?.map((pref) => (
                  <span
                    key={pref}
                    className="px-2.5 py-0.5 bg-soft-blue border border-primary-blue/15 text-[10px] font-semibold text-primary-blue rounded"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
