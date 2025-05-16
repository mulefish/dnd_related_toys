// src/components/LoadingModal.tsx
import { useEffect, useState } from 'react';
import './LoadingModal.css';

export default function LoadingModal({ visible }: { visible: boolean }) {
  const [timer, setTimer] = useState(0.1);

  useEffect(() => {
    if (!visible) return;

    setTimer(0.1);
    const interval = setInterval(() => {
      setTimer((prev) => {
        const next = Math.max(0, prev - 0.01);
        return next;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Loading globals... ({timer.toFixed(2)}s)</p>
      </div>
    </div>
  );
}
