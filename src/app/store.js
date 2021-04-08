import { configureStore } from '@reduxjs/toolkit';
import deckReducer from "../features/deck/deckSlice"
import counterReducer from '../features/counter/counterSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    gameState: deckReducer,
  },
});

