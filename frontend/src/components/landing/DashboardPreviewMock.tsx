import { StatusBadge } from "@/components/shared/StatusBadge";
import { LayoutDashboard, Users, Sparkles, Calendar, Layers, ShieldAlert, Award, FileText, CheckCircle } from "lucide-react";

export function DashboardPreviewMock() {
  return (
    <div className="w-full bg-white rounded-2xl border border-border/80 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[420px] max-w-5xl mx-auto">
      {/* Sidebar Mock */}
      <div className="hidden md:flex flex-col w-56 border-r border-border bg-white flex-shrink-0 p-4 justify-between text-left">
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center px-2">
            <img src="/eventoraLogo.png" alt="EVENTORA" className="h-5 w-auto object-contain" />
          </div>

          {/* Links */}
          <div className="space-y-1">
            <span className="flex items-center space-x-2.5 px-3 py-1.5 text-xs font-semibold bg-surface-soft text-primary-blue rounded-lg border-l-2 border-primary-blue">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </span>
            <span className="flex items-center space-x-2.5 px-3 py-1.5 text-xs font-medium text-muted-ink hover:bg-surface-soft rounded-lg">
              <Calendar className="w-3.5 h-3.5" />
              <span>Events</span>
            </span>
            <span className="flex items-center space-x-2.5 px-3 py-1.5 text-xs font-medium text-muted-ink hover:bg-surface-soft rounded-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Find Sponsors</span>
            </span>
            <span className="flex items-center space-x-2.5 px-3 py-1.5 text-xs font-medium text-muted-ink hover:bg-surface-soft rounded-lg">
              <Layers className="w-3.5 h-3.5" />
              <span>Sponsorships</span>
            </span>
          </div>
        </div>

        {/* Profile Footer */}
        <div className="border-t border-border pt-4 flex items-center space-x-2 px-2">
          <div className="w-7 h-7 rounded-full bg-primary-blue/10 flex items-center justify-center font-bold text-[10px] text-primary-blue">
            TE
          </div>
          <div className="truncate text-left leading-none">
            <span className="text-[10px] font-bold text-ink block">Tech Event Lead</span>
            <span className="text-[8px] text-muted-ink">organizer@eventora.test</span>
          </div>
        </div>
      </div>

      {/* Main Content Mock */}
      <div className="flex-grow flex flex-col h-full overflow-hidden text-left bg-background/50">
        {/* Top Navbar Mock */}
        <div className="h-14 border-b border-border bg-white px-6 flex items-center justify-between flex-shrink-0">
          <span className="text-xs font-semibold text-muted-ink">Overview Platform / Organizer Dashboard</span>
          <div className="w-2.5 h-2.5 rounded-full bg-success" title="API Status Connected" />
        </div>

        {/* Inner Scroll Mock */}
        <div className="p-6 space-y-6 overflow-y-auto flex-grow">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-border p-4 rounded-xl shadow-sm text-left">
              <span className="text-[10px] font-bold text-muted-ink uppercase tracking-wider block">Accepted Partner</span>
              <span className="text-xl font-bold text-success block mt-1">12</span>
              <span className="text-[8px] text-muted-ink block mt-0.5">&bull; Active contracts unlocked</span>
            </div>
            <div className="bg-white border border-border p-4 rounded-xl shadow-sm text-left">
              <span className="text-[10px] font-bold text-muted-ink uppercase tracking-wider block">Pending Decision</span>
              <span className="text-xl font-bold text-warning block mt-1">4</span>
              <span className="text-[8px] text-muted-ink block mt-0.5">&bull; Under review by sponsors</span>
            </div>
            <div className="bg-white border border-border p-4 rounded-xl shadow-sm text-left">
              <span className="text-[10px] font-bold text-muted-ink uppercase tracking-wider block">Sponsorship Rate</span>
              <span className="text-xl font-bold text-primary-blue block mt-1">78.5%</span>
              <span className="text-[8px] text-muted-ink block mt-0.5">&bull; Conversion successful</span>
            </div>
          </div>

          {/* Table Mock */}
          <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-3.5 bg-surface-soft border-b border-border flex items-center justify-between">
              <span className="text-[10px] font-bold text-ink uppercase tracking-wider">Latest Sponsorship Tracking</span>
              <span className="text-[9px] text-accent-blue font-semibold hover:underline cursor-pointer">View All</span>
            </div>
            <div className="divide-y divide-border">
              <div className="p-3 flex items-center justify-between text-xs hover:bg-[#F7F8FA] transition-colors">
                <div className="truncate max-w-[200px]">
                  <span className="font-semibold text-ink block">IndoFood Corp</span>
                  <span className="text-[10px] text-muted-ink">Event: Culinary & Food Festival 2026</span>
                </div>
                <StatusBadge status="accepted" />
              </div>
              <div className="p-3 flex items-center justify-between text-xs hover:bg-[#F7F8FA] transition-colors">
                <div className="truncate max-w-[200px]">
                  <span className="font-semibold text-ink block">BankCentral Syariah</span>
                  <span className="text-[10px] text-muted-ink">Event: Tech Career Fair & Summit</span>
                </div>
                <StatusBadge status="reviewed" />
              </div>
              <div className="p-3 flex items-center justify-between text-xs hover:bg-[#F7F8FA] transition-colors">
                <div className="truncate max-w-[200px]">
                  <span className="font-semibold text-ink block">GoTo Group</span>
                  <span className="text-[10px] text-muted-ink">Event: Hackathon Innovation 2026</span>
                </div>
                <StatusBadge status="pending" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
