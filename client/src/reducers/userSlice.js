import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for the user's slice of the store.
const initialState = {
  isAuthenticated: false, // Boolean flag for authentication status
  token: "", // Token to authenticate API requests
  userDetails: {}, // Object to hold various user details
};

// Create a "slice" of the state with three reducers to handle user actions.
const userSlice = createSlice({
  name: "user", // The name of the slice used in action types
  initialState, // The initial state defined above
  reducers: {
    // Reducer to handle login action
    login: (state, action) => {
      // Set user as authenticated and store token
      state.isAuthenticated = true;
      state.token = action.payload;
      localStorage.setItem("token", action.payload); // Persist token to local storage
    },
    // Reducer to handle logout action
    logout: (state) => {
      state.isAuthenticated = false; // Reset isAuthenticated
      state.token = ""; // Clear token
      localStorage.removeItem("token"); // Remove token from local storage
      state.userDetails = {}; // Reset user details
    },
    // Reducer to set user details
    setUserDetails: (state, action) => {
      state.userDetails = action.payload; // Set user details with payload data
    },
  },
});

// Export actions to be used with dispatch in React components
export const { login, logout, setUserDetails } = userSlice.actions;

// Export the reducer to be included when creating the Redux store
export default userSlice.reducer;
