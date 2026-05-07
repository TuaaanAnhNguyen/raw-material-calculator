// src/AddPage.tsx

import { useState } from "react";
import { addItem, addRecipe } from "./service/addToDatabase";

export default function AddPage() {
  // State for Add Item
  const [newItem, setNewItem] = useState({ name: "", category: "Misc" });
  
  // State for Add Recipe
  const [targetItem, setTargetItem] = useState("");
  const [rows, setRows] = useState([{ material: "", count: 1 }]);

  const handleAddItem = async () => {
    try {
      await addItem(newItem.name, newItem.category);
      alert(`${newItem.name} registered!`);
      setNewItem({ name: "", category: "Misc" });
    } catch (err) {
      alert(`Error adding item. Check if it already exists. Error: ${err.message}`);
    }
  };

  const handleAddRecipeRow = () => setRows([...rows, { material: "", count: 1 }]);

  const handleSubmitRecipe = async () => {
    try {
      await addRecipe(targetItem, rows);
      alert("Recipe added successfully!");
      setRows([{ material: "", count: 1 }]);
      setTargetItem("");
    } catch (err) {
      alert(`Error adding recipe. Ensure materials exist in items table. Error: ${err.message}`);
    }
  };

  return (
    <div className="add-page-wrapper">
      <header className="add-page-header">
        <h1>Add Page Page :hegif:</h1>
      </header>

      <div className="add-page-flex-container">
        {/* Column 1: Add Items */}
        <div className="add-page-column">
          <div className="add-page-card">
            <h2>1. Register New Item</h2>
            <p className="subtitle">Every material must exist here before being used in a recipe.</p>
            
            <div className="input-stack">
              <label>Item Name</label>
              <input
                className="counter"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
              
              <label>Category</label>
              <select
                className="counter"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
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

        {/* Column 2: Add Recipes */}
        <div className="add-page-column">
          <div className="add-page-card">
            <h2>2. Build Recipe</h2>
            <p className="subtitle">Link multiple materials to a parent item.</p>

            <div className="input-stack">
              <label>Target (Parent) Item</label>
              <input
                className="counter"
                value={targetItem}
                onChange={(e) => setTargetItem(e.target.value)}
              />

              <div className="recipe-rows-container">
                <label>Ingredients</label>
                {rows.map((row, idx) => (
                  <div key={idx} className="recipe-form-row">
                    <input
                      className="counter"
                      value={row.material}
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
                  </div>
                ))}
              </div>

              <div className="action-buttons">
                <button className="copy-btn" onClick={handleAddRecipeRow}>
                  + Add Ingredient
                </button>
                <button className="copy-btn save-btn" onClick={handleSubmitRecipe}>
                  Save Complete Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}