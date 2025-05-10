import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { toggleShowLabels } from './store/gridSlice';
import { JSX, useEffect } from 'react';
import './index.css';

export default function Information(): JSX.Element {
  const creatures = useSelector((state: RootState) => state.creatures.creatures);
  const showLabels = useSelector((state: RootState) => state.grid.showLabels);
  const dispatch = useDispatch();

  useEffect(() => {
    if (creatures.length > 0) {
      console.log('First creature:', creatures[0]);
    }
  }, [creatures]);

  const sortedCreatures = [...creatures].sort((a, b) => b.initiative - a.initiative);

  return (
    <div className="creature-list">
      <h3>Creatures</h3>
      <button
        onClick={() => dispatch(toggleShowLabels())}
        style={{ marginBottom: '10px' }}
      >
        {showLabels ? 'Hide Labels' : 'Show Labels'}
      </button>
      {creatures.length === 0 ? (
        <p style={{ fontStyle: 'italic', color: '#888' }}>No creatures loaded...</p>
      ) : (
        <ul>
          {sortedCreatures.map((c, i) => (
            <li
              key={i}
              className={`creature-card ${c.species === 'ORC' ? 'orc' : 'elf'}`}
            >
              <strong>{c.name}</strong> — {c.species}<br />
              Init: {c.initiative} | HP: {c.hitpoints} | ATK: {c.attack} | MOV: {c.movement}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
