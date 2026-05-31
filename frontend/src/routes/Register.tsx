import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Sparkles, Building2 } from "lucide-react";
import { ApiResponse } from "@/types";

type SelectedRole = "organisasi" | "perusahaan";

export function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<SelectedRole>("organisasi");
  const [isLoading, setIsLoading] = useState(false);

  // Read initial role from search query if provided (e.g. ?role=perusahaan)
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "organisasi" || roleParam === "perusahaan") {
      setRole(roleParam as SelectedRole);
    }
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post<ApiResponse<any>>("/auth/register", {
        email,
        password,
        role,
      });

      toast.success("Registration successful! Please sign in with your new account.");
      navigate("/login");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Registration failed. Email might already exist.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
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
          <h2 className="mt-6 text-xl font-bold text-ink">Create a new account</h2>
          <p className="mt-1 text-sm text-muted-ink">
            Or{" "}
            <Link to="/login" className="font-medium text-accent-blue hover:underline">
              sign in to your account
            </Link>
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-surface-soft p-1.5 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setRole("organisasi")}
            disabled={isLoading}
            className={`flex items-center justify-center space-x-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              role === "organisasi"
                ? "bg-white text-primary-blue shadow-sm border border-border"
                : "text-muted-ink hover:text-ink"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Organizer</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("perusahaan")}
            disabled={isLoading}
            className={`flex items-center justify-center space-x-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              role === "perusahaan"
                ? "bg-white text-accent-blue shadow-sm border border-border"
                : "text-muted-ink hover:text-ink"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Sponsor</span>
          </button>
        </div>

        {/* Form */}
        <form className="mt-6 space-y-6" onSubmit={handleRegister}>
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
                  placeholder="At least 8 characters"
                  className="w-full pl-10 pr-3 py-2 text-sm bg-white border border-border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue placeholder:text-silver disabled:opacity-50"
                />
                <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-silver" />
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-ink leading-relaxed text-left bg-surface-soft/60 p-3 rounded-xl border border-border/40">
            By signing up, you register as a verified actor. Accounts are immediately active. Complete your corporate details or organizer profile on the next step to unlock event posting and sponsorship application modules.
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-xl text-white shadow-sm hover:shadow transition-all disabled:opacity-50 ${
                role === "organisasi" ? "bg-primary-blue hover:bg-primary-blue/90" : "bg-accent-blue hover:bg-accent-blue/90"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
