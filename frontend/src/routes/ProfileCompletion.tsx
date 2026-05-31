import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { LocationSelect } from "@/components/shared/LocationSelect";
import { Loader2, Sparkles, Building2, User } from "lucide-react";
import { ApiResponse, User as UserType } from "@/types";

export function ProfileCompletion() {
  const navigate = useNavigate();
  const { token, user, organization, company, setAuth } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Common Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // Organizer-specific State
  const [category, setCategory] = useState("");

  // Company-specific States
  const [industry, setIndustry] = useState("");
  const [supportTypesOffered, setSupportTypesOffered] = useState<string[]>([]);
  const [sponsorshipPreferences, setSponsorshipPreferences] = useState<string[]>([]);

  const isOrg = user?.role === "organisasi";

  // Prepopulate standard fields if they exist in Zustand (e.g. name, email)
  useEffect(() => {
    if (isOrg && organization) {
      setName(organization.name || "");
      setDescription(organization.description || "");
      setCategory(organization.category || "");
      setProvince(organization.province || "");
      setCity(organization.city || "");
      setAddress(organization.address || "");
      setEmail(organization.email || user?.email || "");
      setPhone(organization.phone || "");
      setInstagram(organization.instagram || "");
      setLinkedin(organization.linkedin || "");
      setWebsite(organization.website || "");
    } else if (!isOrg && company) {
      setName(company.name || "");
      setIndustry(company.industry || "");
      setDescription(company.description || "");
      setProvince(company.province || "");
      setCity(company.city || "");
      setAddress(company.address || "");
      setEmail(company.email || user?.email || "");
      setPhone(company.phone || "");
      setWebsite(company.website || "");
      setInstagram(company.instagram || "");
      setLinkedin(company.linkedin || "");
      setSupportTypesOffered(company.support_types_offered || []);
      setSponsorshipPreferences(company.sponsorship_preferences || []);
    }
  }, [user, organization, company, isOrg]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!description.trim()) errors.description = "Description is required.";
    if (!province) errors.province = "Province is required.";
    if (!city) errors.city = "City is required.";
    if (!address.trim()) errors.address = "Address is required.";
    if (!email.trim()) errors.email = "Email is required.";

    if (isOrg) {
      if (!category) errors.category = "Category is required.";
      if (!phone.trim()) errors.phone = "Phone number is required.";
    } else {
      if (!industry) errors.industry = "Industry type is required.";
      if (supportTypesOffered.length === 0) {
        errors.supportTypesOffered = "Select at least one support type offered.";
      }
      if (sponsorshipPreferences.length === 0) {
        errors.sponsorshipPreferences = "Select at least one event category preference.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckboxChange = (
    val: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (state.includes(val)) {
      setState(state.filter((x) => x !== val));
    } else {
      setState([...state, val]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please complete all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const payload: Record<string, any> = {
        name,
        description,
        province,
        city,
        address,
        email,
        phone,
        website,
        instagram,
        linkedin,
      };

      if (isOrg) {
        payload.category = category;
        const orgId = organization?.id;
        if (!orgId) throw new Error("Organization identifier not found.");
        
        await api.put(`/organizations/${orgId}`, payload);
      } else {
        payload.industry = industry;
        payload.support_types_offered = supportTypesOffered;
        payload.sponsorship_preferences = sponsorshipPreferences;
        const compId = company?.id;
        if (!compId) throw new Error("Company identifier not found.");

        await api.put(`/companies/${compId}`, payload);
      }

      // Refresh /auth/me to obtain is_verified status updates
      const meRes = await api.get<ApiResponse<any>>("/auth/me");
      const updatedProfile = meRes.data.data;
      const updatedUser = {
        ...user,
        is_verified: updatedProfile.is_verified,
      } as UserType;

      setAuth(token!, updatedUser, {
        organization: isOrg ? updatedProfile.organization : null,
        company: !isOrg ? updatedProfile.company : null,
      });

      toast.success("Profile verified successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to update profile. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-[#F7F8FA] py-12 px-4 sm:px-6 lg:px-8 grid-bg relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(46,134,171,0.06),transparent_50%)] pointer-events-none" />

      <div className="max-w-3xl mx-auto bg-white border border-border p-8 rounded-2xl shadow-xl relative z-10 space-y-8">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex p-2 bg-soft-blue text-primary-blue rounded-xl border border-primary-blue/15 mb-3">
            {isOrg ? <Sparkles className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
          </span>
          <h2 className="text-2xl font-bold text-ink">Complete your profile</h2>
          <p className="text-xs text-muted-ink mt-1">
            Complete the required metadata fields below to verify your account and unlock Eventora.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info Section */}
          <div className="bg-surface-soft/40 p-5 border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-ink border-b border-border pb-2 flex items-center">
              <User className="w-4 h-4 mr-2 text-primary-blue" />
              General Profile Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  {isOrg ? "Organization Name" : "Company Name"} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isOrg ? "Tech Summit Community" : "PT TechCorp Global"}
                  className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue placeholder:text-silver ${
                    formErrors.name ? "border-danger text-danger focus:ring-danger" : "border-border text-ink"
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-danger font-medium">{formErrors.name}</p>
                )}
              </div>

              {isOrg ? (
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">
                    Event Category <span className="text-danger">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue ${
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
              ) : (
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">
                    Industry Type <span className="text-danger">*</span>
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue ${
                      formErrors.industry ? "border-danger text-danger focus:ring-danger" : "border-border text-ink"
                    }`}
                  >
                    <option value="">Select Industry</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                  {formErrors.industry && (
                    <p className="mt-1 text-xs text-danger font-medium">{formErrors.industry}</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Description <span className="text-danger">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Provide a professional description about your purpose and background..."
                className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue placeholder:text-silver resize-none ${
                  formErrors.description ? "border-danger text-danger focus:ring-danger" : "border-border text-ink"
                }`}
              />
              {formErrors.description && (
                <p className="mt-1 text-xs text-danger font-medium">{formErrors.description}</p>
              )}
            </div>
          </div>

          {/* Location & Cascade proxy Select */}
          <div className="bg-surface-soft/40 p-5 border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-ink border-b border-border pb-2">
              Location & Complete Address
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

            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Street Address <span className="text-danger">*</span>
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="Full address details (Street name, building suite...)"
                className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue placeholder:text-silver resize-none ${
                  formErrors.address ? "border-danger text-danger focus:ring-danger" : "border-border text-ink"
                }`}
              />
              {formErrors.address && (
                <p className="mt-1 text-xs text-danger font-medium">{formErrors.address}</p>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-surface-soft/40 p-5 border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-ink border-b border-border pb-2">
              Contact & Social Info
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Public Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@domain.com"
                  className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue placeholder:text-silver ${
                    formErrors.email ? "border-danger text-danger focus:ring-danger" : "border-border text-ink"
                  }`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-xs text-danger font-medium">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Phone Number {isOrg && <span className="text-danger">*</span>}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62812345678"
                  className={`w-full px-3 py-2 text-sm bg-white border border-border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue placeholder:text-silver`}
                />
                {isOrg && formErrors.phone && (
                  <p className="mt-1 text-xs text-danger font-medium">{formErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Website URL</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://mywebsite.com"
                  className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Instagram handle</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="instagram_handle"
                  className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="linkedin.com/in/profile"
                  className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>
            </div>
          </div>

          {/* Company-specific details (Preferences & Support Offered) */}
          {!isOrg && (
            <div className="bg-surface-soft/40 p-5 border border-border rounded-xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-ink border-b border-border pb-2 mb-3">
                  Sponsorship Support Offered <span className="text-danger">*</span>
                </h3>
                <p className="text-[11px] text-muted-ink mb-3">
                  Select the types of support your company is willing to offer event partners.
                </p>
                <div className="flex flex-wrap gap-3">
                  {supportTypes.map((type) => {
                    const isChecked = supportTypesOffered.includes(type);
                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() =>
                          handleCheckboxChange(type, supportTypesOffered, setSupportTypesOffered)
                        }
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          isChecked
                            ? "bg-accent-blue border-accent-blue text-white shadow-sm"
                            : "bg-white border-border text-muted-ink hover:text-ink hover:border-border-strong"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
                {formErrors.supportTypesOffered && (
                  <p className="mt-2 text-xs text-danger font-medium">
                    {formErrors.supportTypesOffered}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-ink border-b border-border pb-2 mb-3">
                  Sponsorship Preferences <span className="text-danger">*</span>
                </h3>
                <p className="text-[11px] text-muted-ink mb-3">
                  Select the event categories your company is interested in sponsoring.
                </p>
                <div className="flex flex-wrap gap-3">
                  {categories.map((cat) => {
                    const isChecked = sponsorshipPreferences.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() =>
                          handleCheckboxChange(cat, sponsorshipPreferences, setSponsorshipPreferences)
                        }
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          isChecked
                            ? "bg-accent-blue border-accent-blue text-white shadow-sm"
                            : "bg-white border-border text-muted-ink hover:text-ink hover:border-border-strong"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
                {formErrors.sponsorshipPreferences && (
                  <p className="mt-2 text-xs text-danger font-medium font-semibold">
                    {formErrors.sponsorshipPreferences}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 text-sm font-semibold rounded-xl text-white bg-primary-blue hover:bg-primary-blue/90 shadow-md hover:shadow transition-all inline-flex items-center disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Verify & Complete Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
