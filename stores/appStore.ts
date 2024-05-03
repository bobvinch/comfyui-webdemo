import { defineStore } from "pinia";

export const useAppStore = defineStore({
  id: "app",
  state: () => ({
    globalLoading: false,
  }),

  persist:
    [{ storage: persistedState.localStorage, paths: ['globalLoading'] }],

  getters: {},
  actions: {},
});
