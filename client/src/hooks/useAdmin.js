import { jwtDecode } from "jwt-decode";

const useAdmin = () => {
  const token = localStorage.getItem("token");

  const userData = token ? jwtDecode(token) : null;

  const isAdmin = userData ? true : false;
  console.log(isAdmin);

  return isAdmin;
};

export default useAdmin;
