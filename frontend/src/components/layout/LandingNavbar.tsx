import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Menu, X, ArrowRight } from "lucide-react";

export function LandingNavbar() {
  const { token, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync mobile menu close on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/" && location.pathname !== "/home") {
      navigate(`/?scrollTo=${sectionId}`);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 bg-surface-soft/80 backdrop-blur-md border-b border-border/85 ${
        scrolled ? "shadow-sm" : "shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-primary-blue">
              Eventora
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavClick("hero")}
              className="text-sm font-medium text-muted-ink hover:text-primary-blue transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("about")}
              className="text-sm font-medium text-muted-ink hover:text-primary-blue transition-colors"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick("organizers")}
              className="text-sm font-medium text-muted-ink hover:text-primary-blue transition-colors"
            >
              For Organizers
            </button>
            <button
              onClick={() => handleNavClick("companies")}
              className="text-sm font-medium text-muted-ink hover:text-primary-blue transition-colors"
            >
              For Companies
            </button>
            <button
              onClick={() => handleNavClick("how-it-works")}
              className="text-sm font-medium text-muted-ink hover:text-primary-blue transition-colors"
            >
              How It Works
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            {token && user ? (
              <Link
                to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-primary-blue hover:bg-primary-blue/90 shadow-sm hover:shadow transition-all"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-muted-ink hover:text-primary-blue px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-primary-blue hover:bg-primary-blue/90 shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-muted-ink hover:bg-surface-soft transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Sheet) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] z-40 bg-white/95 backdrop-blur-md border-t border-border animate-fade-in">
          <nav className="flex flex-col p-6 space-y-6">
            <button
              onClick={() => handleNavClick("hero")}
              className="text-left text-lg font-medium text-ink hover:text-primary-blue py-2 border-b border-border/50"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("about")}
              className="text-left text-lg font-medium text-ink hover:text-primary-blue py-2 border-b border-border/50"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick("organizers")}
              className="text-left text-lg font-medium text-ink hover:text-primary-blue py-2 border-b border-border/50"
            >
              For Organizers
            </button>
            <button
              onClick={() => handleNavClick("companies")}
              className="text-left text-lg font-medium text-ink hover:text-primary-blue py-2 border-b border-border/50"
            >
              For Companies
            </button>
            <button
              onClick={() => handleNavClick("how-it-works")}
              className="text-left text-lg font-medium text-ink hover:text-primary-blue py-2 border-b border-border/50"
            >
              How It Works
            </button>

            <div className="pt-6 flex flex-col space-y-4">
              {token && user ? (
                <Link
                  to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                  className="w-full inline-flex items-center justify-center px-4 py-3 text-base font-medium rounded-xl text-white bg-primary-blue hover:bg-primary-blue/90 shadow-sm"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full text-center px-4 py-3 text-base font-medium text-muted-ink hover:bg-surface-soft rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full inline-flex items-center justify-center px-4 py-3 text-base font-medium rounded-xl text-white bg-primary-blue hover:bg-primary-blue/90 shadow-sm"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
