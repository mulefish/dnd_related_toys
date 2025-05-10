import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Creature = {
  name: string;
  species: string;
  col: number;
  row: number;
  angle: number;
  cost: number;
  [key: string]: any; // to allow flexible attributes
};

type CreatureState = {
  creatures: Creature[];
};

const initialState: CreatureState = {
  creatures: [],
};

export const creatureSlice = createSlice({
  name: 'creatures',
  initialState,
  reducers: {
    setCreatures(state, action: PayloadAction<Creature[]>) {
      state.creatures = action.payload;
    },
  },
});

export const { setCreatures } = creatureSlice.actions;
export default creatureSlice.reducer;
