import { useState } from 'react';
import HexCanvas from './HexCanvas';
import { useCommunication } from './useCommunication';

export default function App() {
  const [showLabels, setShowLabels] = useState(false);

  useCommunication(); // fire the network call on mount

  return (
    <div style={{ display: 'flex', height: '100vh', boxSizing: 'border-box' }}>
      <div
        style={{
          width: '300px',
          padding: '10px',
          boxSizing: 'border-box',
          borderRight: '1px solid #ccc',
        }}
      >
        <button onClick={() => setShowLabels((prev) => !prev)}>
          {showLabels ? 'Hide Hex Labels' : 'Show Hex Labels'}
        </button>
        <h3>Unit Table</h3>
        <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>HP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Elf</td>
              <td>100</td>
            </tr>
            <tr>
              <td>Orc</td>
              <td>120</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ flex: 1, padding: '10px' }}>
        <HexCanvas showLabels={showLabels} />
      </div>
    </div>
  );
}