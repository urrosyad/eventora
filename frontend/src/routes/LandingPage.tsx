import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatedHeroText } from "@/components/landing/AnimatedHeroText";
import { SponsorshipFlowAnimation } from "@/components/landing/SponsorshipFlowAnimation";
import { TestimonialMarquee } from "@/components/landing/TestimonialMarquee";
import { PartnerSlider } from "@/components/landing/PartnerSlider";
import { DashboardPreviewMock } from "@/components/landing/DashboardPreviewMock";
import {
  FileText,
  Compass,
  ArrowRight,
  Layers,
  CheckCircle,
  Eye,
  Clock,
  Sparkles,
  Building2,
  Lock,
  Search,
  Bell,
  Calendar,
} from "lucide-react";

export function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to specific section if query param ?scrollTo=... is present
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get("scrollTo");
    if (scrollTo) {
      const element = document.getElementById(scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative overflow-hidden bg-white py-20 md:py-32 grid-bg">
        {/* Subtle radial glow background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(46,134,171,0.08),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Switching text hero title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-ink leading-[1.15] text-center">
              Build sponsorship <br className="hidden sm:inline" />
              workflows for <AnimatedHeroText />
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-muted-ink max-w-2xl mx-auto leading-relaxed">
              Eventora helps organizers manage proposals, apply to corporate sponsors, track pipeline status, and move partnerships forward in one clean platform.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-xl text-white bg-primary-blue hover:bg-primary-blue/90 shadow-lg hover:shadow transition-all group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => {
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-xl text-ink bg-white border border-border hover:bg-surface-soft transition-colors"
              >
                See How It Works
              </button>
            </div>
          </div>

          {/* Dashboard Preview Frame Mock */}
          <div className="mt-16 md:mt-24 max-w-5xl mx-auto relative group">
            {/* Subtle glow border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-blue to-accent-blue rounded-2xl blur opacity-10 group-hover:opacity-15 transition duration-1000" />
            <div className="relative">
              <DashboardPreviewMock />
            </div>
          </div>
        </div>
      </section>

      {/* Partner Slider strip */}
      <PartnerSlider />

      {/* 2. ABOUT & PROBLEM SECTION */}
      <section id="about" className="py-20 md:py-28 bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-ink">
              Sponsorship outreach is still scattered.
            </h2>
            <p className="text-sm md:text-base text-muted-ink">
              Traditional sponsorship efforts are bogged down by manual administration, scattered messages, and zero pipeline transparency. Eventora solves this.
            </p>
          </div>

          {/* Bento Problem Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-border p-6 rounded-2xl text-left space-y-3">
              <div className="w-8 h-8 rounded-lg bg-surface-soft border border-border flex items-center justify-center text-primary-blue">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-ink">Scattered Files</h3>
              <p className="text-xs text-muted-ink leading-relaxed">
                Proposal PDFs spread across emails, WhatsApp threads, and clouds. Organizers lose draft control while sponsors struggle to retrieve clean documents.
              </p>
            </div>

            <div className="bg-white border border-border p-6 rounded-2xl text-left space-y-3">
              <div className="w-8 h-8 rounded-lg bg-surface-soft border border-border flex items-center justify-center text-accent-blue">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-ink">Zero Status Tracking</h3>
              <p className="text-xs text-muted-ink leading-relaxed">
                Applications vanish into corporate black holes. Organizers never know if their proposals were opened, reviewed, or rejected.
              </p>
            </div>

            <div className="bg-white border border-border p-6 rounded-2xl text-left space-y-3">
              <div className="w-8 h-8 rounded-lg bg-surface-soft border border-border flex items-center justify-center text-silver">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-ink">Unstructured Inbox</h3>
              <p className="text-xs text-muted-ink leading-relaxed">
                Companies receive endless, unstructured cold sponsorship emails daily. Reviewing budgets without standardization is painfully slow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SOLUTION SECTION */}
      <section id="solution" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-left">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-ink">
                One unified platform for proposals, applications, and decisions.
              </h2>
              <p className="text-sm md:text-base text-muted-ink leading-relaxed">
                Eventora integrates event details, proposal file uploads, corporate requirements, and real-time status transitions under one clean interface. Focus on bringing partnerships to life, not chase down emails.
              </p>

              <ul className="space-y-3.5 pt-2">
                <li className="flex items-start text-xs font-semibold text-ink">
                  <span className="w-5 h-5 rounded-full bg-soft-blue flex items-center justify-center text-accent-blue mr-3 flex-shrink-0">
                    &bull;
                  </span>
                  <span>Structured events linked with verified PDF proposals</span>
                </li>
                <li className="flex items-start text-xs font-semibold text-ink">
                  <span className="w-5 h-5 rounded-full bg-soft-blue flex items-center justify-center text-accent-blue mr-3 flex-shrink-0">
                    &bull;
                  </span>
                  <span>Match filters based on corporate preferences & support types</span>
                </li>
                <li className="flex items-start text-xs font-semibold text-ink">
                  <span className="w-5 h-5 rounded-full bg-soft-blue flex items-center justify-center text-accent-blue mr-3 flex-shrink-0">
                    &bull;
                  </span>
                  <span>Direct contact activation upon application approval</span>
                </li>
              </ul>
            </div>

            {/* Right Side Visual Flow Animation */}
            <div>
              <SponsorshipFlowAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS TIMELINE */}
      <section id="how-it-works" className="py-20 md:py-28 bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-ink">
              Turn outreach into a linear flow.
            </h2>
            <p className="text-sm text-muted-ink">
              Four structured milestones to move partnerships from early draft to legal sign-off.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <div className="bg-white border border-border p-6 rounded-2xl relative space-y-3">
              <span className="text-xs font-bold text-accent-blue px-2 py-0.5 bg-soft-blue rounded-md">Step 01</span>
              <h3 className="text-sm font-bold text-ink">Create an Event</h3>
              <p className="text-xs text-muted-ink leading-relaxed">
                Add target audience numbers, category type, location details, and budget metrics.
              </p>
            </div>

            <div className="bg-white border border-border p-6 rounded-2xl relative space-y-3">
              <span className="text-xs font-bold text-accent-blue px-2 py-0.5 bg-soft-blue rounded-md">Step 02</span>
              <h3 className="text-sm font-bold text-ink">Upload Proposal PDF</h3>
              <p className="text-xs text-muted-ink leading-relaxed">
                Provide one central, validated PDF deck that corporate sponsors can preview and download directly.
              </p>
            </div>

            <div className="bg-white border border-border p-6 rounded-2xl relative space-y-3">
              <span className="text-xs font-bold text-accent-blue px-2 py-0.5 bg-soft-blue rounded-md">Step 03</span>
              <h3 className="text-sm font-bold text-ink">Apply to Sponsors</h3>
              <p className="text-xs text-muted-ink leading-relaxed">
                Customize cover letters and select preferred support scopes to match with target companies.
              </p>
            </div>

            <div className="bg-white border border-border p-6 rounded-2xl relative space-y-3">
              <span className="text-xs font-bold text-accent-blue px-2 py-0.5 bg-soft-blue rounded-md">Step 04</span>
              <h3 className="text-sm font-bold text-ink">Track and Decapsulate</h3>
              <p className="text-xs text-muted-ink leading-relaxed">
                Monitor status logs and unlock mutual contacts to finalize legal contracts upon sponsor approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ROLE EXPLANATIONS */}
      <section id="organizers" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-ink font-semibold">
              Tailored for every actor in the ecosystem.
            </h2>
            <p className="text-sm text-muted-ink">
              Three clean dashboards tailored to separate access scopes.
            </p>
          </div>

          <div id="companies" className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Event Organizer Card */}
            <div className="border border-border p-8 rounded-2xl bg-white shadow-sm flex flex-col justify-between hover:border-accent-blue/30 transition-colors">
              <div className="space-y-4 text-left">
                <span className="inline-flex p-2 bg-soft-blue text-primary-blue rounded-xl border border-primary-blue/15">
                  <Calendar className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-ink">Event Organizer</h3>
                <p className="text-xs text-muted-ink leading-relaxed">
                  Focus on gathering sponsors with high efficiency. Create event files, upload PDFs, explore directories, compile bookmarks, draft letters, and schedule pitching appointments.
                </p>
              </div>
              <div className="pt-6 text-left">
                <Link
                  to="/register?role=organisasi"
                  className="inline-flex items-center text-xs font-bold text-primary-blue hover:text-accent-blue"
                >
                  Join as Organizer
                  <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Company Sponsor Card */}
            <div className="border border-border p-8 rounded-2xl bg-white shadow-sm flex flex-col justify-between hover:border-accent-blue/30 transition-colors">
              <div className="space-y-4 text-left">
                <span className="inline-flex p-2 bg-soft-blue text-accent-blue rounded-xl border border-accent-blue/15">
                  <Building2 className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-ink">Corporate Sponsor</h3>
                <p className="text-xs text-muted-ink leading-relaxed">
                  Review applications without messy chats. Assess cover letters, download structured PDF decks, manage decision history, and accept or reject with formal feedback notes.
                </p>
              </div>
              <div className="pt-6 text-left">
                <Link
                  to="/register?role=perusahaan"
                  className="inline-flex items-center text-xs font-bold text-accent-blue hover:text-primary-blue"
                >
                  Join as Corporate Partner
                  <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Platform Admin Card */}
            <div className="border border-border p-8 rounded-2xl bg-white shadow-sm flex flex-col justify-between hover:border-accent-blue/30 transition-colors">
              <div className="space-y-4 text-left">
                <span className="inline-flex p-2 bg-surface-soft text-muted-ink rounded-xl border border-border-strong">
                  <Lock className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-ink">System Administrator</h3>
                <p className="text-xs text-muted-ink leading-relaxed">
                  Maintain control over site security. Banish non-compliant users, moderate hidden events, compile operational reports, and monitor sponsorship pipelines as a read-only moderator.
                </p>
              </div>
              <div className="pt-6 text-left">
                <Link
                  to="/login"
                  className="inline-flex items-center text-xs font-bold text-muted-ink hover:text-ink"
                >
                  Access Control Center
                  <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIAL MARQUEE */}
      <section className="py-20 md:py-24 bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 space-y-3">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-ink">
            Loved by organizers and sponsor committees
          </h2>
          <p className="text-xs text-muted-ink">
            See how real companies and communities use Eventora to manage sponsorship workflows.
          </p>
        </div>
        <TestimonialMarquee />
      </section>

      {/* 7. CTA SECTION */}
      <section className="bg-primary-blue py-16 md:py-24 relative overflow-hidden text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(46,134,171,0.22),transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Ready to streamline your sponsorship pipeline?
          </h2>
          <p className="text-sm md:text-base text-silver max-w-xl mx-auto leading-relaxed">
            Create a free account today. Start building structured event files and discover the right corporate partners.
          </p>
          <div className="pt-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-xl text-primary-blue bg-white hover:bg-silver/10 hover:text-white border border-white transition-all shadow-md group"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
