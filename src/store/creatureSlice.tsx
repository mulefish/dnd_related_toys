import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Creature = {
  name: string;
  species: string;
  col: number;
  row: number;
  angle: number;
  cost: number;
  [key: string]: any;
};

type CreatureState = {
  creatures: Creature[];
  activeIndex: number | null;
};

const initialState: CreatureState = {
  creatures: [],
  activeIndex: null,
};


export const creatureSlice = createSlice({
  name: 'creatures',
  initialState,
  reducers: {
    setCreatures(state, action: PayloadAction<Creature[]>) {
      state.creatures = action.payload;
      state.activeIndex = action.payload.length > 0 ? 0 : null;
    },
    nextCreature(state) {
      if (state.creatures.length === 0) return;
      state.activeIndex = state.activeIndex === null
        ? 0
        : (state.activeIndex + 1) % state.creatures.length;
    },
    updateCreatures(state, action: PayloadAction<Creature[]>) {
      state.creatures = action.payload;
    },
    setActiveCreature(state, action: PayloadAction<number>) {
      state.activeIndex = action.payload;
    }
  },
});

export const { setCreatures, nextCreature, updateCreatures, setActiveCreature } = creatureSlice.actions;
export default creatureSlice.reducer;