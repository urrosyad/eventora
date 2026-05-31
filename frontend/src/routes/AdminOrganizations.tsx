import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, Organization } from "@/types";
import { DataTable } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";
import {
  Sparkles,
  Globe,
  Mail,
  Phone,
  MapPin,
  X,
  Ban,
  Trash2,
} from "lucide-react";

export function AdminOrganizations() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Selected organization detail modal
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  // Ban/Delete states
  const [confirmBanUser, setConfirmBanUser] = useState<{ userId: number; email: string } | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<{ userId: number; name: string } | null>(null);

  // Fetch organizations
  const { data: orgsData, isLoading } = useQuery<ApiResponse<Organization[]>>({
    queryKey: ["admin-organizations", search, categoryFilter],
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (search) params.search = search;
      if (categoryFilter !== "all") params.category = categoryFilter;

      const res = await api.get<ApiResponse<Organization[]>>("/organizations", { params });
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
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
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
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      toast.success(data.message || "User account deleted permanently");
      setConfirmDeleteUser(null);
      setSelectedOrg(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete user account");
      setConfirmDeleteUser(null);
    },
  });

  const columns = [
    {
      header: "Logo",
      accessor: (row: Organization) => (
        <div className="w-10 h-10 rounded-xl bg-surface-soft border border-border flex items-center justify-center overflow-hidden">
          {row.logo_url ? (
            <img src={row.logo_url} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <Sparkles className="w-5 h-5 text-silver" />
          )}
        </div>
      ),
    },
    {
      header: "Organization Name",
      accessor: (row: Organization) => (
        <div className="flex flex-col">
          <span className="font-semibold text-ink hover:text-accent-blue cursor-pointer" onClick={() => setSelectedOrg(row)}>
            {row.name}
          </span>
          <span className="text-[10px] text-muted-ink">Category: {row.category || "General"}</span>
        </div>
      ),
    },
    {
      header: "Address / City",
      accessor: (row: Organization) => (
        <span className="text-xs text-ink">
          {row.city ? `${row.city}, ` : ""}
          {row.province || "Indonesia"}
        </span>
      ),
    },
    {
      header: "Joined Date",
      accessor: (row: Organization) => (
        <span className="text-xs text-muted-ink">
          {row.created_at ? new Date(row.created_at).toLocaleDateString("id-ID") : "-"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row: Organization) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedOrg(row)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-border text-ink bg-white hover:bg-surface-soft transition-colors"
          >
            Details
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

  const uniqueCategories = Array.from(
    new Set(
      (orgsData?.data || [])
        .map((org) => org.category)
        .filter((cat): cat is string => !!cat)
    )
  );

  const filterComponent = (
    <select
      value={categoryFilter}
      onChange={(e) => setCategoryFilter(e.target.value)}
      className="px-3 py-1.5 text-xs bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
    >
      <option value="all">All Categories</option>
      {uniqueCategories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Registered Organizations</h1>
        <p className="text-sm text-muted-ink mt-1">
          Monitor event organizer accounts, verify contact information, and moderate organizer profiles.
        </p>
      </div>

      <DataTable
        data={orgsData?.data || []}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search organization name..."
        searchValue={search}
        onSearchChange={setSearch}
        filterComponent={filterComponent}
      />

      {/* Organization details modal */}
      {selectedOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-surface-soft border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                  {selectedOrg.logo_url ? (
                    <img src={selectedOrg.logo_url} alt={selectedOrg.name} className="w-full h-full object-cover" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-silver" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink">{selectedOrg.name}</h3>
                  <p className="text-xs text-muted-ink">Category: {selectedOrg.category || "General"}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrg(null)}
                className="p-1 text-muted-ink hover:text-ink hover:bg-surface-soft rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* Description */}
              <div>
                <h4 className="font-bold text-ink uppercase tracking-wider text-xs mb-2">Description</h4>
                <p className="text-muted-ink leading-relaxed bg-[#F7F8FA] p-4 rounded-xl border border-border">
                  {selectedOrg.description || "No description provided."}
                </p>
              </div>

              {/* Location & Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
                <div className="space-y-2.5">
                  <div className="flex items-center text-muted-ink">
                    <MapPin className="w-4 h-4 mr-2 text-silver flex-shrink-0" />
                    <span className="truncate">
                      {selectedOrg.address || "No address"}, {selectedOrg.city}, {selectedOrg.province}
                    </span>
                  </div>
                  <div className="flex items-center text-muted-ink">
                    <Globe className="w-4 h-4 mr-2 text-silver flex-shrink-0" />
                    {selectedOrg.website ? (
                      <a
                        href={selectedOrg.website.startsWith("http") ? selectedOrg.website : `https://${selectedOrg.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent-blue hover:underline truncate"
                      >
                        {selectedOrg.website}
                      </a>
                    ) : (
                      <span>No website</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center text-muted-ink">
                    <Mail className="w-4 h-4 mr-2 text-silver flex-shrink-0" />
                    <span className="truncate">{selectedOrg.email || "No email"}</span>
                  </div>
                  <div className="flex items-center text-muted-ink">
                    <Phone className="w-4 h-4 mr-2 text-silver flex-shrink-0" />
                    <span>{selectedOrg.phone || "No phone number"}</span>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              {(selectedOrg.instagram || selectedOrg.linkedin) && (
                <div className="flex items-center space-x-4 border-t border-border pt-4">
                  {selectedOrg.linkedin && (
                    <a
                      href={selectedOrg.linkedin.startsWith("http") ? selectedOrg.linkedin : `https://linkedin.com/in/${selectedOrg.linkedin}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-xs text-muted-ink hover:text-primary-blue"
                    >
                      <Globe className="w-4 h-4 mr-1.5" /> LinkedIn
                    </a>
                  )}
                  {selectedOrg.instagram && (
                    <a
                      href={selectedOrg.instagram.startsWith("http") ? selectedOrg.instagram : `https://instagram.com/${selectedOrg.instagram}`}
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

            {/* Footer actions */}
            <div className="p-6 border-t border-border bg-[#F7F8FA] flex justify-between items-center">
              <span className="text-[10px] text-muted-ink font-semibold uppercase">
                ID: {selectedOrg.id} | User ID: {selectedOrg.user_id}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setConfirmBanUser({ userId: selectedOrg.user_id, email: selectedOrg.email || selectedOrg.name })}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-warning/30 text-warning bg-white hover:bg-warning/5 transition-colors"
                >
                  Suspend Account
                </button>
                <button
                  onClick={() => setConfirmDeleteUser({ userId: selectedOrg.user_id, name: selectedOrg.name })}
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
              Are you sure you want to toggle suspension for <span className="font-semibold">{confirmBanUser.email}</span>?
              If suspended, they will be logged out and cannot sign in.
            </>
          }
          confirmLabel="Toggle Access"
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
          title="Delete Organizer Account"
          description={
            <>
              Are you sure you want to permanently delete <span className="font-semibold">{confirmDeleteUser.name}</span>?
              This will remove all associated events, proposals, and user access records.
            </>
          }
          confirmLabel="Delete Permanently"
          cancelLabel="Cancel"
        />
      )}
    </div>
  );
}
