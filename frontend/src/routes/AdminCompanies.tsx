import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, Company } from "@/types";
import { DataTable } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";
import {
  Building2,
  ExternalLink,
  Ban,
  Trash2,
  Globe,
  Mail,
  Phone,
  MapPin,
  X,
} from "lucide-react";

export function AdminCompanies() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");

  // Selected company details modal state
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // User ban/delete confirmation states
  const [confirmBanUser, setConfirmBanUser] = useState<{ userId: number; email: string } | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<{ userId: number; name: string } | null>(null);

  // Fetch companies list
  const { data: companiesData, isLoading } = useQuery<ApiResponse<Company[]>>({
    queryKey: ["admin-companies", search, industryFilter],
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (search) params.search = search;
      if (industryFilter !== "all") params.industry = industryFilter;

      const res = await api.get<ApiResponse<Company[]>>("/companies", { params });
      return res.data;
    },
  });

  // Ban/Unban user mutation
  const banMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await api.put(`/admin/users/${userId}/ban`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-companies"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      toast.success(data.message || "User status updated successfully");
      setConfirmBanUser(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update user status");
      setConfirmBanUser(null);
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await api.delete(`/admin/users/${userId}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-companies"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      toast.success(data.message || "User account deleted permanently");
      setConfirmDeleteUser(null);
      setSelectedCompany(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete user account");
      setConfirmDeleteUser(null);
    },
  });

  const columns = [
    {
      header: "Company Logo",
      accessor: (row: Company) => (
        <div className="w-10 h-10 rounded-xl bg-surface-soft border border-border flex items-center justify-center overflow-hidden">
          {row.logo_url ? (
            <img src={row.logo_url} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-5 h-5 text-silver" />
          )}
        </div>
      ),
    },
    {
      header: "Name",
      accessor: (row: Company) => (
        <div className="flex flex-col">
          <span className="font-semibold text-ink hover:text-accent-blue cursor-pointer" onClick={() => setSelectedCompany(row)}>
            {row.name}
          </span>
          {row.website && (
            <a
              href={row.website.startsWith("http") ? row.website : `https://${row.website}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-[10px] text-accent-blue hover:underline mt-0.5"
            >
              Visit site <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
            </a>
          )}
        </div>
      ),
    },
    {
      header: "Industry",
      accessor: (row: Company) => (
        <span className="text-xs text-muted-ink bg-surface-soft border border-border px-2 py-0.5 rounded-lg">
          {row.industry || "General / Technology"}
        </span>
      ),
    },
    {
      header: "Location",
      accessor: (row: Company) => (
        <span className="text-xs text-ink">
          {row.city ? `${row.city}, ` : ""}
          {row.province || "Indonesia"}
        </span>
      ),
    },
    {
      header: "Joined Date",
      accessor: (row: Company) => (
        <span className="text-xs text-muted-ink">
          {row.created_at ? new Date(row.created_at).toLocaleDateString("id-ID") : "-"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row: Company) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedCompany(row)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-border text-ink bg-white hover:bg-surface-soft transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => setConfirmBanUser({ userId: row.user_id, email: row.email || row.name })}
            className="p-1.5 rounded-lg border border-warning/30 text-warning hover:bg-warning/10 transition-colors"
            title="Ban/Unban User"
          >
            <Ban className="w-4 h-4" />
          </button>
          <button
            onClick={() => setConfirmDeleteUser({ userId: row.user_id, name: row.name })}
            className="p-1.5 rounded-lg border border-danger/30 text-danger hover:bg-danger/10 transition-colors"
            title="Delete Permanently"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const uniqueIndustries = Array.from(
    new Set(
      (companiesData?.data || [])
        .map((c) => c.industry)
        .filter((ind): ind is string => !!ind)
    )
  );

  const filterComponent = (
    <select
      value={industryFilter}
      onChange={(e) => setIndustryFilter(e.target.value)}
      className="px-3 py-1.5 text-xs bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
    >
      <option value="all">All Industries</option>
      {uniqueIndustries.map((ind) => (
        <option key={ind} value={ind}>
          {ind}
        </option>
      ))}
    </select>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Registered Companies</h1>
        <p className="text-sm text-muted-ink mt-1">
          Monitor sponsor accounts, view corporate preferences, and moderate corporate profiles.
        </p>
      </div>

      <DataTable
        data={companiesData?.data || []}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search company name..."
        searchValue={search}
        onSearchChange={setSearch}
        filterComponent={filterComponent}
      />

      {/* Company details modal dialog */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-surface-soft border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                  {selectedCompany.logo_url ? (
                    <img src={selectedCompany.logo_url} alt={selectedCompany.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6 text-silver" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink">{selectedCompany.name}</h3>
                  <p className="text-xs text-muted-ink">Industry: {selectedCompany.industry || "General"}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCompany(null)}
                className="p-1 text-muted-ink hover:text-ink hover:bg-surface-soft rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* Profile Bio */}
              <div>
                <h4 className="font-bold text-ink uppercase tracking-wider text-xs mb-2">Description</h4>
                <p className="text-muted-ink leading-relaxed bg-[#F7F8FA] p-4 rounded-xl border border-border">
                  {selectedCompany.description || "No description provided."}
                </p>
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-ink uppercase tracking-wider text-xs mb-2">Sponsorship Preferences</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCompany.sponsorship_preferences && selectedCompany.sponsorship_preferences.length > 0 ? (
                      selectedCompany.sponsorship_preferences.map((pref, i) => (
                        <span key={i} className="text-xs px-2.5 py-0.5 rounded-lg border border-border bg-[#F7F8FA] text-ink font-medium">
                          {pref}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-ink italic">No preferences set</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-ink uppercase tracking-wider text-xs mb-2">Support Types Offered</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCompany.support_types_offered && selectedCompany.support_types_offered.length > 0 ? (
                      selectedCompany.support_types_offered.map((sup, i) => (
                        <span key={i} className="text-xs px-2.5 py-0.5 rounded-lg border border-accent-blue/20 bg-soft-blue text-accent-blue font-medium">
                          {sup}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-ink italic">No support types registered</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Location & Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
                <div className="space-y-2.5">
                  <div className="flex items-center text-muted-ink">
                    <MapPin className="w-4 h-4 mr-2 text-silver flex-shrink-0" />
                    <span className="truncate">
                      {selectedCompany.address || "No address"}, {selectedCompany.city}, {selectedCompany.province}
                    </span>
                  </div>
                  <div className="flex items-center text-muted-ink">
                    <Globe className="w-4 h-4 mr-2 text-silver flex-shrink-0" />
                    {selectedCompany.website ? (
                      <a
                        href={selectedCompany.website.startsWith("http") ? selectedCompany.website : `https://${selectedCompany.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent-blue hover:underline truncate"
                      >
                        {selectedCompany.website}
                      </a>
                    ) : (
                      <span>No website</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center text-muted-ink">
                    <Mail className="w-4 h-4 mr-2 text-silver flex-shrink-0" />
                    <span className="truncate">{selectedCompany.email || "No public email"}</span>
                  </div>
                  <div className="flex items-center text-muted-ink">
                    <Phone className="w-4 h-4 mr-2 text-silver flex-shrink-0" />
                    <span>{selectedCompany.phone || "No phone number"}</span>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              {(selectedCompany.instagram || selectedCompany.linkedin) && (
                <div className="flex items-center space-x-4 border-t border-border pt-4">
                  {selectedCompany.linkedin && (
                    <a
                      href={selectedCompany.linkedin.startsWith("http") ? selectedCompany.linkedin : `https://linkedin.com/in/${selectedCompany.linkedin}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-xs text-muted-ink hover:text-primary-blue"
                    >
                      <Globe className="w-4 h-4 mr-1.5" /> LinkedIn
                    </a>
                  )}
                  {selectedCompany.instagram && (
                    <a
                      href={selectedCompany.instagram.startsWith("http") ? selectedCompany.instagram : `https://instagram.com/${selectedCompany.instagram}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-xs text-muted-ink hover:text-pink-600"
                    >
                      <Globe className="w-4 h-4 mr-1.5" /> Instagram
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-[#F7F8FA] flex justify-between items-center">
              <span className="text-[10px] text-muted-ink font-semibold uppercase">
                ID: {selectedCompany.id} | User ID: {selectedCompany.user_id}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setConfirmBanUser({ userId: selectedCompany.user_id, email: selectedCompany.email || selectedCompany.name })}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-warning/30 text-warning bg-white hover:bg-warning/5 transition-colors"
                >
                  Suspend Account
                </button>
                <button
                  onClick={() => setConfirmDeleteUser({ userId: selectedCompany.user_id, name: selectedCompany.name })}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-danger/30 text-danger bg-white hover:bg-danger/5 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suspension/Ban Confirmation Modal */}
      {confirmBanUser && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setConfirmBanUser(null)}
          onConfirm={() => banMutation.mutate(confirmBanUser.userId)}
          isLoading={banMutation.isPending}
          isDanger={true}
          title="Suspend User Account"
          description={
            <>
              Are you sure you want to toggle the active status of <span className="font-semibold">{confirmBanUser.email}</span>?
              If suspended, they will be logged out and cannot sign in.
            </>
          }
          confirmLabel="Confirm Status Toggle"
          cancelLabel="Cancel"
        />
      )}

      {/* Delete User Confirmation Modal */}
      {confirmDeleteUser && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setConfirmDeleteUser(null)}
          onConfirm={() => deleteMutation.mutate(confirmDeleteUser.userId)}
          isLoading={deleteMutation.isPending}
          isDanger={true}
          title="Delete Company Account"
          description={
            <>
              Are you sure you want to permanently delete <span className="font-semibold">{confirmDeleteUser.name}</span>?
              This will remove all details, requests, and login records permanently.
            </>
          }
          confirmLabel="Delete Permanently"
          cancelLabel="Cancel"
        />
      )}
    </div>
  );
}
