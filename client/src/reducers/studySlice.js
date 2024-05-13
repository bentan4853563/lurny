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
    setStudy: (state, action) => {
      state.studies = state.studies.map((study) =>
        study._id === action.payload._id ? action.payload : study
      );
    },
  },
});

export const { setStudies, setStudy } = studySlice.actions;

export default studySlice.reducer;
