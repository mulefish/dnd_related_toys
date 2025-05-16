import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useCommunication } from '../hooks/useCommunication';
import LoadingModal from '../components/LoadingModal';
import GameCanvas from './GameCanvas'; 
import Information from './Information';
import './Home.css';

function LeftPanel() {
  return (
    <div className="left-panel">
      <h2>Information</h2>
    </div>
  );
}



export default function Home() {
  const { fetchGlobals } = useCommunication();
  const loading = useSelector((state: RootState) => state.globals.loading);

  // Auto-fetch globals on first render
  useEffect(() => {
    fetchGlobals();
  }, []);

  return (
    <>
      <LoadingModal visible={loading} />
      <div className="home-container">
      <Information />
      <GameCanvas/>

      </div>
    </>
  );
}
