import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { LocationSelect } from "@/components/shared/LocationSelect";
import { FileUpload } from "@/components/shared/FileUpload";
import {
  User as UserIcon,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  Loader2,
  Sparkles,
} from "lucide-react";

export function Account() {
  const { user, organization, company, updateProfile } = useAuthStore();
  const queryClient = useQueryClient();
  const isOrg = user?.role === "organisasi";
  const profileId = isOrg ? organization?.id : company?.id;

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState(""); 
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Role-specific states
  const [category, setCategory] = useState(""); // Org
  const [description, setDescription] = useState(""); // Org & Company
  const [industry, setIndustry] = useState(""); // Company
  
  // Company support tags
  const [sponsorshipPreferences, setSponsorshipPreferences] = useState(""); // Comma separated in input
  const [supportTypesOffered, setSupportTypesOffered] = useState<string[]>([]); // Checkboxes

  const availableSupportTypes = [
    "Pendanaan Tunai",
    "Peralatan / Device",
    "Konsumsi / F&B",
    "Media Partner",
    "Merchandise",
    "Tempat Acara (Venue)",
  ];

  // Initialize fields 
  useEffect(() => {
    if (isOrg && organization) {
      setName(organization.name || "");
      setEmail(organization.email || "");
      setPhone(organization.phone || "");
      setWebsite(organization.website || "");
      setInstagram(organization.instagram || "");
      setLinkedin(organization.linkedin || "");
      setAddress(organization.address || "");
      setProvince(organization.province || "");
      setCity(organization.city || "");
      setCategory(organization.category || "");
      setDescription(organization.description || "");
    } else if (!isOrg && company) {
      setName(company.name || "");
      setEmail(company.email || "");
      setPhone(company.phone || "");
      setWebsite(company.website || "");
      setInstagram(company.instagram || "");
      setLinkedin(company.linkedin || "");
      setAddress(company.address || "");
      setProvince(company.province || "");
      setCity(company.city || "");
      setIndustry(company.industry || "");
      setDescription(company.description || "");
      setSponsorshipPreferences(company.sponsorship_preferences?.join(", ") || "");
      setSupportTypesOffered(company.support_types_offered || []);
    }
  }, [isOrg, organization, company]);

  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const endpoint = isOrg
        ? `/organizations/${profileId}`
        : `/companies/${profileId}`;
      
      const res = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (resData) => {
      // Update Zustand local store
      if (isOrg) {
        updateProfile({ organization: resData.data });
      } else {
        updateProfile({ company: resData.data });
      }

      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully");
      setLogoFile(null); // Clear selected file
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update profile settings");
    },
  });

  const handleSupportTypeChange = (type: string) => {
    if (supportTypesOffered.includes(type)) {
      setSupportTypesOffered(supportTypesOffered.filter((t) => t !== type));
    } else {
      setSupportTypesOffered([...supportTypesOffered, type]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim()) return toast.error("Contact email is required");
    if (!description.trim()) return toast.error("Description is required");
    if (!province || !city) return toast.error("Location region is required");
    if (!address.trim()) return toast.error("Full address is required");

    if (isOrg && !category.trim()) {
      return toast.error("Category is required");
    }

    if (!isOrg) {
      if (!industry.trim()) return toast.error("Industry is required");
      if (supportTypesOffered.length === 0) {
        return toast.error("Please select at least one type of support offered");
      }
    }

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("website", website);
    formData.append("instagram", instagram);
    formData.append("linkedin", linkedin);
    formData.append("address", address);
    formData.append("province", province);
    formData.append("city", city);
    formData.append("description", description);

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    if (isOrg) {
      formData.append("category", category);
    } else {
      formData.append("industry", industry);
      // Append array fields
      supportTypesOffered.forEach((sup) => {
        formData.append("support_types_offered[]", sup);
      });
      
      const prefs = sponsorshipPreferences
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      prefs.forEach((pref) => {
        formData.append("sponsorship_preferences[]", pref);
      });
    }

    updateMutation.mutate(formData);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Account & Profile</h1>
        <p className="text-sm text-muted-ink mt-1">
          Keep your organization details and contact info up-to-date.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Profile Card */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center">
            {isOrg ? <Sparkles className="w-5 h-5 mr-2 text-primary-blue" /> : <Building className="w-5 h-5 mr-2 text-accent-blue" />}
            General Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Logo upload col */}
            <div className="md:col-span-1 space-y-3">
              <label className="block text-sm font-semibold text-ink">
                Logo / Brand Mark
              </label>
              
              {/* Existing logo preview */}
              <div className="w-32 h-32 rounded-2xl bg-surface-soft border border-border flex items-center justify-center overflow-hidden mx-auto">
                {logoFile ? (
                  <img
                    src={URL.createObjectURL(logoFile)}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : isOrg && organization?.logo_url ? (
                  <img
                    src={organization.logo_url}
                    alt={organization.name}
                    className="w-full h-full object-cover"
                  />
                ) : !isOrg && company?.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-silver" />
                )}
              </div>

              <FileUpload
                label="Change Logo"
                accept="image"
                onChange={(file) => setLogoFile(file)}
              />
              <p className="text-[10px] text-muted-ink text-center">
                JPG, PNG, or WebP. Max 5MB.
              </p>
            </div>

            {/* Profile fields col */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-ink">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Brand or entity name"
                    className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>

                {isOrg ? (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-ink">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Mahasiswa, Event Organizer"
                      className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-ink">Industry</label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. Technology, FMCG, Banking"
                      className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-ink">Biography / Overview</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a comprehensive introduction of your entity."
                  className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Corporate preferences for Perusahaan */}
        {!isOrg && (
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-accent-blue" />
              Sponsorship Details
            </h3>

            <div className="space-y-6">
              {/* Support offered */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-ink">
                  Support Types Offered <span className="text-danger">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableSupportTypes.map((type) => (
                    <label
                      key={type}
                      className={`flex items-center space-x-3 p-3 border rounded-xl cursor-pointer transition-all ${
                        supportTypesOffered.includes(type)
                          ? "border-accent-blue bg-soft-blue/20"
                          : "border-border hover:bg-surface-soft/60"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={supportTypesOffered.includes(type)}
                        onChange={() => handleSupportTypeChange(type)}
                        className="rounded border-border text-accent-blue focus:ring-accent-blue"
                      />
                      <span className="text-xs font-medium text-ink">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-ink">
                  Target / Preferences (Comma Separated)
                </label>
                <input
                  type="text"
                  value={sponsorshipPreferences}
                  onChange={(e) => setSponsorshipPreferences(e.target.value)}
                  placeholder="e.g. Mahasiswa, CSR, Digital, Jabodetabek, Olahraga"
                  className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
                <span className="text-[10px] text-muted-ink block">
                  Help Organizers filter if your company matches their category.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Location & Contacts */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-silver" />
            Location & Contacts
          </h3>

          <div className="space-y-4">
            <LocationSelect
              provinceValue={province}
              cityValue={city}
              onChange={(data) => {
                setProvince(data.province);
                setCity(data.city);
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-ink flex items-center">
                  <Mail className="w-4 h-4 mr-1 text-silver" /> Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sponsorship@company.com"
                  className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-ink flex items-center">
                  <Phone className="w-4 h-4 mr-1 text-silver" /> Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 08123456789"
                  className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full address details"
                className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
              />
            </div>
          </div>
        </div>

        {/* Web & Social Media Links */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-silver" />
            Socials & Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink flex items-center">
                <Globe className="w-4 h-4 mr-1.5 text-silver" /> Website
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="e.g. mybrand.com"
                className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink flex items-center">
                <Globe className="w-4 h-4 mr-1.5 text-silver" /> Instagram
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="e.g. mybrand"
                className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink flex items-center">
                <Globe className="w-4 h-4 mr-1.5 text-silver" /> LinkedIn
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="e.g. company/mybrand"
                className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-primary-blue hover:bg-primary-blue/90 disabled:opacity-50 rounded-xl shadow-md transition-colors"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving changes...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
