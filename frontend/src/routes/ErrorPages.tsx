import { Link } from "react-router-dom";
import { ShieldAlert, AlertTriangle, ArrowLeft, Heart, Compass } from "lucide-react";

export function ForbiddenPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-background">
      <div className="w-16 h-16 rounded-full bg-danger/5 border border-danger/20 flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8 text-danger" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        403 - Access Denied
      </h1>
      <p className="mt-4 text-base text-muted-ink max-w-md">
        You do not have the required permissions to access this control screen. Please return to your role workspace.
      </p>
      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-primary-blue hover:bg-primary-blue/90 rounded-xl shadow-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Safety
        </Link>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-background">
      <div className="w-16 h-16 rounded-full bg-warning/5 border border-warning/20 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-warning" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        404 - Page Not Found
      </h1>
      <p className="mt-4 text-base text-muted-ink max-w-md">
        The requested path could not be located on the Eventora host. It may have been moved, moderated, or deleted.
      </p>
      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-primary-blue hover:bg-primary-blue/90 rounded-xl shadow-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in text-sm text-muted-ink leading-relaxed">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-ink tracking-tight">About Eventora</h1>
        <p className="text-base text-muted-ink max-w-lg mx-auto">
          Eventora is a digital management network built to optimize sponsor acquisition pipelines for organizers and corporate agencies.
        </p>
      </div>

      <div className="bg-white border border-border rounded-2xl p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-ink mb-2">Our Goal</h3>
          <p>
            Securing event sponsorship has historically been an unstructured, offline process involving manual cold emails, PDF proposal fatigue, and opaque decision tracking. Eventora offers a central workspace where Event Organizers can publish verified event briefs, upload proposal files, and apply for sponsorship from corporate partners directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6">
          <div>
            <h4 className="font-bold text-ink mb-2 flex items-center">
              <Compass className="w-4 h-4 mr-2 text-primary-blue" /> For Organizers
            </h4>
            <p className="text-xs">
              Instantly broadcast event details, upload proposals, look up matched corporate partners, manage bookmarked sponsors, and track application feedback in real-time.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-ink mb-2 flex items-center">
              <Heart className="w-4 h-4 mr-2 text-accent-blue" /> For Sponsors
            </h4>
            <p className="text-xs">
              Explore qualified event proposals, filter by budget and category, receive direct applications with tailored cover letters, and manage incoming sponsorship requests via a unified review workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
