import { createSlice } from "@reduxjs/toolkit";

// Initial state with a prompts object which will hold key-value pairs.
const initialState = {
  prompts: {},
};

// Create a slice for prompts with actions to manipulate the data.
const promptSlice = createSlice({
  name: "prompt", // The name used in action types
  initialState, // The initial state for the slice
  reducers: {
    // Action to set the entire prompts object. Payload should be an object.
    setPrompts: (state, action) => {
      state.prompts = action.payload;
    },
  },
});

// Export the action creators for use in dispatching actions to store.
export const { setPrompts } = promptSlice.actions;

// Export the reducer for inclusion in the Redux store.
export default promptSlice.reducer;
