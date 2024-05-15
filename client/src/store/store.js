// Import the configureStore utility from Redux Toolkit and individual reducers.
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userSlice"; // Reducer for user-related state
import lurnyReducer from "../reducers/lurnySlice"; // Reducer for 'lurny'-related state
import studyReducer from "../reducers/studySlice"; // Reducer for study-related state
import loadingReducer from "../reducers/loadingSlice"; // Reducer for loading-related state
import promptReducer from "../reducers/promptSlice"; // Reducer for prompt-related state

// Configure the Redux store
const store = configureStore({
  reducer: {
    user: userReducer, // Connects userReducer to the 'user' state slice
    lurny: lurnyReducer, // Connects lurnyReducer to the 'lurny' state slice
    study: studyReducer, // Connects studyReducer to the 'study' state slice
    loading: loadingReducer, // Connects loadingReducer to the 'loading' state slice
    prompt: promptReducer, // Connects promptReducer to the 'prompt' state slice
  },
});

// Export the configured Redux store
export default store;
