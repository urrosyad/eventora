import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

interface ProfileCompletionGuardProps {
  children: ReactNode;
  shouldBeComplete?: boolean; // If true, requires profile to be complete. If false, handles redirection for incomplete path.
}

export function ProfileCompletionGuard({ children, shouldBeComplete = true }: ProfileCompletionGuardProps) {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin role does not have a profile completion requirements
  if (user.role === "admin") {
    if (!shouldBeComplete && location.pathname === "/profile-completion") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <>{children}</>;
  }

  const isComplete = user.is_verified;

  if (shouldBeComplete) {
    if (!isComplete) {
      // Force user to complete their profile first
      return <Navigate to="/profile-completion" replace />;
    }
  } else {
    // This is for `/profile-completion` page guard. If already complete, redirect to their main dashboard.
    if (isComplete) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
