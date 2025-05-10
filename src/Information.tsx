import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { nextCreature } from './store/creatureSlice';
import './index.css';

export default function Information() {
  const dispatch = useDispatch();
  const creatures = useSelector((state: RootState) => state.creatures.creatures);
  const activeIndex = useSelector((state: RootState) => state.creatures.activeIndex);

  return (
    <div className="creature-list">
      <h3>Creatures</h3>
      <button onClick={() => dispatch(nextCreature())}>
        Next Creature
      </button>

      {creatures.length === 0 ? (
        <p style={{ fontStyle: 'italic', color: '#888' }}>No creatures loaded...</p>
      ) : (
        <ul>
          {creatures.map((c, i) => (
            <li
              key={i}
              className={`creature-card ${c.species === 'ORC' ? 'orc' : 'elf'}`}
              style={{
                backgroundColor: i === activeIndex ? 'yellow' : undefined,
              }}
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
