import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

import { calculateRawMaterials } from "./service/calculator";
import { supabaseClient } from "./service/supabase";
import { type TotalResult } from "./types/crafting";

function App() {
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const [results, setResults] = useState<TotalResult[]>([]);
  const [craftableItems, setCraftableItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // fetch list of craftable items
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

  // calculate materials when item or quantity changes
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

  return (
    <>
      <section id="center">
        <div className="hero">
          <img
            src={heroImg}
            className="base"
            width="170"
            height="179"
            alt="Hero"
          />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>

        <div>
          <h1>Raw Material Calculator</h1>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              justifyContent: "center",
            }}
          >
            <select
              className="counter"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              {craftableItems.length === 0 && <option>Loading items...</option>}
              {craftableItems.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="counter"
              style={{ width: "80px" }}
              value={quantity}
              min="1"
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
          </div>
        </div>

        <div
          className="results-table"
          style={{ width: "100%", maxWidth: "600px", marginTop: "20px" }}
        >
          {loading ? (
            <div style={{ padding: "40px", opacity: 0.5 }}>
              Querying Database...
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                textAlign: "left",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "12px 8px" }}>Material</th>
                  <th style={{ padding: "12px 8px" }}>Category</th>
                  <th style={{ padding: "12px 8px", textAlign: "right" }}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? (
                  results.map((res) => (
                    <tr
                      key={res.material}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        fontSize: "14px",
                      }}
                    >
                      <td style={{ padding: "10px 8px" }}>{res.material}</td>
                      <td style={{ padding: "10px 8px" }}>
                        <span className={`badge ${res.category.toLowerCase()}`}>
                          {res.category}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "10px 8px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        {res.totalCount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        opacity: 0.5,
                      }}
                    >
                      No ingredients found for this item.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default App;
