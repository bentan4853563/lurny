import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteStudy, setStudies, setStudy } from "../reducers/studySlice";
import { savedLurny } from "../reducers/lurnySlice";

// Define the backend URL from environment variables
const backend_url = import.meta.env.VITE_BACKEND_URL;

/**
 * Fetch and dispatch studies based on the given ID.
 * @param {string} id - The unique identifier for the study.
 */
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
      dispatch(setStudies(studies));
    }
  } catch (error) {
    console.error("Error fetching studies:", error);
  }
};

/**
 * Handles saving a 'Lurny'.
 * @param {string} user_id - User's ID who is performing the save action.
 * @param {string} lurny_id - The ID of the Lurny being saved.
 * @param {string} type - The type of Lurny.
 * @param {number} number - A number associated with the Lurny.
 */
export const handleRemember = (user_id, lurny_id, type, number) => async () => {
  try {
    const response = await fetch(`${backend_url}/api/study/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, lurny_id, type, number }),
    });

    // Check for 409 Conflict status code
    if (response.status === 409) {
      const data = await response.json();
      toast.error(data.message, {
        position: "top-right",
      });
    } else if (response.ok) {
      savedLurny(lurny_id);
      // If successful, display a success message
      toast.success("Saved Lurny", {
        position: "top-right",
      });
    } else {
      // Handle other errors
      const errorData = await response.json();
      toast.error(errorData.message || "An unknown error occurred", {
        position: "top-right",
      });
    }
  } catch (error) {
    console.error("Network or unexpected error:", error);
    toast.error("Network or unexpected error", {
      position: "top-right",
    });
  }
};

/**
 * Handle testing by submitting test data.
 * @param {string} studyId - The ID of the study.
 * @param {Object} newStudyData - Data relevant to the study.
 */
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
    console.error("Error during handling test:", error);
  }
};

/**
 * Delete an existing Lurny through the backend API.
 *
 * @param {number} id - The ID of the Lurny that is being deleted.
 */
export const handleDeleteStudy = (id) => async (dispatch) => {
  try {
    // Send DELETE request to the backend to remove the specified Lurny
    const response = await fetch(`${backend_url}/api/study/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
    });

    if (response.ok) {
      dispatch(deleteStudy(id));
      toast.success("Deleted successfully!", {
        position: "top-right",
      });
    } else {
      toast.error("Failed to delete!", {
        position: "top-right",
      });
    }
  } catch (error) {
    toast.error("Network error when trying to delete lurny!", {
      position: "top-right",
    });
  }
};
