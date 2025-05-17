import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Cell = {
  isGoal: any
  cost: number
  row: number
  col: number
}

type BackgroundState = {
  grid: Cell[][]
}

const initialState: BackgroundState = {
  grid: []
}

const backgroundSlice = createSlice({
  name: 'background',
  initialState,
  reducers: {
    setBackground(state, action: PayloadAction<Cell[][]>) {
      state.grid = action.payload
    },
    clearBackground(state) {
      state.grid = []
    }
  }
})

export const { setBackground, clearBackground } = backgroundSlice.actions
export default backgroundSlice.reducer
