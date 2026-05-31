import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, User } from "@/types";
import { DataTable } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { toast } from "sonner";
import { Shield, ShieldAlert, Trash2, Ban, CheckCircle, RefreshCcw } from "lucide-react";

export function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");

  // Dialog States
  const [confirmBanUser, setConfirmBanUser] = useState<User | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<User | null>(null);

  // Fetch users query
  const { data: usersData, isLoading } = useQuery<ApiResponse<User[]>>({
    queryKey: ["admin-users", search, roleFilter, statusFilter, verifiedFilter],
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (search) params.search = search;
      if (roleFilter !== "all") params.role = roleFilter;
      if (statusFilter !== "all") params.is_active = statusFilter === "active" ? 1 : 0;
      if (verifiedFilter !== "all") params.is_verified = verifiedFilter === "verified" ? 1 : 0;

      const res = await api.get<ApiResponse<User[]>>("/admin/users", { params });
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
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
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
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      toast.success(data.message || "User account deleted permanently");
      setConfirmDeleteUser(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete user account");
      setConfirmDeleteUser(null);
    },
  });

  const handleBanToggle = (user: User) => {
    setConfirmBanUser(user);
  };

  const handleDeleteClick = (user: User) => {
    setConfirmDeleteUser(user);
  };

  const columns = [
    {
      header: "ID",
      accessor: (row: User) => <span className="font-semibold text-xs">{row.id}</span>,
    },
    {
      header: "Email Address",
      accessor: (row: User) => (
        <div className="flex flex-col">
          <span className="font-medium text-ink">{row.email}</span>
          <span className="text-[10px] text-muted-ink">
            Joined: {row.created_at ? new Date(row.created_at).toLocaleDateString("id-ID") : "-"}
          </span>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: (row: User) => {
        const labels: Record<string, string> = {
          admin: "Platform Admin",
          organisasi: "Event Organizer",
          perusahaan: "Corporate Sponsor",
        };
        const styles: Record<string, string> = {
          admin: "bg-danger/5 text-danger border-danger/20",
          organisasi: "bg-primary-blue/5 text-primary-blue border-primary-blue/20",
          perusahaan: "bg-accent-blue/5 text-accent-blue border-accent-blue/20",
        };
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
              styles[row.role] || "bg-silver/5 text-muted-ink border-silver/20"
            }`}
          >
            {labels[row.role] || row.role}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessor: (row: User) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
            row.is_active
              ? "bg-success/5 border-success/30 text-success"
              : "bg-danger/5 border-danger/30 text-danger"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${row.is_active ? "bg-success" : "bg-danger"}`} />
          {row.is_active ? "Active" : "Banned"}
        </span>
      ),
    },
    {
      header: "Verification",
      accessor: (row: User) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
            row.is_verified
              ? "bg-success/5 border-success/20 text-success"
              : "bg-warning/5 border-warning/20 text-warning"
          }`}
        >
          {row.is_verified ? (
            <>
              <CheckCircle className="w-3 h-3 mr-1 text-success" /> Verified
            </>
          ) : (
            "Pending Profile"
          )}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row: User) => {
        // Prevent admins from banning or deleting themselves/other admins in UI
        if (row.role === "admin") {
          return <span className="text-xs text-muted-ink italic">System account</span>;
        }
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBanToggle(row)}
              className={`p-1.5 rounded-lg border transition-colors ${
                row.is_active
                  ? "border-warning/30 text-warning hover:bg-warning/10"
                  : "border-success/30 text-success hover:bg-success/10"
              }`}
              title={row.is_active ? "Suspend User" : "Activate User"}
            >
              <Ban className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteClick(row)}
              className="p-1.5 rounded-lg border border-danger/30 text-danger hover:bg-danger/10 transition-colors"
              title="Delete Permanently"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const filterComponent = (
    <>
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="px-3 py-1.5 text-xs bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
      >
        <option value="all">All Roles</option>
        <option value="organisasi">Event Organizer</option>
        <option value="perusahaan">Corporate Sponsor</option>
        <option value="admin">Platform Admin</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-1.5 text-xs bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
      >
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="banned">Banned</option>
      </select>

      <select
        value={verifiedFilter}
        onChange={(e) => setVerifiedFilter(e.target.value)}
        className="px-3 py-1.5 text-xs bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue"
      >
        <option value="all">All Verifications</option>
        <option value="verified">Verified</option>
        <option value="pending">Pending Profile</option>
      </select>
    </>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">User Management</h1>
        <p className="text-sm text-muted-ink mt-1">
          Review credentials, toggle suspension states, and permanently delete accounts for all system users.
        </p>
      </div>

      <DataTable
        data={usersData?.data || []}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search email..."
        searchValue={search}
        onSearchChange={setSearch}
        filterComponent={filterComponent}
        emptyState={
          <div className="text-center py-12">
            <ShieldAlert className="w-8 h-8 mx-auto text-silver mb-2" />
            <p className="text-sm font-medium text-ink">No users found</p>
            <p className="text-xs text-muted-ink mt-1">Try resetting your search filters.</p>
          </div>
        }
      />

      {/* Suspension/Ban Confirmation Modal */}
      {confirmBanUser && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setConfirmBanUser(null)}
          onConfirm={() => banMutation.mutate(confirmBanUser.id)}
          isLoading={banMutation.isPending}
          isDanger={confirmBanUser.is_active}
          title={confirmBanUser.is_active ? "Suspend User Account" : "Activate User Account"}
          description={
            confirmBanUser.is_active ? (
              <>
                Are you sure you want to suspend <span className="font-semibold">{confirmBanUser.email}</span>?
                This will prevent them from signing in or accessing the platform immediately.
              </>
            ) : (
              <>
                Are you sure you want to re-activate the account for <span className="font-semibold">{confirmBanUser.email}</span>?
                They will regain full access immediately.
              </>
            )
          }
          confirmLabel={confirmBanUser.is_active ? "Suspend User" : "Activate User"}
          cancelLabel="Cancel"
        />
      )}

      {/* Delete User Confirmation Modal */}
      {confirmDeleteUser && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setConfirmDeleteUser(null)}
          onConfirm={() => deleteMutation.mutate(confirmDeleteUser.id)}
          isLoading={deleteMutation.isPending}
          isDanger={true}
          title="Delete User Permanently"
          description={
            <>
              Are you sure you want to delete <span className="font-semibold">{confirmDeleteUser.email}</span>?
              <br />
              <strong className="text-danger mt-2 block">
                Warning: This action is permanent and completely irreversible. All associated profiles, events, and records will be deleted.
              </strong>
            </>
          }
          confirmLabel="Delete Permanently"
          cancelLabel="Cancel"
        />
      )}
    </div>
  );
}
