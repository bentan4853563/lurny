import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { setStudies } from "../reducers/studySlice";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const getStudies = (id) => async (dispatch) => {
  try {
    const response = await fetch(`${backend_url}/api/study/get/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-ski-browser-warning": true,
      },
    });
    if (response.ok) {
      const studies = await response.json();
      console.log("Studies", studies);
      dispatch(setStudies(studies));
    }
  } catch (error) {
    console.log(error);
  }
};

export const handleRemember = (user_id, lurny_id) => async () => {
  try {
    const response = await fetch(`${backend_url}/api/study/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-ski-browser-warning": true,
      },
      body: JSON.stringify({ user_id, lurny_id }),
    });
    if (response.ok) {
      toast.success("Saved Lurny", {
        position: "top-right",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
