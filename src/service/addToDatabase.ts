// src/service/addToDatabase.ts

import { supabaseClient } from "./supabase";

export const addItem = async (name: string, category: string) => {
  const { data, error } = await supabaseClient
    .from("items")
    .insert([{ item_name: name, category: category }]);

  if (error) throw error;
  return data;
};

export const addRecipe = async (
  parentItem: string,
  ingredients: { material: string; count: number }[],
) => {
  const recipeData = ingredients.map((ing) => ({
    parent_item: parentItem,
    material: ing.material,
    count: ing.count,
  }));

  const { data, error } = await supabaseClient
    .from("recipes")
    .insert(recipeData);

  if (error) throw error;
  return data;
};
