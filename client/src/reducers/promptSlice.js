import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  prompts: {},
};

const promptSlice = createSlice({
  name: "prompt",
  initialState,
  reducers: {
    setPrompts: (state, action) => {
      state.prompts = action.payload;
    },
  },
});

export const { setPrompts } = promptSlice.actions;

export default promptSlice.reducer;
