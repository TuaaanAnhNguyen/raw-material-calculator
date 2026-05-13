// src/service/addToDatabase.ts

import { supabaseClient } from "./supabase";

export const addItem = async (inputName: string, inputCategory: string) => {
  const { data, error } = await supabaseClient
    .from("items")
    .insert({ name: inputName, category: inputCategory });

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
    amount: ing.count,
  }));

  const { data, error } = await supabaseClient
    .from("recipes")
    .insert(recipeData);

  if (error) throw error;
  return data;
};
