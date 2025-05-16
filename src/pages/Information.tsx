import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useCommunication } from '../hooks/useCommunication';
import { logPink } from './../common';
import { toggleShowHexIds } from '../store/globalsSlice';

export default function Information() {
  const { fetchGlobals, startGame, runTurn } = useCommunication();
  const globals = useSelector((state: RootState) => state.globals);
  const dispatch = useDispatch();

  useEffect(() => {
    const combined = {
      globals: globals.data,
      elves: globals.elves,
      orcs: globals.orcs,
    };
    logPink(combined);
  }, [globals.data, globals.elves, globals.orcs]);

  return (
    <div style={{ width: '100%', padding: '1rem', backgroundColor: '#f0f0f0' }}>
            <button onClick={startGame}>Start Game</button>
      <button onClick={runTurn}>Run Turn</button>
      <button onClick={() => dispatch(toggleShowHexIds())}>
        {globals.isShowHexIds ? 'Show' : 'Hide'}
      </button>
    </div>
  );
}
