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
  grid: HexTile[][];  // 2D array of tiles
};

const initialState: GridState = {
  params: null,
  grid: [],
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
  },
});

export const { setParams, setGrid } = gridSlice.actions;
export default gridSlice.reducer;
