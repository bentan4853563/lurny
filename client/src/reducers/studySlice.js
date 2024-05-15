import { createSlice } from "@reduxjs/toolkit";

// Initial state with an empty array for studies.
const initialState = {
  studies: [],
};

// Create a slice for studies with actions to manipulate the data.
const studySlice = createSlice({
  name: "study", // The name used in action types
  initialState, // The initial state for the slice
  reducers: {
    // Action to set the entire array of studies. Payload should be an array.
    setStudies: (state, action) => {
      state.studies = action.payload;
    },
    // Action to update an individual study within the array.
    // The payload should be an object representing the updated study.
    setStudy: (state, action) => {
      state.studies = state.studies.map((study) =>
        // Check if the current study matches the one being updated via _id
        study._id === action.payload._id ? action.payload : study
      );
    },
  },
});

// Export the action creators for use in dispatching actions to store.
export const { setStudies, setStudy } = studySlice.actions;

// Export the reducer for inclusion in the Redux store.
export default studySlice.reducer;
