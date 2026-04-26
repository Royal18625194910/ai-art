import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  // 用户信息
  clerkId: string | null;
  email: string | null;
  name: string | null;
  imageUrl: string | null;
  convexUserId: string | null;
  credits: number;
  isSynced: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: Partial<Omit<UserState, 'setUser' | 'clearUser' | 'updateCredits'>>) => void;
  updateCredits: (credits: number) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setSynced: (synced: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Initial state
      clerkId: null,
      email: null,
      name: null,
      imageUrl: null,
      convexUserId: null,
      credits: 0,
      isSynced: false,
      isLoading: false,

      // Set user data
      setUser: (user) => set((state) => ({ ...state, ...user })),

      // Update credits
      updateCredits: (credits) => set({ credits }),

      // Clear all user data (logout)
      clearUser: () =>
        set({
          clerkId: null,
          email: null,
          name: null,
          imageUrl: null,
          convexUserId: null,
          credits: 0,
          isSynced: false,
          isLoading: false,
        }),

      // Set loading state
      setLoading: (loading) => set({ isLoading: loading }),

      // Set synced state
      setSynced: (synced) => set({ isSynced: synced }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        clerkId: state.clerkId,
        email: state.email,
        name: state.name,
        imageUrl: state.imageUrl,
        convexUserId: state.convexUserId,
        credits: state.credits,
        isSynced: state.isSynced,
      }),
    }
  )
);
