import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  studies: [],
};

const studySlice = createSlice({
  name: "study",
  initialState,
  reducers: {
    setStudies: (state, action) => {
      state.studies = action.payload;
    },
  },
});

export const { setStudies } = studySlice.actions;

export default studySlice.reducer;
