// vuetify.config.ts
import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'
import type { ThemeDefinition } from "vuetify";
const Darktheme: ThemeDefinition = {
    dark: true,
    colors: {
        background: "#111b27",
        surface: "#1E293B",
        primary: "#705CF6",
        secondary: "#598EF3",
        accent: "#705CF6",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
    },
};
const Lighttheme: ThemeDefinition = {
    dark: false,
    variables: {
        "high-emphasis-opacity": 1,
    },
    colors: {
        background: "#f2f5f8",
        surface: "#ffffff",
        primary: "#344767",
        secondary: "#334155",
        accent: "#705CF6",
        error: "#ef476f",
        info: "#2196F3",
        success: "#06d6a0",
        "on-success": "#ffffff",
        warning: "#ffd166",
    },
};
export default defineVuetifyConfiguration({
    /* vuetify options */
    config:false,
    icons: {
        defaultSet: 'mdi',
        sets: ['mdi', 'fa']
    },
    theme: {
        themes: {
            light: Lighttheme,
            dark: Darktheme,
        },
    },
    defaults:{
        VBtn: {
            rounded: "md",
            fontWeight: "400",
            letterSpacing: "0",
            variant:'text'
        },
        VCard: {},
        VSheet: {
            elevation: 1,
        },
        VTable: {
            elevation: 1,
        },

        VDataTable: {
            fixedHeader: true,
            noDataText: "Results not found",
        },
        VTextField: {
            variant: "solo",
        },
        VSelect: {
            variant: "solo",
        },
    }
})