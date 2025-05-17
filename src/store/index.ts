import { configureStore } from '@reduxjs/toolkit';
import globalsReducer from './globalsSlice';
import backgroundReducer from './backgroundSlice'; 

export const store = configureStore({
  reducer: {
    globals: globalsReducer,
    background: backgroundReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
