import { create } from "zustand";

export const UserStore = create((set, get) => ({
  // timer for each chart
  sortBy: 0,
  setSortBy: (n) => set({ sortBy: n }),
  
  loaded: null,
  setLoaded: (file) => set({ loaded: file }),
}));
