import {
  deleteLurny,
  insertLurny,
  setLurnies,
  shareLurny,
  updateLurny,
} from "../reducers/lurnySlice";
import { toast } from "react-toastify";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const getLurnies = () => async (dispatch) => {
  const options = {
    method: "GET", // Request method
    headers: {
      "Content-Type": "application/json", // Indicate JSON content
      "ngrok-skip-browser-warning": true,
    },
  };
  try {
    const currents = await fetch(`${backend_url}/api/lurny/currents`, options);
    if (currents.ok) {
      const currentLurnies = await currents.json();
      dispatch(setLurnies(currentLurnies));
    }
    const response = await fetch(`${backend_url}/api/lurny/get`, options);
    if (response.ok) {
      const responseData = await response.json();
      dispatch(setLurnies(responseData));
    }
  } catch (error) {
    console.log(error);
  }
};

export const handleInsertLurny = (lurny) => async (dispatch) => {
  const options = {
    method: "POST", // Request method
    headers: {
      "Content-Type": "application/json", // Indicate JSON content
    },
    body: JSON.stringify(lurny), // Convert data to JSON string
  };
  try {
    const response = await fetch(`${backend_url}/api/lurny/insert`, options);
    if (response.ok) {
      const responseData = await response.json();
      dispatch(insertLurny(responseData));
      toast.success("Inserted!", {
        position: "top-right",
      });
    }
  } catch (error) {
    console.error("Error:", error); // Handle errors
    toast.error("Error!", {
      position: "top-right",
    });
  }
};

export const handleShareLurny = (id) => async (dispatch) => {
  try {
    const response = await fetch(`${backend_url}/api/lurny/share/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
    });
    if (response.ok) {
      dispatch(shareLurny(id));
      toast.success("Shared successfuly!", {
        position: "top-right",
      });
    } else {
      toast.error("Faild share!", {
        position: "top-right",
      });
    }
  } catch (error) {
    toast.error("Network error when trying to update the shared field!", {
      position: "top-right",
    });
  }
};

export const handleDeleteLurny = (id) => async (dispatch) => {
  try {
    const response = await fetch(`${backend_url}/api/lurny/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
    });
    if (response.ok) {
      dispatch(deleteLurny(id));
      toast.success("Deleted successfuly!", {
        position: "top-right",
      });
    } else {
      toast.error("Faild delete!", {
        position: "top-right",
      });
    }
  } catch (error) {
    toast.error("Network error when trying to delete lurny!", {
      position: "top-right",
    });
  }
};

export const handleDeleteStubOrQuiz =
  (id, type, number) => async (dispatch) => {
    try {
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
        // toast.success(`Deleted ${type} successfuly!`);
      } else {
        toast.error("Faild delete!", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("Network error when trying to delete lurny!", {
        position: "top-right",
      });
    }
  };
