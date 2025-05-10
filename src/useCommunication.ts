import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setParams, setGrid } from './store/gridSlice';
import { setCreatures } from './store/creatureSlice';

const SQRT3 = Math.sqrt(3);

export function useCommunication(viewportWidth: number, viewportHeight: number) {
  const dispatch = useDispatch();
  const [dimensionsFetched, setDimensionsFetched] = useState(false);

  useEffect(() => {
    const fetchGridAndCreatures = async () => {
      try {
        // Step 1: Fetch grid from backend, which now includes hexRows and hexCols internally
        const gridResponse = await fetch('http://localhost:5000/grid-params', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}) // no hexRows/Cols passed — server uses globals
        });

        if (!gridResponse.ok) throw new Error('Failed to fetch grid');
        const grid = await gridResponse.json();

        // Derive hexRows and hexCols from the returned grid
        const hexRows = grid.length;
        const hexCols = grid[0]?.length || 0;

        // Step 2: Compute dimensions using real values from backend
        const maxRadiusX = viewportWidth / (((hexCols - 1) * 3) / 2 + 2);
        const maxRadiusY = viewportHeight / ((hexRows - 1) * SQRT3 + 1);
        const hexRadius = Math.min(maxRadiusX, maxRadiusY);

        const dimensions = {
          hexRadius: Math.round(hexRadius),
          hexWidth: Math.round(hexRadius * 2),
          hexHeight: Math.round(SQRT3 * hexRadius),
          horizSpacing: Math.round(1.5 * hexRadius),
          vertSpacing: Math.round(SQRT3 * hexRadius),
          offsetX: 0,
          offsetY: 20,
        };

        dispatch(setParams(dimensions));
        dispatch(setGrid(grid));
        setDimensionsFetched(true);
      } catch (err) {
        console.error('Grid fetch failed:', err);
      }

      try {
        const creatureResponse = await fetch('http://localhost:5000/combatants');
        if (!creatureResponse.ok) throw new Error('Failed to fetch creatures');
        const creatures = await creatureResponse.json();
        dispatch(setCreatures(creatures));
      } catch (err) {
        console.error('Creature fetch failed:', err);
      }
    };

    fetchGridAndCreatures();
  }, [viewportWidth, viewportHeight, dispatch]);
}
