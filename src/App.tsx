import { useState, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import { defaultRecipe } from './data/defaultRecipe'
import { calculateRawMaterials } from './service/calculator'

function App() {
  const [selectedItem, setSelectedItem] = useState(Object.keys(defaultRecipe)[0]);
  const [quantity, setQuantity] = useState(1);

  const results = useMemo(() => {
    return calculateRawMaterials(selectedItem, quantity);
  }, [selectedItem, quantity]);

  const craftableItems = Object.keys(defaultRecipe).sort();

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>

        <div>
          <h1>Raw Material Calculator</h1>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
            <select 
              className="counter" 
              value={selectedItem} 
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              {craftableItems.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <input 
              type="number" 
              className="counter"
              style={{ width: '60px' }}
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
        </div>

        <div className="results-table" style={{ width: '100%', maxWidth: '600px' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '8px' }}>Material</th>
                <th style={{ padding: '8px' }}>Category</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res) => (
                <tr key={res.material} style={{ borderBottom: '1px solid var(--border)', fontSize: '14px' }}>
                  <td style={{ padding: '8px' }}>{res.material}</td>
                  <td style={{ padding: '8px' }}>
                    <small style={{ opacity: 0.7 }}>{res.category}</small>
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>
                    {res.totalCount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="ticks"></div>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App