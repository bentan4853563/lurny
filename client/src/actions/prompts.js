import { setPrompts } from "../reducers/promptSlice";
import { toast } from "react-toastify";

const quiz_server_url = import.meta.env.VITE_QUIZ_SERVER;

export const getPrompts = () => async (dispatch) => {
  try {
    const response = await fetch(`${quiz_server_url}/get_prompts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const prompts = await response.json();
      console.log("prompts", prompts);
      dispatch(setPrompts(prompts));
    }
  } catch (error) {
    console.log(error);
  }
};

export const savePrompts = (prompts) => async (dispatch) => {
  try {
    console.log("prompt", prompts);
    const response = await fetch(`${quiz_server_url}/update_prompts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prompts),
    });
    if (response.ok) {
      dispatch(setPrompts(prompts));
      toast.success("Succefully updated prompts");
    }
  } catch (error) {
    console.log(error);
  }
};
