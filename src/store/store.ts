// store.ts
import { configureStore } from '@reduxjs/toolkit';
import gridReducer from './gridSlice';

export const store = configureStore({
  reducer: {
    grid: gridReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
