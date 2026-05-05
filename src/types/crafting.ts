// src/types/crafting.ts

export type MaterialCategory =
  | "Ore"
  | "Orb"
  | "Essence"
  | "Currency"
  | "Misc"
  | "Core";

export interface Ingredient {
  category: MaterialCategory;
  material: string;
  count: number;
}

export type RecipeBook = Record<string, Ingredient[]>;

export interface TotalResult {
  material: string;
  category: MaterialCategory;
  totalCount: number;
}
