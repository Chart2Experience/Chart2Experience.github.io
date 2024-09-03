import { create } from "zustand";

export const SORTS = ["default", "int", "mem", "tru", "emp", "aes", "itt", "cft"]
export const CATS = ["int", "mem", "tru", "emp", "aes", "itt", "cft"]
export const CATS_WHY = ["int-why", "mem-why", "tru-why", "emp-why", "aes-why", "itt-why", "cft-why"]

export const UserStore = create((set, get) => ({
  // timer for each chart
  sortBy: "default",
  setSortBy: (n) => set({ sortBy: n }),

  currentImage: 0,
  setCurrentImage: (img) => set({ currentImage: img }),

  currentAttribute: 0,
  setCurrentAttribute: (att) => set({ currentAttribute: att }),

  currentScore: 0,
  setCurrentScore: (score) => set({ currentScore: score }),

  // data
  loaded: null,
  setLoaded: (file) => set({ loaded: file }),

  // data
  loadedMean: null,
  setLoadedMean: (file) => set({ loadedMean: file }),
}));
