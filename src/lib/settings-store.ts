import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
    language: "EN" | "ES";
    currency: "USD" | "COP";
    setLanguage: (lang: "EN" | "ES") => void;
    setCurrency: (curr: "USD" | "COP") => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            language: "EN",
            currency: "USD",
            setLanguage: (language) => set({ language }),
            setCurrency: (currency) => set({ currency }),
        }),
        {
            name: "nxst-settings",
        }
    )
);
