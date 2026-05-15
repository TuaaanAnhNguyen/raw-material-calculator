// src/service/supabaseCRUD.ts

// not tested + implemented fully

import { supabaseClient } from "./supabase";

// --------- GET --------

export const getItemsToCraft = async () => {
  const { data, error } = await supabaseClient
    .from("recipes")
    .select("parent_item");

  if (error) throw error;
  return data;
};

export const getAllItems = async () => {
  const { data, error } = await supabaseClient.from("items").select("*");

  if (error) throw error;
  return data;
};

export const fetchRecipesByThisItem = async (itemName: string) => {
  const { data, error } = await supabaseClient
    .from("recipes")
    .select("*")
    .eq("parent_item", itemName);

  if (error) throw error;
  return data;
};

// --------- ADD ---------

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

// --------- UPDATE ---------

export const updateExistingItem = async (
  itemName: string,
  newCategory: string,
) => {
  const { data, error } = await supabaseClient
    .from("items")
    .update({ category: newCategory })
    .eq("name", itemName);

  if (error) throw error;
  return data;
};

// --------- DELETE ---------

export const deleteExistingRecipe = async (parentItem: string) => {
  const { data, error } = await supabaseClient
    .from("recipes")
    .delete()
    .eq("parent_item", parentItem);

  if (error) throw error;
  return data;
};

export const deleteExistingItem = async (itemName: string) => {
  // this will also delete all the recipes that use this item as parent_item due to foreign key constraint with "ON DELETE CASCADE"
  const { data, error } = await supabaseClient
    .from("items")
    .delete()
    .eq("name", itemName);

  if (error) throw error;
  return data;
};

export const deleteOneSpecificRecipeRecord = async (
  parentItem: string,
  material: string,
) => {
  const { data, error } = await supabaseClient
    .from("recipes")
    .delete()
    .eq("parent_item", parentItem)
    .eq("material", material);

  if (error) throw error;
  return data;
};
