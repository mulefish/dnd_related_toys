// store.ts
import { configureStore } from '@reduxjs/toolkit';
import gridReducer from './gridSlice';
import creatureReducer from './creatureSlice';

export const store = configureStore({
  reducer: {
    grid: gridReducer,
     creatures: creatureReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
