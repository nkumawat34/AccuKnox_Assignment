import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './CategoriesSlice';

const store = configureStore({
  reducer: {
    categories: categoriesReducer
  }
});

export default store;
