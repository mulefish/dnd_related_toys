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

type GridState = {
  params: HexParams | null;
};

const initialState: GridState = {
  params: null,
};

export const gridSlice = createSlice({
  name: 'grid',
  initialState,
  reducers: {
    setParams: (state, action: PayloadAction<HexParams>) => {
      state.params = action.payload;
    },
  },
});

export const { setParams } = gridSlice.actions;
export default gridSlice.reducer;
