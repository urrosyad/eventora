import { ReactNode, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Menu, X } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Desktop Admin Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute right-4 top-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-lg text-muted-ink hover:text-ink hover:bg-surface-soft"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* We can reuse the AdminSidebar layout inside the mobile container by closing on link clicks */}
        <div onClick={() => setIsMobileMenuOpen(false)} className="h-full">
          <AdminSidebar />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 overflow-y-auto">
        {/* Top visual accent line for Premium style */}
        <div className="h-1.5 bg-gradient-to-r from-primary-blue via-accent-blue to-silver flex-shrink-0" />
        
        {/* Mobile Header Bar */}
        <header className="md:hidden h-14 bg-white border-b border-border px-4 flex items-center justify-between flex-shrink-0">
          <span className="text-base font-bold text-primary-blue">
            Eventora <span className="text-[10px] bg-soft-blue text-accent-blue px-1.5 py-0.5 rounded uppercase">Admin</span>
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg border border-border hover:bg-surface-soft text-ink"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        <main className="p-4 md:p-8 max-w-[1600px] w-full mx-auto animate-fade-in flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
