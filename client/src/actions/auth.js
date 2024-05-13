import { login } from "../reducers/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const signIn = (accessToken, navigate) => async (dispatch) => {
  try {
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
      if (response.status == 404) {
        toast.error("Please signup first!", {
          position: "top-right",
          onClose: () => history.push("/signup"), // Navigate after the toast is dismissed
        });

        setTimeout(() => {
          navigate("/signup");
        }, 1000);
      } else {
        toast.error(response.error, {
          position: "top-right",
        });
      }
    }
  } catch (error) {
    alert("Error during signup:", error.message);
  }
};

export const signUp = (accessToken, navigate) => async () => {
  try {
    const response = await fetch(`${backend_url}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
      body: JSON.stringify({ accessToken }),
    });

    // const data = await response.json();

    if (response.ok && response.status == 201) {
      toast.success("Signup successfuly. Please Signin.", {
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

export const changeROSI =
  (user_id, repeatTimes, period) => async (dispatch) => {
    try {
      console.log(
        "user_id, repeatTimes, period :>> ",
        user_id,
        repeatTimes,
        period
      );
      const response = await fetch(`${backend_url}/api/user/update-rosi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": true,
        },
        body: JSON.stringify({ user_id, repeatTimes, period }),
      });

      if (response.ok) {
        // Display a success toast notification
        toast.success("Saved!!!", {
          position: "top-right",
        });

        // Get the JSON data from the response
        const data = await response.json();

        // Dispatch action to login, using the token received from the response
        dispatch(login(data.token));
      } else {
        // Display an error toast notification when response is not ok (e.g., status code 4xx or 5xx)
        toast.error("Save failed! Error: " + response.statusText, {
          position: "top-right",
        });
      }
    } catch (error) {
      // Alert the user that there has been an error during the update process
      alert("Error during update:", error.message);
    }
  };
