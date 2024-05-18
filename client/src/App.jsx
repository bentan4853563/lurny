import { Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Loading from "./components/Loading";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Landing from "./pages/Landing";
import LurnyQuiz from "./pages/LurnyQuiz";
import LurnyRemind from "./pages/LurnyRemind";
import LurnyPrice from "./pages/LurnyPrice";
import LurnyList from "./pages/LurnyList";
import LurnyGroupList from "./pages/LurnyGroupList";
import LurnyProfile from "./pages/LurnyProfile";
import LurnySaved from "./pages/LurnySaved";
import LurnySetting from "./pages/LurnySetting";
import LurnySearch from "./pages/LurnySearch";
import PrivacyPolicy from "./pages/PrivacyPolicy";

import Lurny from "./pages/admin/Lurny";
import Prompt from "./pages/admin/Prompt";

import { getLurnies } from "./actions/lurny";
import { getPrompts } from "./actions/prompts";

import ProtectedRoute from "./routes/ProtectedRoutes";
import AdminRoute from "./routes/AdminRoutes";
import { setUserDetails } from "./reducers/userSlice";

import "./App.css";
import "animate.css";

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.loading);

  useEffect(() => {
    dispatch(getLurnies());
    dispatch(getPrompts());
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      dispatch(setUserDetails(jwtDecode(accessToken)));
    }
  }, []);

  useEffect(() => {
    function handleMessage(event) {
      if (
        event.source === window &&
        event.data.type &&
        event.data.type === "FROM_EXTENSION"
      ) {
        const data = event.data.payload;
        localStorage.setItem("tempData", JSON.stringify(data));
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      <Loading loading={loading} />
      <Suspense>
        <Router style={{ minWidth: "100vw" }}>
          <Routes>
            <Route path="/lurny" element={<ProtectedRoute />}>
              <Route path="list" element={<LurnyList />} />
              <Route path="sub-group" element={<LurnyGroupList />} />
              <Route path="profile" element={<LurnyProfile />} />
              <Route path="saved" element={<LurnySaved />} />
              <Route path="feeds/:id" element={<LurnyQuiz />} />
              <Route path="remind/:id" element={<LurnyRemind />} />
              <Route path="search" element={<LurnySearch />} />
              <Route path="price" element={<LurnyPrice />} />
              <Route path="setting" element={<LurnySetting />} />
            </Route>
            <Route path="/admin" element={<AdminRoute />}>
              <Route path="lurny" element={<Lurny />} />
              <Route path="prompt" element={<Prompt />} />
            </Route>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </Router>
      </Suspense>
    </>
  );
}

export default App;
