import { jwtDecode } from "jwt-decode";

const useAdmin = () => {
  const token = localStorage.getItem("token");

  const userData = token ? jwtDecode(token) : null;

  const isAdmin =
    userData.email === "bentan010918@gmail.com" ||
    userData.email === "krish@carillonmedia.com"
      ? true
      : false;

  return isAdmin;
};

export default useAdmin;
