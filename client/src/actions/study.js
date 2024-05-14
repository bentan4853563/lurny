import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { setStudies, setStudy } from "../reducers/studySlice";

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

export const handleRemember = (user_id, lurny_id, type, number) => async () => {
  try {
    const response = await fetch(`${backend_url}/api/study/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, lurny_id, type, number }),
    });

    // Handle 409 Conflict separately
    if (response.status === 409) {
      const data = await response.json();
      console.log("response.message :>> ", data.message);
      toast.error(data.message, {
        position: "top-right",
      });
    } else if (response.ok) {
      // If the status code is successful (2xx)
      toast.success("Saved Lurny", {
        position: "top-right",
      });
    } else {
      // Other errors such as 4xx or 5xx apart from 409
      const errorData = await response.json();
      console.log("Error Response :>> ", errorData.message);
      toast.error(errorData.message || "An unknown error occurred", {
        position: "top-right",
      });
    }
  } catch (error) {
    // Handle network or other unexpected errors
    console.error("Network or unexpected error: ", error);
    toast.error("Network or unexpected error", {
      position: "top-right",
    });
  }
};

export const handleTest = (studyId, newStudyData) => async (dispatch) => {
  try {
    const response = await fetch(`${backend_url}/api/study/test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studyId, newStudyData }),
    });
    if (response.ok) {
      const studyData = await response.json();
      dispatch(setStudy(studyData));
    }
  } catch (error) {
    console.log(error);
  }
};
