// src/store/globalsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Creature {
  name: string;
  race: string;
  x: number;
  y: number;
  hp: number;
  angle: number;
  hitpoints:number
}

interface GlobalsState {
  data: Record<string, any> | null;
  loading: boolean;
  error: string | null;
  elves: Record<string, Creature>;
  orcs: Record<string, Creature>;
  isShowHexIds: boolean;
}

const initialState: GlobalsState = {
  data: null,
  loading: false,
  error: null,
  elves: {},
  orcs: {},
  isShowHexIds: false
};

export const globalsSlice = createSlice({
  name: 'globals',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setGlobals(state, action: PayloadAction<Record<string, any>>) {
      state.data = action.payload;
      state.loading = false;
    },
    setCreatures(state, action: PayloadAction<{ elves: any; orcs: any }>) {
      state.elves = action.payload.elves;
      state.orcs = action.payload.orcs;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    toggleShowHexIds(state) {
      state.isShowHexIds = !state.isShowHexIds;
    }
  },
});

export const { startLoading, setGlobals, setCreatures, setError,toggleShowHexIds  } = globalsSlice.actions;
export default globalsSlice.reducer;
