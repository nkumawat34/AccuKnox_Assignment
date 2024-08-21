import { createSlice } from '@reduxjs/toolkit';
import initialCategories from './data.json'; // Ensure correct path to your JSON file

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: initialCategories.categories, // Use JSON data as initial state
  reducers: {
    addWidget: (state, action) => {
      const { categoryIndex, widget } = action.payload;
      state[categoryIndex].widgets.push(widget);
    },
    removeWidget: (state, action) => {
      const { categoryIndex, widgetIndex } = action.payload;
      state[categoryIndex].widgets.splice(widgetIndex, 1);
    },
  },
});

export const { addWidget, removeWidget } = categoriesSlice.actions;
export default categoriesSlice.reducer;
