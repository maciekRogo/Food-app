import {create} from "zustand";
import {api_host} from "./api_url";

export const useStore = create((set) => ({
    recipes : [],
    filtered_recipes: [],
    getRecipes: async () => {
        try {
            const response = await fetch(`http://${api_host}:8000/recipes/get_recipes/`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("Fetched cards:", data);
            set({ cards: data });
            set({ filtered_recipes: data });
        } catch (error) {
            console.error("Failed to fetch cards:", error);
        }
    }
}));