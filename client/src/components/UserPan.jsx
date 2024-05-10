import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { getStudies } from "../actions/study";
import { Link } from "react-router-dom";

function UserPan({ all }) {
  const dispatch = useDispatch();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      setUserData(jwtDecode(accessToken));
    }
  }, []);

  useEffect(() => {
    if (userData) {
      dispatch(getStudies(userData.id));
    }
  }, [userData]);

  const getEndPoint = () => {
    const currentHref = window.location.href;
    const parsedUrl = new URL(currentHref);
    const pathSegmants = parsedUrl.pathname
      .split("/")
      .filter((segment) => segment);
    return pathSegmants[pathSegmants.length - 1];
  };

  return (
    <div className="w-[140rem] sm:w-[42rem] lg:w-[32rem] bg-[#262626] flex flex-col items-start gap-[8rem] lg:gap-[2rem]">
      {userData && (
        <img
          src={userData.photoURL}
          alt="User avatar"
          className=" rounded-full object-cover"
        />
      )}
      {userData && (
        <span className="text-white text-left text-[2.5rem] font-bold">
          {userData.displayName}
        </span>
      )}
      <p className="text-white text-left text-[1.5rem]">
        The Indian economy has shown accelerated economic growth of ver 8% in
        the final months of the year, driven by strong private investments and a
        pickup in the services sector.
      </p>
      <a
        href="/lurny/setting"
        className="bg-white px-[2rem] py-[0.5rem] rounded-[0.5rem] text-black text-[2rem] font-semibold focus:outline-none hover:text-black cursor-pointer hover:bg-gray-300"
      >
        Settings
      </a>
      <Link
        to="/lurny/saved"
        className={`w-full active:text-gray-300 hover:text-white text-left text-[2rem] font-bold border-b border-white cursor-pointer ${
          getEndPoint() == "profile" ? "text-white" : "text-gray-500"
        } `}
      >
        Saved Lurnies (0)
      </Link>
      <Link
        to="/lurny/profile"
        className={`w-full active:text-gray-300 hover:text-white text-left text-[2rem] font-bold border-b border-white cursor-pointer ${
          getEndPoint() == "profile" ? "text-white" : "text-gray-500"
        } `}
      >
        My Lurnies ({all})
      </Link>
    </div>
  );
}

UserPan.propTypes = {
  all: PropTypes.number,
};

export default UserPan;
