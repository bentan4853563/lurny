import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudies } from "../actions/study";
import { Link } from "react-router-dom";

import { IoSettingsSharp } from "react-icons/io5";

function UserPan() {
  const dispatch = useDispatch();

  const { studies } = useSelector((state) => state.study);
  const { lurnies } = useSelector((state) => state.lurny);

  const [myLurnies, setMyLurnies] = useState([]);

  const [userData, setUserData] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

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

  useEffect(() => {
    // clearLurnies();
    if (userData && lurnies) {
      let tempLurnies = lurnies;
      let filtered = tempLurnies.filter(
        (lurny) => lurny.user._id === userData.id
      );
      setMyLurnies(filtered);
    }
  }, [userData, lurnies]);

  useEffect(() => {
    const getEndPoint = () => {
      const { pathname } = window.location;
      const pathSegments = pathname.split("/").filter((segment) => segment);
      setEndPoint(pathSegments[pathSegments.length - 1]);
    };
    getEndPoint();
    const handlePopState = () => getEndPoint();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [window.location.pathname]);

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
        className="flex items-center gap-[2rem] bg-white px-[2rem] py-[0.5rem] rounded-[0.5rem] text-black text-[2rem] font-semibold focus:outline-none hover:text-black cursor-pointer hover:bg-gray-300"
      >
        <span>Settings</span>
        <IoSettingsSharp />
      </a>
      <Link
        to="/lurny/saved"
        className={`w-full flex items-center justify-between active:text-gray-300 hover:text-white text-left text-[2rem] font-bold border-b border-white cursor-pointer ${
          endPoint && endPoint === "saved" ? "text-white" : "text-gray-500"
        } `}
      >
        <span>Saved Lurnies ({studies.length})</span>
      </Link>
      <Link
        to="/lurny/profile"
        className={`w-full active:text-gray-300 hover:text-white text-left text-[2rem] font-bold border-b border-white cursor-pointer ${
          endPoint && endPoint === "profile" ? "text-white" : "text-gray-500"
        } `}
      >
        My Lurnies ({myLurnies.length})
      </Link>
    </div>
  );
}

export default UserPan;
