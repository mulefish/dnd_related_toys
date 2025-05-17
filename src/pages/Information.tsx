import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleShowHexIds } from '../store/globalsSlice';

interface InformationProps {
  createBackground: (caller: string) => void;
  startGame: () => void;
  runTurn: () => void;
}

export default function Information({ createBackground, startGame, runTurn }: InformationProps) {
  const globals = useSelector((state: RootState) => state.globals);
  const dispatch = useDispatch();

  useEffect(() => {
    const combined = {
      globals: globals.data,
      elves: globals.elves,
      orcs: globals.orcs,
    };
    // logPink(combined); // Optional for debugging
  }, [globals.data, globals.elves, globals.orcs]);

  return (
    <div style={{ width: '100%', padding: '1rem', backgroundColor: '#f0f0f0' }}>
      <button onClick={() => createBackground("Information.tsx")}>Create Board</button>
      <button onClick={startGame}>Start Game</button>
      <button onClick={runTurn}>Run Turn</button>
      <button onClick={() => dispatch(toggleShowHexIds())}>
        {globals.isShowHexIds ? 'Show' : 'Hide'}
      </button>
    </div>
  );
}
