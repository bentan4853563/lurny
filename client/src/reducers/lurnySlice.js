import { createSlice } from "@reduxjs/toolkit";

// Initial state for the lurnies slice
const initialState = {
  lurnies: [],
};

// Create a slice for lurnies with actions to manipulate the data
const lurnySlice = createSlice({
  name: "lurny",
  initialState,
  reducers: {
    // Action to set the array of lurnies
    setLurnies: (state, action) => {
      state.lurnies = action.payload;
    },
    // Action to insert a new lurny at the beginning of the array
    insertLurny: (state, action) => {
      // Directly add to the beginning without reconstructing the whole array
      state.lurnies.unshift(...action.payload);
    },
    // Action to mark a lurny as shared based on its _id
    shareLurny: (state, action) => {
      const lurny = state.lurnies.find((lurny) => lurny._id === action.payload);
      if (lurny) {
        lurny.shared = true;
      }
    },
    // Action to update a lurny based on its _id
    updateLurny: (state, action) => {
      const index = state.lurnies.findIndex(
        (lurny) => lurny._id === action.payload._id
      );
      if (index !== -1) {
        state.lurnies[index] = { ...state.lurnies[index], ...action.payload };
      }
    },
    // Action to delete a lurny based on its _id
    deleteLurny: (state, action) => {
      state.lurnies = state.lurnies.filter(
        (lurny) => lurny._id !== action.payload
      );
    },
    // Action to clear all lurnies
    clearLurnies: (state) => {
      state.lurnies = [];
    },
  },
});

// Export the action creators for use in dispatching actions
export const {
  setLurnies,
  insertLurny,
  shareLurny,
  updateLurny,
  deleteLurny,
  clearLurnies,
} = lurnySlice.actions;

// Export the reducer for inclusion in the store
export default lurnySlice.reducer;
