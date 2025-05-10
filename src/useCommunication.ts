// src/hooks/useCommunication.tsx
import { useDispatch } from 'react-redux';
import { setParams, setGrid } from './store/gridSlice';
import { useEffect } from 'react';

const SQRT3 = Math.sqrt(3);

export function useCommunication(viewportWidth: number, viewportHeight: number, hexCols: number, hexRows: number) {
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

    const fetchGrid = async () => {
      const dimensions = calcDimensions();
      dispatch(setParams(dimensions));


      try {
        const response = await fetch('http://localhost:5000/grid-params', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hexCols, hexRows }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const grid = await response.json();
        dispatch(setGrid(grid));

      } catch (error) {
        console.error('Error fetching grid:', error);
      }
    };

    fetchGrid();
  }, [viewportWidth, viewportHeight, hexCols, hexRows, dispatch]);
}
