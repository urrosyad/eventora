import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Send, Clock, Eye, CheckCircle2, ChevronRight } from "lucide-react";

export function SponsorshipFlowAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const phases = [
    {
      title: "1. Proposal Uploaded",
      desc: "Event Organizer uploads a structured PDF proposal to their event profile.",
      icon: FileText,
      color: "text-primary-blue bg-soft-blue border-primary-blue/30",
    },
    {
      title: "2. Application Submitted",
      desc: "Organizer selects a partner company and submits with a custom cover letter.",
      icon: Send,
      color: "text-accent-blue bg-soft-blue border-accent-blue/30",
    },
    {
      title: "3. Auto-Reviewed State",
      desc: "As soon as the company opens the application, status automatically changes to Reviewed.",
      icon: Eye,
      color: "text-warning bg-orange-soft border-warning/30",
    },
    {
      title: "4. Sponsorship Accepted",
      desc: "The decision is finalized. Legal contact information is unlocked for direct negotiations.",
      icon: CheckCircle2,
      color: "text-success bg-green-50 border-success/30",
    },
  ];

  return (
    <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-8 max-w-2xl mx-auto">
      {/* Animated Visual Flow Panel */}
      <div className="relative flex items-center justify-between p-4 bg-background/50 border border-border/60 rounded-xl overflow-hidden min-h-[140px]">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-border -translate-y-1/2 z-0">
          <motion.div
            className="h-full bg-accent-blue"
            initial={{ width: "0%" }}
            animate={{
              width: step === 0 ? "0%" : step === 1 ? "33%" : step === 2 ? "66%" : "100%",
            }}
            transition={{ duration: 0.6 }}
          />
        </div>

        {/* Node 1: Organizer */}
        <div className="flex flex-col items-center z-10">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
              step >= 0
                ? "bg-white border-primary-blue text-primary-blue shadow-md"
                : "bg-surface border-border text-silver"
            }`}
          >
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold text-ink mt-2">Organizer</span>
        </div>

        {/* Node 2: Pending Application */}
        <div className="flex flex-col items-center z-10">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
              step >= 1
                ? "bg-white border-accent-blue text-accent-blue shadow-md"
                : "bg-surface border-border text-silver"
            }`}
          >
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold text-ink mt-2">Pending</span>
        </div>

        {/* Node 3: Reviewed */}
        <div className="flex flex-col items-center z-10">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
              step >= 2
                ? "bg-white border-warning text-warning shadow-md"
                : "bg-surface border-border text-silver"
            }`}
          >
            <Eye className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold text-ink mt-2">Reviewed</span>
        </div>

        {/* Node 4: Accepted Sponsor */}
        <div className="flex flex-col items-center z-10">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
              step >= 3
                ? "bg-white border-success text-success shadow-md"
                : "bg-surface border-border text-silver"
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold text-ink mt-2">Accepted</span>
        </div>
      </div>

      {/* Explanations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {phases.map((phase, idx) => {
          const Icon = phase.icon;
          const isActive = step === idx;
          return (
            <div
              key={idx}
              className={`p-4 border rounded-xl transition-all duration-300 text-left ${
                isActive
                  ? "bg-white border-accent-blue/40 shadow-sm ring-1 ring-accent-blue/10"
                  : "bg-surface-soft/40 border-border/40 opacity-60"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className={`p-1.5 rounded-lg border ${phase.color}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <h4 className="text-xs font-bold text-ink">{phase.title}</h4>
              </div>
              <p className="text-[11px] text-muted-ink leading-relaxed">{phase.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
