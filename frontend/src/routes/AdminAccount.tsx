import { useAuthStore } from "@/stores/authStore";
import { User, Shield, ShieldCheck, Mail, Calendar, Key } from "lucide-react";

export function AdminAccount() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Account Settings</h1>
        <p className="text-sm text-muted-ink mt-1">
          View your system privileges and credentials.
        </p>
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center space-x-4 border-b border-border pb-6">
          <div className="w-16 h-16 rounded-full bg-danger/5 border border-danger/15 flex items-center justify-center">
            <Shield className="w-8 h-8 text-danger" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-ink">System Administrator</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger/5 text-danger border border-danger/25 uppercase">
                Root Admin
              </span>
            </div>
            <p className="text-xs text-muted-ink mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-muted-ink uppercase tracking-wider block">
              Authorization Role
            </span>
            <div className="flex items-center text-sm font-semibold text-ink bg-surface-soft border border-border p-3 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-success mr-2 flex-shrink-0" />
              Platform Administrator
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-muted-ink uppercase tracking-wider block">
              Email Address
            </span>
            <div className="flex items-center text-sm font-medium text-ink bg-surface-soft border border-border p-3 rounded-xl">
              <Mail className="w-4 h-4 text-silver mr-2 flex-shrink-0" />
              {user?.email}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-muted-ink uppercase tracking-wider block">
              Account Registration
            </span>
            <div className="flex items-center text-sm font-medium text-ink bg-surface-soft border border-border p-3 rounded-xl">
              <Calendar className="w-4 h-4 text-silver mr-2 flex-shrink-0" />
              {user?.created_at ? new Date(user.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }) : "System Default"}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-muted-ink uppercase tracking-wider block">
              Account Status
            </span>
            <div className="flex items-center text-sm font-semibold text-success bg-success/5 border border-success/15 p-3 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-success mr-2" />
              Fully Verified & Active
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 space-y-4">
          <h4 className="text-sm font-bold text-ink flex items-center">
            <Key className="w-4 h-4 mr-2 text-silver" /> System Privileges
          </h4>
          <div className="text-xs text-muted-ink leading-relaxed space-y-2 bg-[#F7F8FA] p-4 rounded-xl border border-border">
            <p className="flex items-start">
              <span className="mr-1.5">•</span>
              Ability to ban, unban, and toggle active states of any non-admin account (Organizer and Corporate Sponsor).
            </p>
            <p className="flex items-start">
              <span className="mr-1.5">•</span>
              Ability to permanently destroy and remove user records from the system.
            </p>
            <p className="flex items-start">
              <span className="mr-1.5">•</span>
              Access to the moderation queue to approve, hide, or remove public event listings and proposals.
            </p>
            <p className="flex items-start">
              <span className="mr-1.5">•</span>
              Access to full export features to download comprehensive platform metadata files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
