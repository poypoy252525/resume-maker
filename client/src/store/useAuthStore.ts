import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;

  // Actions
  setToken: (token: string) => void;
  setUser: (user: UserProfile) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: localStorage.getItem("auth_token"),
      user: null,
      isAuthenticated: !!localStorage.getItem("auth_token"),

      setToken: (token) => {
        localStorage.setItem("auth_token", token);
        set({ token, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      logout: () => {
        localStorage.removeItem("auth_token");
        set({ token: null, user: null, isAuthenticated: false });
      },

      fetchUser: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/auth/user/`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            set({
              user: {
                id: data.pk ?? data.id,
                email: data.email,
                name: data.display_name ?? data.first_name ?? data.email.split("@")[0],
                avatar: data.avatar ?? undefined,
              },
              isAuthenticated: true,
            });
          } else {
            // Token invalid
            get().logout();
          }
        } catch {
          // silently fail — network issue
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
