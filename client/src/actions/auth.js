// Import necessary modules and styles
import { login } from "../reducers/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// The backend URL is obtained from environment variables
const backend_url = import.meta.env.VITE_BACKEND_URL;

/**
 * Sign in function to authenticate a user.
 *
 * @param {string} accessToken - Access token for the user.
 * @param {function} navigate - Navigation function from react-router-dom.
 */
export const signIn = (accessToken, navigate) => async (dispatch) => {
  try {
    // Make a POST request to sign-in endpoint with the access token
    const response = await fetch(`${backend_url}/api/auth/signIn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
      body: JSON.stringify({ accessToken }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(login(data.token));
      navigate("/lurny/search");
    } else {
      if (response.status === 404) {
        // If user is not found, display an error and redirect to signup
        toast.error("Please signup first!", {
          position: "top-right",
          onClose: () => navigate("/signup"), // Navigate after the toast is dismissed
        });
        setTimeout(() => {
          navigate("/signup");
        }, 1000);
      } else {
        // For other errors, display the error message
        toast.error(response.error, {
          position: "top-right",
        });
      }
    }
  } catch (error) {
    alert("Error during signup:", error.message);
  }
};

/**
 * Sign up function to register a user.
 *
 * @param {string} accessToken - Access token for the user.
 * @param {function} navigate - Navigation function from react-router-dom.
 */
export const signUp = (accessToken, navigate) => async () => {
  try {
    // Make a POST request to sign-up endpoint with the access token
    const response = await fetch(`${backend_url}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
      body: JSON.stringify({ accessToken }),
    });

    if (response.ok && response.status === 201) {
      toast.success("Signup successful! Please Signin.", {
        position: "top-right",
      });
      navigate("/signin");
    } else {
      toast.error("Already exist!", {
        position: "top-right",
      });
    }
  } catch (error) {
    alert("Error during signup:", error.message);
  }
};

/**
 * Function to change ROSI (Return on Sales Investment).
 *
 * @param {number} user_id - ID of the user.
 * @param {number} repeatTimes - Number of times to repeat the process.
 * @param {number} period - Duration of the period.
 */
export const changeROSI =
  (user_id, repeatTimes, period) => async (dispatch) => {
    try {
      // Make a POST request to update ROSI endpoint
      const response = await fetch(`${backend_url}/api/user/update-rosi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": true,
        },
        body: JSON.stringify({ user_id, repeatTimes, period }),
      });

      if (response.ok) {
        toast.success("Saved!!!", {
          position: "top-right",
        });

        const data = await response.json();
        dispatch(login(data.token));
      } else {
        toast.error(`Save failed! Error: ${response.statusText}`, {
          position: "top-right",
        });
      }
    } catch (error) {
      alert("Error during update:", error.message);
    }
  };
