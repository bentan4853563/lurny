import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for the slice.
const initialState = {
  loading: false,
};

// Create a slice for loading with the name 'loading'.
export const loadingSlice = createSlice({
  name: "loading",

  // Initial state is set to the initialState object defined above.
  initialState,

  reducers: {
    // A reducer to set the loading state. It accepts an optional payload to explicitly define the loading state.
    setLoading: (state, action) => {
      state.loading = action.payload ?? true;
    },

    // A reducer to clear the loading state, i.e., set it to false.
    clearLoading: (state) => {
      state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function.
// These can be used to dispatch actions to set or clear the loading state.
export const { setLoading, clearLoading } = loadingSlice.actions;

// The reducer is exported as default. This will be used by the store configuration.
export default loadingSlice.reducer;
