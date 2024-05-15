// Import required actions from the lurnySlice reducer and toastify for notifications
import {
  deleteLurny,
  insertLurny,
  setLurnies,
  shareLurny,
  updateLurny,
} from "../reducers/lurnySlice";
import { toast } from "react-toastify";

// Retrieve the backend URL from environment variables
const backend_url = import.meta.env.VITE_BACKEND_URL;

/**
 * Retrieve all Lurnies from the backend and dispatch them to the redux store.
 */
export const getLurnies = () => async (dispatch) => {
  // Define common request options for fetching data
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
    },
  };

  try {
    // Fetch current Lurnies from the backend
    const currents = await fetch(`${backend_url}/api/lurny/currents`, options);
    if (currents.ok) {
      const currentLurnies = await currents.json();
      dispatch(setLurnies(currentLurnies));
    }

    // Fetch full list of Lurnies from the backend
    const response = await fetch(`${backend_url}/api/lurny/get`, options);
    if (response.ok) {
      const responseData = await response.json();
      dispatch(setLurnies(responseData));
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Insert a new Lurny into the backend and update the store upon success.
 *
 * @param {Object} lurny - The Lurny object to be inserted.
 */
export const handleInsertLurny = (lurny) => async (dispatch) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lurny),
  };

  try {
    // Send POST request to the backend to insert a new Lurny
    const response = await fetch(`${backend_url}/api/lurny/insert`, options);
    if (response.ok) {
      const responseData = await response.json();
      dispatch(insertLurny(responseData));
      toast.success("Inserted!", {
        position: "top-right",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    toast.error("Error!", {
      position: "top-right",
    });
  }
};

/**
 * Share an existing Lurny through the backend API.
 *
 * @param {number} id - The ID of the Lurny that is being shared.
 */
export const handleShareLurny = (id) => async (dispatch) => {
  try {
    // Send PATCH request to the backend to share the specified Lurny
    const response = await fetch(`${backend_url}/api/lurny/share/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
    });

    if (response.ok) {
      dispatch(shareLurny(id));
      toast.success("Shared successfully!", {
        position: "top-right",
      });
    } else {
      toast.error("Failed to share!", {
        position: "top-right",
      });
    }
  } catch (error) {
    toast.error("Network error when trying to update the shared field!", {
      position: "top-right",
    });
  }
};

/**
 * Delete an existing Lurny through the backend API.
 *
 * @param {number} id - The ID of the Lurny that is being deleted.
 */
export const handleDeleteLurny = (id) => async (dispatch) => {
  try {
    // Send DELETE request to the backend to remove the specified Lurny
    const response = await fetch(`${backend_url}/api/lurny/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
    });

    if (response.ok) {
      dispatch(deleteLurny(id));
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

/**
 * Delete a stub or quiz related to a Lurny on the backend, and updates the redux store.
 *
 * @param {number} id     - The ID of the Lurny that is being modified.
 * @param {string} type   - The type of content being deleted ("stub" or "quiz").
 * @param {number} number - A unique identifier for the piece of content.
 */
export const handleDeleteStubOrQuiz =
  (id, type, number) => async (dispatch) => {
    try {
      // Send DELETE request to the backend to remove a stub or quiz
      const response = await fetch(`${backend_url}/api/lurny/delete-stub`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": true,
        },
        body: JSON.stringify({ id, type, number }),
      });

      if (response.ok) {
        const updatedLurny = await response.json();
        dispatch(updateLurny(updatedLurny));
        // Display success message commented out as there was no call to toast.success
        // toast.success(`Deleted ${type} successfully!`);
      } else {
        toast.error("Failed to delete!", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("Network error when trying to delete content!", {
        position: "top-right",
      });
    }
  };
