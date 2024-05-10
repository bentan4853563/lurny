import { createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  lurnies: [],
};

// Define the lurnies slice
const lurnySlice = createSlice({
  name: "lurny",
  initialState,
  reducers: {
    setLurnies: (state, action) => {
      state.lurnies = action.payload;
    },
    insertLurny: (state, action) => {
      console.log("action.payload", action.payload);
      return {
        ...state,
        lurnies: [...action.payload, ...state.lurnies],
      };
    },
    shareLurny: (state, action) => {
      state.lurnies = state.lurnies.map((item) =>
        item._id === action.payload ? { ...item, shared: true } : item
      );
    },
    deleteLurny: (state, action) => {
      state.lurnies = state.lurnies.filter(
        (item) => item._id !== action.payload
      );
    },
    clearLurnies: (state) => {
      state.lurnies = [];
    },
  },
});

export const {
  setLurnies,
  insertLurny,
  shareLurny,
  deleteLurny,
  clearLurnies,
} = lurnySlice.actions;

export default lurnySlice.reducer;
