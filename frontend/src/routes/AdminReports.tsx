import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { FileBarChart, Download, Loader2, Info } from "lucide-react";

export function AdminReports() {
  const [type, setType] = useState<"sponsorship" | "company" | "organization" | "event">("sponsorship");
  const [format, setFormat] = useState<"csv" | "excel" | "pdf">("csv");
  const [range, setRange] = useState<"all" | "today" | "7days" | "30days">("all");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);

    try {
      // Fetch report endpoint as blob
      const res = await api.get("/admin/reports/export", {
        params: { type, format, range },
        responseType: "blob",
      });

      // Define default file name matching backend
      const dateStr = new Date().toISOString().replace(/-/g, "").replace(/:/g, "").replace("T", "").slice(0, 14);
      const filename = `laporan_${type}_${dateStr}.csv`;

      // Trigger standard browser download
      const blob = new Blob([res.data], { type: "text/csv" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up DOM objects
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Report downloaded successfully");
    } catch (error) {
      toast.error("Failed to generate and download report");
    } finally {
      setIsExporting(false);
    }
  };

  const reportTypes = [
    {
      value: "sponsorship",
      label: "Sponsorship Applications",
      description: "Includes details of application ID, events, organizers, sponsor companies, support types, statuses, and submission dates.",
    },
    {
      value: "company",
      label: "Corporate Sponsors",
      description: "List of all registered companies, industries, locations, contacts (email & phone), and website links.",
    },
    {
      value: "organization",
      label: "Event Organizers",
      description: "List of all registered organizations, category, locations, descriptions, and contact info.",
    },
    {
      value: "event",
      label: "Events & Proposals",
      description: "Export list of all created events, organizing bodies, category, audience size, dates, and current publication statuses.",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Reports & Analytics</h1>
        <p className="text-sm text-muted-ink mt-1">
          Export system-wide data tables in CSV/Excel/PDF format for offline analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form panel */}
        <div className="md:col-span-2 bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-ink mb-6 flex items-center">
            <FileBarChart className="w-5 h-5 mr-2 text-accent-blue" />
            Report Export Configuration
          </h3>

          <form onSubmit={handleExport} className="space-y-6">
            {/* Report Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-ink uppercase tracking-wider">
                Select Report Type
              </label>
              <div className="grid grid-cols-1 gap-3">
                {reportTypes.map((rt) => (
                  <label
                    key={rt.value}
                    className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all ${
                      type === rt.value
                        ? "border-primary-blue bg-soft-blue/20 ring-1 ring-primary-blue"
                        : "border-border hover:bg-surface-soft/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportType"
                      value={rt.value}
                      checked={type === rt.value}
                      onChange={() => setType(rt.value as any)}
                      className="mt-1 mr-3 h-4 w-4 text-primary-blue border-border focus:ring-accent-blue"
                    />
                    <div>
                      <span className="text-sm font-semibold text-ink">{rt.label}</span>
                      <p className="text-xs text-muted-ink mt-0.5 leading-relaxed">
                        {rt.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Date range filter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-ink uppercase tracking-wider block">
                  Date Range Filter
                </label>
                <select
                  value={range}
                  onChange={(e) => setRange(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue shadow-sm"
                >
                  <option value="all">All Time Records</option>
                  <option value="today">Today Only</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
              </div>

              {/* Format selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-ink uppercase tracking-wider block">
                  File Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent-blue shadow-sm"
                >
                  <option value="csv">Standard CSV (.csv)</option>
                  <option value="excel">Microsoft Excel (.xlsx)</option>
                  <option value="pdf">Document PDF (.pdf)</option>
                </select>
              </div>
            </div>

            {/* Export Trigger */}
            <div className="border-t border-border pt-6 flex justify-end">
              <button
                type="submit"
                disabled={isExporting}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-primary-blue hover:bg-primary-blue/90 disabled:opacity-50 rounded-xl shadow-sm transition-colors"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" /> Download Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info panel */}
        <div className="bg-[#EAF4FF]/40 border border-[#EAF4FF] rounded-2xl p-6 h-fit space-y-4">
          <h4 className="font-bold text-primary-blue text-sm flex items-center">
            <Info className="w-4 h-4 mr-2 text-primary-blue flex-shrink-0" />
            Report Export Info
          </h4>
          <div className="text-xs text-muted-ink space-y-3 leading-relaxed">
            <p>
              Reports generated reflect system status at the exact moment of export.
            </p>
            <p>
              <strong className="text-primary-blue font-semibold">Note for Excel/PDF formats:</strong> For MVP deployment, exports return formatted CSV datasets configured for immediate spreadsheet usage.
            </p>
            <p>
              For security compliance, user credentials (passwords, salts, auth tokens) are stripped from exported reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
