import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { LocationSelect } from "@/components/shared/LocationSelect";
import { FileUpload } from "@/components/shared/FileUpload";
import { LoadingState } from "@/components/shared/LoadingState";
import { Loader2, ArrowLeft, Calendar, FileText } from "lucide-react";
import { ApiResponse, EventModel } from "@/types";

export function EventCreateEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Field States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [participantCount, setParticipantCount] = useState(100);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [category, setCategory] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [supportTypesNeeded, setSupportTypesNeeded] = useState<string[]>([]);
  const [proposalFile, setProposalFile] = useState<File | null>(null);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch initial details if in edit mode
  useEffect(() => {
    if (isEdit) {
      const fetchDetails = async () => {
        setIsLoadingDetails(true);
        try {
          const res = await api.get<ApiResponse<EventModel>>(`/events/${id}`);
          const event = res.data.data;
          
          setName(event.name);
          setDescription(event.description);
          setTargetAudience(event.target_audience);
          setParticipantCount(event.participant_count);
          setProvince(event.province);
          setCity(event.city);
          setEventDate(event.event_date);
          setCategory(event.category);
          setBudgetRange(event.budget_range);
          setSupportTypesNeeded(event.support_types_needed || []);
        } catch (error: any) {
          toast.error("Failed to load event details.");
          navigate("/events");
        } finally {
          setIsLoadingDetails(false);
        }
      };
      fetchDetails();
    }
  }, [id, isEdit]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Event name is required.";
    if (!description.trim()) errors.description = "Event description is required.";
    if (!targetAudience.trim()) errors.targetAudience = "Target audience is required.";
    if (participantCount < 1) errors.participantCount = "Participant count must be at least 1.";
    if (!province) errors.province = "Province is required.";
    if (!city) errors.city = "City is required.";
    if (!eventDate) errors.eventDate = "Event date is required.";
    if (!category) errors.category = "Event category is required.";
    if (!budgetRange) errors.budgetRange = "Sponsorship budget range is required.";
    if (supportTypesNeeded.length === 0) {
      errors.supportTypesNeeded = "Select at least one required sponsorship support type.";
    }
    
    // Proposal PDF deck is required when creating a new event
    if (!isEdit && !proposalFile) {
      errors.proposalFile = "A sponsorship deck PDF proposal is required for new events.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckboxChange = (val: string) => {
    if (supportTypesNeeded.includes(val)) {
      setSupportTypesNeeded(supportTypesNeeded.filter((t) => t !== val));
    } else {
      setSupportTypesNeeded([...supportTypesNeeded, val]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Compile standard text details
      const payload = {
        name,
        description,
        target_audience: targetAudience,
        participant_count: Number(participantCount),
        province,
        city,
        event_date: eventDate,
        category,
        budget_range: budgetRange,
        support_types_needed: supportTypesNeeded,
      };

      let eventId = id;

      if (isEdit) {
        // Edit mode
        await api.put(`/events/${id}`, payload);
        toast.success("Event details updated successfully!");
      } else {
        // Create mode
        const res = await api.post<ApiResponse<EventModel>>("/events", payload);
        eventId = res.data.data.id.toString();
      }

      // 2. Handle proposal PDF upload if a file was selected
      if (proposalFile && eventId) {
        const fileFormData = new FormData();
        fileFormData.append("proposal_path", proposalFile); // Matches the Laravel storage backend validation key
        
        await api.post(`/events/${eventId}/proposal`, fileFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        if (!isEdit) {
          toast.success("Event created and proposal PDF uploaded successfully!");
        } else {
          toast.success("New proposal PDF deck uploaded successfully!");
        }
      }

      navigate(`/events/${eventId}`);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to save event. Check details or limits.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "Seminar",
    "Music Concert",
    "Art Exhibition",
    "Sports Tournament",
    "Cultural Festival",
    "Charity Event",
    "Lainnya",
  ];

  const budgetRanges = [
    "< Rp 5 Juta",
    "Rp 5 Juta - Rp 15 Juta",
    "Rp 15 Juta - Rp 50 Juta",
    "Rp 50 Juta - Rp 100 Juta",
    "> Rp 100 Juta",
  ];

  const supportTypes = [
    "Uang Tunai",
    "Logistik & Konsumsi",
    "Media Partner",
    "Tempat & Fasilitas",
    "Lainnya",
  ];

  if (isLoadingDetails) {
    return <LoadingState type="page" />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      {/* Back button */}
      <Link
        to={isEdit ? `/events/${id}` : "/events"}
        className="inline-flex items-center text-xs font-semibold text-muted-ink hover:text-ink transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Back to Event Details
      </Link>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight">
          {isEdit ? "Edit Event Profile" : "Create New Event"}
        </h1>
        <p className="text-xs text-muted-ink mt-0.5">
          Provide accurate activity details, target demographics, and upload the sponsorship proposal deck.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Core details */}
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-ink border-b border-border pb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-primary-blue" />
            General Event Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Event Activity Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tech Innovators Hackathon 2026"
                className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue placeholder:text-silver ${
                  formErrors.name ? "border-danger text-danger focus:ring-danger" : "border-border text-ink"
                }`}
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-danger font-medium">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Event Category <span className="text-danger">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue ${
                  formErrors.category ? "border-danger text-danger focus:ring-danger" : "border-border text-ink"
                }`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {formErrors.category && (
                <p className="mt-1 text-xs text-danger font-medium">{formErrors.category}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Event Description <span className="text-danger">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe what the event accomplishes, target schedules, layout plans, and value proposition for corporate partners..."
              className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue placeholder:text-silver resize-none ${
                formErrors.description ? "border-danger text-danger focus:ring-danger" : "border-border text-ink"
              }`}
            />
            {formErrors.description && (
              <p className="mt-1 text-xs text-danger font-medium">{formErrors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Target Audience <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Undergraduate students, developers"
                className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue placeholder:text-silver ${
                  formErrors.targetAudience ? "border-danger text-danger focus:ring-danger" : "border-border text-ink"
                }`}
              />
              {formErrors.targetAudience && (
                <p className="mt-1 text-xs text-danger font-medium">{formErrors.targetAudience}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Participant Count <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                value={participantCount}
                onChange={(e) => setParticipantCount(Number(e.target.value))}
                min={1}
                max={1000000}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue ${
                  formErrors.participantCount ? "border-danger text-danger focus:ring-danger" : "border-border text-ink"
                }`}
              />
              {formErrors.participantCount && (
                <p className="mt-1 text-xs text-danger font-medium">{formErrors.participantCount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Activity Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue ${
                  formErrors.eventDate ? "border-danger text-danger focus:ring-danger" : "border-border text-ink"
                }`}
              />
              {formErrors.eventDate && (
                <p className="mt-1 text-xs text-danger font-medium">{formErrors.eventDate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Location & proxy Cascade select */}
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-ink border-b border-border pb-2">
            Event Implementation Location
          </h3>
          <LocationSelect
            provinceValue={province}
            cityValue={city}
            provinceError={formErrors.province}
            cityError={formErrors.city}
            onChange={(data) => {
              setProvince(data.province);
              setCity(data.city);
            }}
          />
        </div>

        {/* Sponsorship Specifications */}
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-ink border-b border-border pb-2 mb-3">
              Required Support Types <span className="text-danger">*</span>
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {supportTypes.map((type) => {
                const isSelected = supportTypesNeeded.includes(type);
                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => handleCheckboxChange(type)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      isSelected
                        ? "bg-primary-blue border-primary-blue text-white shadow-sm"
                        : "bg-white border-border text-muted-ink hover:text-ink hover:border-border-strong"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
            {formErrors.supportTypesNeeded && (
              <p className="mt-2 text-xs text-danger font-medium">{formErrors.supportTypesNeeded}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Sponsorship Budget Target <span className="text-danger">*</span>
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue ${
                  formErrors.budgetRange ? "border-danger text-danger focus:ring-danger" : "border-border text-ink"
                }`}
              >
                <option value="">Select Range</option>
                {budgetRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
              {formErrors.budgetRange && (
                <p className="mt-1 text-xs text-danger font-medium">{formErrors.budgetRange}</p>
              )}
            </div>
          </div>
        </div>

        {/* File upload section */}
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-ink border-b border-border pb-2 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-primary-blue" />
            Sponsorship PDF Deck Proposal
          </h3>
          
          {isEdit && (
            <p className="text-[10px] text-muted-ink leading-relaxed">
              &bull; Uploading a new PDF will overwrite your existing proposal deck on the server. Leave blank if you wish to retain the current deck file.
            </p>
          )}

          <FileUpload
            label="Proposal Deck"
            accept="pdf"
            required={!isEdit}
            error={formErrors.proposalFile}
            onChange={(file) => setProposalFile(file)}
          />
        </div>

        {/* Actions Submit */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Link
            to={isEdit ? `/events/${id}` : "/events"}
            className="px-4 py-2.5 text-sm font-medium rounded-xl border border-border text-ink bg-white hover:bg-surface-soft transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white bg-primary-blue hover:bg-primary-blue/90 shadow-md inline-flex items-center disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEdit ? "Update Event" : "Create & Upload PDF"}
          </button>
        </div>
      </form>
    </div>
  );
}
