import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useCommunication } from '../hooks/useCommunication';
import LoadingModal from '../components/LoadingModal';
import GameCanvas from './GameCanvas';
import Information from './Information';
import './Home.css';

export default function Home() {
  const { fetchGlobals, createBackground, startGame, runTurn } = useCommunication();
  const loading = useSelector((state: RootState) => state.globals.loading);

  useEffect(() => {
    const init = async () => {
      await fetchGlobals();
      await createBackground("Home");
      await startGame();
    };
    init();
  }, []);

  return (
    <>
      <LoadingModal visible={loading} />
      <div className="home-container">
        <Information
          createBackground={createBackground}
          startGame={startGame}
          runTurn={runTurn}
        />
        <GameCanvas />
      </div>
    </>
  );
}
