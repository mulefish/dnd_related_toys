import { JSX, useEffect, useState } from 'react';
import './index.css';

export default function GatheringInformation(): JSX.Element {
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gathering-info">
      <div>Building hex grid...</div>
      <div style={{ marginTop: '10px', fontSize: '14px', color: '#888' }}>
        Elapsed time: {elapsed.toLocaleString()} ms
      </div>
    </div>
  );
}