import { useState, useEffect } from "react";
import "./App.css";

import { calculateRawMaterials } from "./service/calculator";
import { supabaseClient } from "./service/supabase";
import { type TotalResult } from "./types/crafting";
import { copyToClipboard } from "./service/clipboard";

function App() {
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [results, setResults] = useState<TotalResult[]>([]);
  const [craftableItems, setCraftableItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);

  // fetch craftable items
  useEffect(() => {
    async function getDropdownOptions() {
      const { data } = await supabaseClient
        .from("recipes")
        .select("parent_item");
      if (data) {
        const uniqueNames = Array.from(
          new Set(data.map((r) => r.parent_item)),
        ).sort();
        setCraftableItems(uniqueNames);
        if (uniqueNames.length > 0) setSelectedItem(uniqueNames[0]);
      }
    }
    getDropdownOptions();
  }, []);

  // calculation trigger
  useEffect(() => {
    let isMounted = true;
    if (selectedItem) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      calculateRawMaterials(selectedItem, quantity).then((data) => {
        if (isMounted) {
          setResults(data);
          setLoading(false);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [selectedItem, quantity]);

  const handleCopy = async () => {
    const success = await copyToClipboard(results, selectedItem, quantity);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <section id="center">
        <div className="header-content">
          <h1>Raw Material Calculator</h1>
          <div className="controls">
            <select
              className="counter main-select"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              {craftableItems.length === 0 && <option>Loading...</option>}
              {craftableItems.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="counter qty-input"
              value={quantity}
              min="1"
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
          </div>
        </div>

        <div className="results-container">
          <div className="table-actions">
            {results.length > 0 && (
              <button
                className={`copy-btn ${copied ? "copied" : ""}`}
                onClick={handleCopy}
              >
                {copied ? "✓ Copied" : "Copy to Clipboard"}
              </button>
            )}

            {loading && (
              <div className="loading-overlay">
                <span>Updating...</span>
              </div>
            )}
          </div>

          <table className="results-table">
            <thead>
              <tr>
                <th>Material</th>
                <th>Category</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody
              style={{
                opacity: loading ? 0.4 : 1,
                transition: "opacity 0.2s ease",
              }}
            >
              {results.length > 0
                ? results.map((res) => (
                    <tr key={res.material}>
                      <td>{res.material}</td>
                      <td>
                        <span className={`badge ${res.category.toLowerCase()}`}>
                          {res.category}
                        </span>
                      </td>
                      <td className="amount-cell">
                        {res.totalCount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td colSpan={3} className="empty-state">
                        No ingredients found.
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>

          {loading && (
            <div className="loading-overlay">
              <span>Updating...</span>
            </div>
          )}
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default App;
