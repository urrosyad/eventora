import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { LandingNavbar } from "./LandingNavbar";

interface LandingLayoutProps {
  children: ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  const location = useLocation();
  const isLandingPage = location.pathname === "/" || location.pathname === "/home";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      {/* Glass Floating Navigation */}
      {!isAuthPage && <LandingNavbar />}

      {/* Main page content */}
      <div className={`flex-grow ${isLandingPage || isAuthPage ? "" : "pt-16"}`}>
        {children}
      </div>

      {/* Corporate Professional Footer */}
      {!isAuthPage && (
        <footer className="bg-white border-t border-border py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1 space-y-4">
                <div className="flex items-center">
                  <img src="/eventoraLogo.png" alt="EVENTORA" className="h-6 w-auto object-contain" />
                </div>
                <p className="text-sm text-muted-ink leading-relaxed">
                  Platform digital sponsorship management system connecting event organizers and corporate partners transparently.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-4">
                  Platform
                </h3>
                <ul className="space-y-2 text-sm text-muted-ink">
                  <li>For Event Organizers</li>
                  <li>For Corporate Sponsors</li>
                  <li>Proposal Directory</li>
                  <li>Security & Trust</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-4">
                  Company
                </h3>
                <ul className="space-y-2 text-sm text-muted-ink">
                  <li>About Eventora</li>
                  <li>Terms of Service</li>
                  <li>Privacy Policy</li>
                  <li>Contact Support</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-4">
                  Location
                </h3>
                <p className="text-sm text-muted-ink leading-relaxed">
                  Eventora Indonesia<br />
                  Pondok Indah Office Tower<br />
                  Jakarta Selatan, DKI Jakarta
                </p>
              </div>
            </div>

            <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-xs text-muted-ink">
                &copy; {new Date().getFullYear()} EVENTORA. All rights reserved. Built for professional collaboration.
              </p>
              <div className="flex space-x-6 text-xs text-muted-ink">
                <span>English (US)</span>
                <span>ID Proxy Enabled</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
