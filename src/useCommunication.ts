import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setParams, setGrid } from './store/gridSlice';
import { setCreatures, updateCreatures } from './store/creatureSlice';
import { RootState } from './store/store';
import { logPink } from './common'; 
const SQRT3 = Math.sqrt(3);

export function useCommunication(viewportWidth: number, viewportHeight: number) {
  const dispatch = useDispatch();
  const [dimensionsFetched, setDimensionsFetched] = useState(false);
  const activeIndex = useSelector((state: RootState) => state.creatures.activeIndex);

  useEffect(() => {
    const fetchGridAndCreatures = async () => {
      try {
        const gridResponse = await fetch('http://localhost:5000/grid-params', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });

        if (!gridResponse.ok) throw new Error('Failed to fetch grid');
        const grid = await gridResponse.json();

        const hexRows = grid.length;
        const hexCols = grid[0]?.length || 0;

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

  const moveActiveCreature = async () => {
    try {
      const response = await fetch('http://localhost:5000/makeTheNextCreatureMove', {
        method: 'POST',
          body: JSON.stringify({ activeIndex }),
      });

      if (!response.ok) throw new Error('Failed to move creature');

      const updatedCreatures = await response.json();
      dispatch(updateCreatures(updatedCreatures));

    } catch (err) {
      console.error('Movement error:', err);
    }
  };

  return { moveActiveCreature, dimensionsFetched, updateCreatures };
}

