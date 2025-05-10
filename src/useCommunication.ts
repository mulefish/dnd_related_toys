import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setParams, setGrid } from './store/gridSlice';
import { setCreatures } from './store/creatureSlice';

const SQRT3 = Math.sqrt(3);

export function useCommunication(
  viewportWidth: number,
  viewportHeight: number,
  hexCols: number,
  hexRows: number
) {
  const dispatch = useDispatch();

  useEffect(() => {
    const calcDimensions = () => {
      const maxRadiusX = viewportWidth / (((hexCols - 1) * 3) / 2 + 2);
      const maxRadiusY = viewportHeight / ((hexRows - 1) * SQRT3 + 1);
      const hexRadius = Math.min(maxRadiusX, maxRadiusY);

      return {
        hexRadius: Math.round(hexRadius),
        hexWidth: Math.round(hexRadius * 2),
        hexHeight: Math.round(SQRT3 * hexRadius),
        horizSpacing: Math.round(1.5 * hexRadius),
        vertSpacing: Math.round(SQRT3 * hexRadius),
        offsetX: 0,
        offsetY: 20,
      };
    };

    const fetchGridAndCreatures = async () => {
      const dimensions = calcDimensions();
      dispatch(setParams(dimensions));

      try {
        const gridResponse = await fetch('http://localhost:5000/grid-params', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hexCols, hexRows }),
        });

        if (!gridResponse.ok) throw new Error('Failed to fetch grid');
        const grid = await gridResponse.json();
        dispatch(setGrid(grid));
      } catch (err) {
        console.error('Grid fetch failed:', err);
      }

      try {
        const creatureResponse = await fetch('http://localhost:5000/combatants');
        if (!creatureResponse.ok) throw new Error('Failed to fetch creatures');
        const creatures = await creatureResponse.json();
        console.log( creatures)
        dispatch(setCreatures(creatures));
      } catch (err) {
        console.error('Creature fetch failed:', err);
      }
    };

    fetchGridAndCreatures();
  }, [viewportWidth, viewportHeight, hexCols, hexRows, dispatch]);
}
