import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setParams } from './store/gridSlice';
import { AppDispatch } from './store/store';

const viewportWidth = 1000;
const viewportHeight = 1000;
const hexCols = 30;
const hexRows = 20;

export function useCommunication() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    fetch('http://localhost:5000/grid-params', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ viewportWidth, viewportHeight, hexCols, hexRows }),
    })
      .then((res) => res.json())
      .then((data) => dispatch(setParams(data)))
      .catch((err) => console.error('Failed to fetch grid params:', err));
  }, [dispatch]);
}
