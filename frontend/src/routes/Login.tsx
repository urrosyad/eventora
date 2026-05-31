import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Mail, Lock } from "lucide-react";
import { ApiResponse, User } from "@/types";

export function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redirectPath = searchParams.get("redirect");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Submit login credentials
      const res = await api.post<ApiResponse<{ token: string; user: User }>>("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data.data;

      if (!user.is_active) {
        toast.error("Your account has been banned by the administrator.");
        setIsLoading(false);
        return;
      }

      // 2. Fetch authenticated profile data
      const meRes = await api.get<ApiResponse<any>>("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profileData = meRes.data.data;

      // 3. Save into Zustand
      setAuth(token, user, {
        organization: user.role === "organisasi" ? profileData.organization : null,
        company: user.role === "perusahaan" ? profileData.company : null,
      });

      toast.success("Welcome back to Eventora!");

      // 4. Redirect based on verification status and role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (!profileData.is_verified) {
        navigate("/profile-completion");
      } else {
        navigate(redirectPath ? decodeURIComponent(redirectPath) : "/dashboard");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo logins helpers
  const handleQuickLogin = (demoRole: "admin" | "organisasi" | "perusahaan") => {
    switch (demoRole) {
      case "admin":
        setEmail("admin@eventora.com");
        setPassword("password123");
        break;
      case "organisasi":
        setEmail("organisasi@eventora.com");
        setPassword("password123");
        break;
      case "perusahaan":
        setEmail("perusahaan@eventora.com");
        setPassword("password123");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 grid-bg relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(46,134,171,0.06),transparent_60%)] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-white border border-border p-8 rounded-2xl shadow-xl relative z-10">
        {/* Brand */}
        <div className="text-center">
          <Link to="/" className="text-2xl font-bold tracking-tight text-primary-blue hover:opacity-90">
            Eventora
          </Link>
          <h2 className="mt-6 text-xl font-bold text-ink">Sign in to your account</h2>
          <p className="mt-1 text-sm text-muted-ink">
            Or{" "}
            <Link to="/register" className="font-medium text-accent-blue hover:underline">
              create a new account
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3 py-2 text-sm bg-white border border-border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue placeholder:text-silver disabled:opacity-50"
                />
                <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-silver" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2 text-sm bg-white border border-border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue placeholder:text-silver disabled:opacity-50"
                />
                <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-silver" />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary-blue hover:bg-primary-blue/90 shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {/* Demo login shortcuts */}
        <div className="border-t border-border pt-6 mt-6 space-y-3">
          <div className="flex items-center space-x-1.5 justify-center text-xs font-semibold text-muted-ink">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-blue" />
            <span>Developer Demo Accounts</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin")}
              className="px-2 py-1.5 text-[10px] font-bold border border-border rounded-lg bg-surface-soft hover:bg-border/35 text-ink transition-colors"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("organisasi")}
              className="px-2 py-1.5 text-[10px] font-bold border border-border rounded-lg bg-surface-soft hover:bg-border/35 text-ink transition-colors"
            >
              Organizer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("perusahaan")}
              className="px-2 py-1.5 text-[10px] font-bold border border-border rounded-lg bg-surface-soft hover:bg-border/35 text-ink transition-colors"
            >
              Sponsor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
