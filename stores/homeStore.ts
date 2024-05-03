export const useHomeStore = defineStore({
    id: "home",
    state: () => ({
        showVideo: false,
    }),

    persist:
        [{ storage: persistedState.localStorage, paths: ['globalLoading'] }],

    getters: {},
    actions: {},
});
