import {create} from "zustand";
import {api_host} from "./api_url";


class InteractedRecipe {
    constructor(recipeId, action) {
        this.recipeId = recipeId;
        this.action = action;
    }
}

export const useStore = create((set,get) => ({
    recipes : [],
    filtered_recipes: [],
    included_ingredients:[],
    getRecipes: async () => {
        try {
            const response = await fetch(`http://${api_host}:8000/recipes/get_recipes/`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            set({ recipes: data });
            set({ filtered_recipes: data });
        } catch (error) {
            console.error("Failed to fetch cards:", error);
        }
    },
    filterRecipes: ()=>{
        let {recipes, included_ingredients,interactedRecipes} = get();

        interactedRecipes.forEach((interactedRecipe) => {
            recipes = recipes.filter(recipe => recipe.id !== interactedRecipe.recipeId);
        })

        if (included_ingredients.length === 0) {
            set({ filtered_recipes: recipes });
            return;
        }

        let filtered_recipes = []
        for (let recipe of recipes) {
            let hasAllIngredients = included_ingredients.every(ingredient =>
                recipe.ingredients.includes(ingredient));
            if (hasAllIngredients) {
                filtered_recipes.push(recipe);
            }
        }

        set({ filtered_recipes: filtered_recipes });
    },
    interactedRecipes: [],
    addInteractedRecipe: (recipeId,action) => set((state) => ({
        interactedRecipes: [...state.interactedRecipes, new InteractedRecipe(recipeId, action)],
    })),
    addIngredient: (ingredient) => set((state) => ({
        included_ingredients: [...state.included_ingredients, ingredient],
    })),
    removeIngredient: (ingredient) => set((state) => ({
        included_ingredients: state.included_ingredients.filter(i => i !== ingredient),
    })),
}));