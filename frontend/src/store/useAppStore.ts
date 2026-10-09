import { create } from "zustand";
import { api } from "@/lib/api";

import { User, Path } from "@/types";

interface AppState {
  user: User | null;
  path: Path | null;
  loading: boolean;
  fetchData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  path: null,
  loading: true,
  fetchData: async () => {
    try {
      set({ loading: true });
      const [userRes, pathRes] = await Promise.all([
        api.get("/me"),
        api.get("/course/path")
      ]);
      set({ user: userRes.data, path: pathRes.data, loading: false });
    } catch (error) {
      console.error("Failed to fetch initial data", error);
      set({ loading: false });
    }
  }
}));
