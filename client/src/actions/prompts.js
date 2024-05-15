// Import required actions from the promptSlice reducer and toastify for notifications
import { setPrompts } from "../reducers/promptSlice";
import { toast } from "react-toastify";

// Retrieve the quiz server URL from environment variables
const quiz_server_url = import.meta.env.VITE_QUIZ_SERVER;

/**
 * Fetch prompts from the quiz server and dispatch them to the redux store.
 */
export const getPrompts = () => async (dispatch) => {
  try {
    // Perform a GET request to retrieve prompts
    const response = await fetch(`${quiz_server_url}/get_prompts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // If the request succeeds, dispatch the fetched prompts to the store
    if (response.ok) {
      const prompts = await response.json();
      dispatch(setPrompts(prompts));
    }
  } catch (error) {
    // Log any errors that occur during the fetch operation
    console.log(error);
  }
};

/**
 * Save updated prompts to the quiz server and update the store accordingly.
 *
 * @param {Array} prompts - An array of prompt objects to be saved.
 */
export const savePrompts = (prompts) => async (dispatch) => {
  try {
    // Perform a POST request to update prompts on the server
    const response = await fetch(`${quiz_server_url}/update_prompts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prompts),
    });

    // If the request succeeds, dispatch the updates to the store and show a success message
    if (response.ok) {
      dispatch(setPrompts(prompts));
      toast.success("Successfully updated prompts", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  } catch (error) {
    // Log any errors that occur during the POST operation and show an error message
    console.log(error);
    toast.error("Failed to update prompts", {
      position: "top-right",
      autoClose: 5000,
    });
  }
};
