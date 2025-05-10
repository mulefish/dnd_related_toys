import React, { useEffect, useState } from 'react';
import HexCanvas from './HexCanvas';
import { useCommunication } from './useCommunication';
import GatheringInformation from './GatheringInformation';
import Information from './Information';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

const HEX_COLS = 30;
const HEX_ROWS = 20;
const SIDEBAR_WIDTH = 250;
const VIEWPORT_MARGIN = 24;

export default function App() {

  const params = useSelector((state: RootState) => state.grid.params);
  const grid = useSelector((state: RootState) => state.grid.grid);

  const isReady = params !== null && grid.length > 0;


  const [viewportWidth, setViewportWidth] = useState<number>(
    window.innerWidth - SIDEBAR_WIDTH - VIEWPORT_MARGIN
  );
  const [viewportHeight, setViewportHeight] = useState<number>(
    window.innerHeight - 120
  );

  useCommunication(viewportWidth, viewportHeight, HEX_COLS, HEX_ROWS);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth - SIDEBAR_WIDTH - VIEWPORT_MARGIN);
      setViewportHeight(window.innerHeight - 120);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: `${SIDEBAR_WIDTH}px`, borderRight: '1px solid #ccc' }}>
        <Information />
      </div>

      <div className="hex-container">
        {isReady ? (
          <HexCanvas
            width={viewportWidth}
            height={viewportHeight}
          />
        ) : (
          <GatheringInformation />
        )}
      </div>
    </div>
  );
}
