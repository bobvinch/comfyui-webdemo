import type {KonvaBase, KonvaImage} from "~/utils/konvaUtils";

export const useKonvaStore = defineStore({
    id: "konva",
    state: () => ({
        data: [] as Array<KonvaImage>
    }),

    persist:
        [{storage: persistedState.localStorage, paths: ['data']}],

    getters: {},
    actions: {},
});
