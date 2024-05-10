import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userSlice";
import lurnyReducer from "../reducers/lurnySlice";
import studySlice from "../reducers/studySlice";
import loadingReducer from "../reducers/loadingSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    lurny: lurnyReducer,
    study: studySlice,
    loading: loadingReducer,
  },
});

export default store;
