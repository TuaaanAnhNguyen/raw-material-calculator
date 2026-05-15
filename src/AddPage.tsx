// src/AddPage.tsx

import { useEffect, useState } from "react";
import { addItem, addRecipe, getAllItems } from "./service/supabaseCRUD";

export default function AddPage() {
  const [newItem, setNewItem] = useState({ name: "", category: "Misc" });
  const [targetItem, setTargetItem] = useState("");
  const [rows, setRows] = useState([{ material: "", count: 1 }]);

  const [itemList, setItemList] = useState<{ name: string }[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    refreshItemList();
  }, []);

  const handleAddItem = async () => {
    try {
      await addItem(newItem.name, newItem.category);
      alert(`${newItem.name} registered!`);
      setNewItem({ name: "", category: "Misc" });
      refreshItemList();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      alert(
        `Error adding item. Check if it already exists. Error: ${errorMessage}`,
      );
    }
  };

  const handleAddRecipeRow = () =>
    setRows([...rows, { material: "", count: 1 }]);

  const handleSubmitRecipe = async () => {
    try {
      await addRecipe(targetItem, rows);
      alert("Recipe added successfully!");
      setRows([{ material: "", count: 1 }]);
      setTargetItem("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      alert(
        `Error adding recipe. Ensure materials exist in items table. Error: ${errorMessage}`,
      );
    }
  };

  const refreshItemList = async () => {
    try {
      const data = await getAllItems();
      setItemList(data || []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error("Failed to fetch items for suggestions");
    }
  };

  return (
    <div className="add-page-wrapper">
      <datalist id="item-suggestions">
        {itemList.map((item) => (
          <option key={item.name} value={item.name} />
        ))}
      </datalist>

      <header className="add-page-header">
        <h1>Add Page Page :hegif:</h1>
      </header>

      <div className="add-page-flex-container">
        <div className="add-page-column">
          <div className="add-page-card">
            <h2>1. Register New Item</h2>
            <p className="subtitle">
              Every material must exist here before being used in a recipe.
            </p>

            <div className="input-stack">
              <label>Item Name</label>
              <input
                className="counter"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />

              <label>Category</label>
              <select
                className="counter"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
              >
                <option value="Misc">Misc</option>
                <option value="Currency">Currency</option>
                <option value="Core">Core</option>
                <option value="Essence">Essence</option>
                <option value="Orb">Orb</option>
                <option value="Ore">Ore</option>
                <option value="Weapon">Weapon</option>
              </select>

              <button className="copy-btn save-btn" onClick={handleAddItem}>
                Register Item
              </button>
            </div>
          </div>
        </div>

        <div className="add-page-column">
          <div className="add-page-card">
            <h2>2. Add Recipe</h2>
            <p className="subtitle">
              Link multiple materials to a parent item.
            </p>

            <div className="input-stack">
              <input
                className="counter"
                list="item-suggestions"
                value={targetItem}
                onChange={(e) => setTargetItem(e.target.value)}
                placeholder="Search or type parent item..."
              />

              <label>Target (Parent) Item</label>
              <input
                className="counter"
                value={targetItem}
                list="item-suggestions"
                onChange={(e) => setTargetItem(e.target.value)}
              />

              <div className="recipe-rows-container">
                <label>Ingredients</label>
                {rows.map((row, idx) => (
                  <div key={idx} className="recipe-form-row">
                    <input
                      className="counter"
                      value={row.material}
                      list="item-suggestions"
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[idx].material = e.target.value;
                        setRows(newRows);
                      }}
                    />
                    <input
                      className="counter qty-small"
                      type="number"
                      value={row.count}
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[idx].count = parseInt(e.target.value) || 0;
                        setRows(newRows);
                      }}
                    />
                    {!itemList.find((i) => i.name === row.material) &&
                      row.material !== "" && (
                        <span style={{ color: "#ff4444", fontSize: "10px" }}>
                          Item does not exist
                        </span>
                      )}
                  </div>
                ))}
              </div>

              <div className="action-buttons">
                <button className="copy-btn" onClick={handleAddRecipeRow}>
                  + Add Ingredient
                </button>
                <button
                  className="copy-btn save-btn"
                  onClick={handleSubmitRecipe}
                >
                  Save Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
