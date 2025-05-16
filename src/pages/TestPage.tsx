import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useCommunication } from '../hooks/useCommunication';

export default function TestPage() {
  const { fetchGlobals, startGame, runTurn } = useCommunication();
  const globals = useSelector((state: RootState) => state.globals);
  const [textAreaContent, setTextAreaContent] = useState('');
  const [rows, setRows] = useState(100);
  const [cols, setCols] = useState(200);

  useEffect(() => {
    const combined = {
      globals: globals.data,
      elves: globals.elves,
      orcs: globals.orcs,
    };
    setTextAreaContent(JSON.stringify(combined, null, 2));
  }, [globals.data, globals.elves, globals.orcs]);
  const clearTextArea = () => {
    setTextAreaContent('')
  }

  return (
    <div>
      <button onClick={fetchGlobals} disabled={globals.loading}>
        {globals.loading ? 'Loading...' : 'Fetch Globals'}
      </button>
      <button onClick={startGame}>Start Game</button>
      <button onClick={runTurn}>Run Turn</button>
      <button onClick={()=>clearTextArea()}>Clear</button>
      <div style={{ marginTop: '1rem' }}>
        <textarea
          rows={rows}
          cols={cols}
          value={textAreaContent}
          readOnly
          style={{ fontFamily: 'monospace' }}
        />
      </div>
      {globals.error && <p style={{ color: 'red' }}>Error: {globals.error}</p>}
    </div>
  );
}
