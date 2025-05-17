import { useDispatch } from 'react-redux';
import { useRef } from 'react';
import { setGlobals, setCreatures, startLoading, setError } from '../store/globalsSlice';
import { setBackground } from '../store/backgroundSlice';

import { AppDispatch } from '../store';

export function useCommunication() {
  const dispatch = useDispatch<AppDispatch>();

  const isCallingGlobals = useRef(false);
  const isCallingBackground = useRef(false);
  const isCallingStartGame = useRef(false);
  const isCallingRunTurn = useRef(false);

  const fetchGlobals = async () => {
    if (isCallingGlobals.current) {
      console.warn('fetchGlobals ignored (already in progress)');
      return;
    }

    isCallingGlobals.current = true;
    dispatch(startLoading());
    try {
      const response = await fetch('http://localhost:5000/get-globals');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      dispatch(setGlobals(data));
    } catch (err: any) {
      const message = err?.message || 'Unknown error during fetchGlobals';
      alert(`Error: ${message}`);
      dispatch(setError(message));
    } finally {
      isCallingGlobals.current = false;
    }
  };

  const createBackground = async (caller: string) => {
    if (isCallingBackground.current) {
      console.warn(`createBackground from ${caller} ignored (already in progress)`);
      return;
    }

    isCallingBackground.current = true;
    try {
      const response = await fetch('http://localhost:5000/create-background', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to create background');

      const data = await response.json();

      if (data) {
        dispatch(setBackground(data));
        const goalCells = data.flat().filter((cell: { isGoal: any }) => cell.isGoal);
        console.log(`createBackground called by: ${caller}, goals: ${goalCells.length}`);
      } else {
        console.log('createBackground returned empty or unexpected data:', data);
      }

      if (data.elves && data.orcs) {
        dispatch(setCreatures({ elves: data.elves, orcs: data.orcs }));
      }
    } catch (err: any) {
      const message = err?.message || 'Unknown error during createBackground';
      alert(`Error: ${message}`);
      console.error('createBackground error', err);
    } finally {
      isCallingBackground.current = false;
    }
  };

  const startGame = async () => {
    if (isCallingStartGame.current) {
      console.warn('startGame ignored (already in progress)');
      return;
    }

    isCallingStartGame.current = true;
    try {
      const response = await fetch('http://localhost:5000/start-game', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to start game');
      const data = await response.json();
      dispatch(setCreatures({ elves: data.elves, orcs: data.orcs }));
    } catch (err: any) {
      const message = err?.message || 'Unknown error during startGame';
      alert(`Error: ${message}`);
      console.error('startGame error', err);
    } finally {
      isCallingStartGame.current = false;
    }
  };

  const runTurn = async () => {
    if (isCallingRunTurn.current) {
      console.warn('runTurn ignored (already in progress)');
      return;
    }

    isCallingRunTurn.current = true;
    try {
      const response = await fetch('http://localhost:5000/run-turn', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to run turn');
      const data = await response.json();
      dispatch(setCreatures({ elves: data.elves, orcs: data.orcs }));
    } catch (err: any) {
      const message = err?.message || 'Unknown error during runTurn';
      alert(`Error: ${message}`);
      console.error('runTurn error', err);
    } finally {
      isCallingRunTurn.current = false;
    }
  };

  return { fetchGlobals, startGame, runTurn, createBackground };
}
