interface Recipe {
    id: number;
    title: string;
    image: string;
}

interface Ingredient {
    image: string;
    amount: number;
    unitShort: string;
    name: string;
}

type RecipeArray = Recipe[];

export { Recipe, RecipeArray, Ingredient };