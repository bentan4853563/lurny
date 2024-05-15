import { jwtDecode } from "jwt-decode"; // Corrected import

const useAdmin = () => {
  const token = localStorage.getItem("token");

  let isAdmin = false; // Initialize as false by default
  if (token) {
    // Check if the token exists
    try {
      // Decode the token
      const userData = jwtDecode(token);

      // Check if the user's email matches any admin email addresses
      isAdmin =
        userData.email === "bentan010918@gmail.com" ||
        userData.email === "krish@carillonmedia.com";
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  }

  return isAdmin;
};

export default useAdmin;
