import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type HexParams = {
  hexRadius: number;
  hexWidth: number;
  hexHeight: number;
  horizSpacing: number;
  vertSpacing: number;
  offsetX: number;
  offsetY: number;
};

type HexTile = {
  row: number;
  col: number;
  cost: number;
};

type GridState = {
  params: HexParams | null;
  grid: HexTile[][];
  showLabels: boolean;
};

const initialState: GridState = {
  params: null,
  grid: [],
  showLabels: false
};

export const gridSlice = createSlice({
  name: 'grid',
  initialState,
  reducers: {
    setParams: (state, action: PayloadAction<HexParams>) => {
      state.params = action.payload;
    },
    setGrid: (state, action: PayloadAction<HexTile[][]>) => {
      state.grid = action.payload;
    },
    toggleShowLabels: (state) => {
      state.showLabels = !state.showLabels;
    },
  },
});

export const { setParams, setGrid, toggleShowLabels  } = gridSlice.actions;
export default gridSlice.reducer;
