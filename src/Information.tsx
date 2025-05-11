import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { nextCreature } from './store/creatureSlice';
import './index.css';
import { useCommunication } from './useCommunication';
import { toggleShowLabels } from './store/gridSlice';
import { toggleRangeForActive } from './store/creatureSlice';


export default function Information() {
  const dispatch = useDispatch();
  const creatures = useSelector((state: RootState) => state.creatures.creatures);
  const activeIndex = useSelector((state: RootState) => state.creatures.activeIndex);
  const showLabels = useSelector((state: RootState) => state.grid.showLabels);
  
  const { moveActiveCreature } = useCommunication(0, 0);

  const activeCreature = activeIndex != null ? creatures[activeIndex] : null;

  return (
    <div className="creature-list">
      <h3>Creatures</h3>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
        <button onClick={() => dispatch(nextCreature())}>Next Creature</button>
        <button onClick={moveActiveCreature}>Move Active Creature</button>
        <button onClick={() => dispatch(toggleShowLabels())}>
          {showLabels ? 'Hide Labels' : 'Show Labels'}
        </button>
 <button onClick={() => dispatch(toggleRangeForActive())}>
  {activeCreature?.showRange ? 'Hide Range' : 'Show Range'}
</button>
      </div>

      {activeCreature ? (
        <div className="creature-details" style={{ marginBottom: '1em', fontSize: '0.9em' }}>
          <h4>Details</h4>
          <ul style={{ paddingLeft: '1em' }}>
            {Object.entries(activeCreature).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {String(value)}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ fontStyle: 'italic', color: '#888' }}>No creature selected</p>
      )}

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
