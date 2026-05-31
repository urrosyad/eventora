import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Organization, Company } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  organization: Organization | null;
  company: Company | null;
  setAuth: (
    token: string,
    user: User,
    profileData?: { organization?: Organization | null; company?: Company | null }
  ) => void;
  clearAuth: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateProfile: (profileData: { organization?: Organization | null; company?: Company | null }) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      organization: null,
      company: null,

      setAuth: (token, user, profileData) => {
        set({
          token,
          user,
          organization: profileData?.organization || null,
          company: profileData?.company || null,
        });
      },

      clearAuth: () => {
        set({ token: null, user: null, organization: null, company: null });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      updateProfile: (profileData) => {
        set((state) => ({
          organization: profileData.organization !== undefined ? (profileData.organization ? { ...state.organization, ...profileData.organization } as Organization : null) : state.organization,
          company: profileData.company !== undefined ? (profileData.company ? { ...state.company, ...profileData.company } as Company : null) : state.company,
        }));
      },
    }),
    {
      name: "eventora-auth-storage",
    }
  )
);
