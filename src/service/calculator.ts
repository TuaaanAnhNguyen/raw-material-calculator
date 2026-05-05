// src/service/calculator.ts

import { defaultRecipe } from "../data/defaultRecipe";
import {
  type MaterialCategory,
  type RecipeBook,
  type TotalResult,
} from "../types/crafting";

export function calculateRawMaterials(
  targetItem: string,
  quantity: number,
  customRecipes: RecipeBook = {},
): TotalResult[] {
  const allRecipes: RecipeBook = { ...defaultRecipe, ...customRecipes };

  const rawTotals = aggregateMaterials(allRecipes, targetItem, quantity);
  return formatResults(rawTotals);
}

function findCategory(
  materialName: string,
  book: RecipeBook,
): MaterialCategory {
  for (const item in book) {
    const found = book[item].find((i) => i.material === materialName);
    if (found) return found.category;
  }
  return "Misc";
}

const aggregateMaterials = (
  book: RecipeBook,
  targetItem: string,
  quantity: number,
): Record<string, { count: number; category: MaterialCategory }> => {
  const totals: Record<string, { count: number; category: MaterialCategory }> =
    {};

  const solve = (itemName: string, multiplier: number) => {
    const recipe = book[itemName];

    if (recipe && recipe.length > 0) {
      recipe.forEach((ing) => solve(ing.material, ing.count * multiplier));
    } else {
      if (!totals[itemName]) {
        totals[itemName] = { count: 0, category: findCategory(itemName, book) };
      }
      totals[itemName].count += multiplier;
    }
  };

  solve(targetItem, quantity);
  return totals;
};

export const formatResults = (
  totals: Record<string, { count: number; category: MaterialCategory }>,
): TotalResult[] => {
  return Object.entries(totals)
    .map(([name, data]) => ({
      material: name,
      category: data.category,
      totalCount: data.count,
    }))
    .sort(
      (a, b) =>
        a.category.localeCompare(b.category) ||
        a.material.localeCompare(b.material),
    );
};
