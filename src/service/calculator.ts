// src/service/calculator.ts

import { supabaseClient } from "./supabase";
import { type MaterialCategory, type TotalResult } from "../types/crafting";

export async function calculateRawMaterials(
  targetItem: string,
  quantity: number,
): Promise<TotalResult[]> {
  const { data: recipes, error: recError } = await supabaseClient
    .from("recipes")
    .select("*");
  const { data: items, error: itemError } = await supabaseClient
    .from("items")
    .select("name, category");

  if (recError || itemError) {
    console.error("Database fetch failed:", recError || itemError);
    return [];
  }

  const categoryMap: Record<string, MaterialCategory> = {};
  items.forEach((item) => {
    categoryMap[item.name] = item.category as MaterialCategory;
  });

  // create a lookup map for recipes
  // maps: "Aeriastra" -> [{material: "Cash", count: 1000000}, ...]
  const recipeBook: Record<string, { material: string; count: number }[]> = {};

  recipes.forEach((row) => {
    if (!recipeBook[row.parent_item]) recipeBook[row.parent_item] = [];
    recipeBook[row.parent_item].push({
      material: row.material,
      count: row.amount,
    });
  });

  // recursive aggregation
  const totals: Record<string, number> = {};

  const solve = (itemName: string, multiplier: number) => {
    const ingredients = recipeBook[itemName];

    if (ingredients && ingredients.length > 0) {
      // if its a craftable item, loop back and dig in its butt twin :v:
      ingredients.forEach((ing) => solve(ing.material, ing.count * multiplier));
    } else {
      // if its raw material, add to totals
      totals[itemName] = (totals[itemName] || 0) + multiplier;
    }
  };

  solve(targetItem, quantity);

  return Object.entries(totals)
    .map(([name, count]) => ({
      material: name,
      category: categoryMap[name] || "Misc",
      totalCount: count,
    }))
    .sort(
      (a, b) =>
        a.category.localeCompare(b.category) ||
        a.material.localeCompare(b.material),
    );
}
