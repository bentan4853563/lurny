import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";

import { logout } from "../reducers/userSlice";

import getSchedule from "../utils/reminder";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

// import { GrUserAdmin } from "react-icons/gr";
import { IoCompassOutline } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";
import LetterLogo from "../assets/icons/letter_logo.png";
import ChromeIcon from "../assets/icons/chrome.png";
import BrainIcon from "../assets/icons/brain.png";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const { lurnies } = useSelector((state) => state.lurny);
  const { studies } = useSelector((state) => state.study);
  const [todayStudies, setTodayStudies] = useState(null);

  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    function handleMessage(event) {
      if (
        event.source === window &&
        event.data.type &&
        event.data.type === "FROM_EXTENSION"
      ) {
        const data = event.data.payload;
        localStorage.setItem("tempData", JSON.stringify(data));
        navigate("/lurny/profile");
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (accessToken) {
      setUserData(jwtDecode(accessToken));
    } else setUserData(null);
  }, [accessToken]);

  useEffect(() => {
    if (studies) {
      const todays = getTodaysStudies(studies);
      setTodayStudies(todays);
    }
  }, [studies]);

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getNextDay = (last_learned, repeatTimes, period, learn_count) => {
    const schedule = getSchedule(repeatTimes, period); // Assuming getSchedule is defined elsewhere
    const daysToAdd = schedule[learn_count];

    const lastLearnedDate = new Date(last_learned);
    const nextDay = new Date(lastLearnedDate);
    nextDay.setDate(nextDay.getDate() + daysToAdd);
    return nextDay;
  };

  const getTodaysStudies = (allStudies) => {
    return allStudies.filter((study) => {
      const nextDay = getNextDay(
        study.last_learned,
        study.user.repeatTimes,
        study.user.period,
        study.learn_count
      );
      return isToday(nextDay);
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div
      className="bg-black px-[12rem] flex justify-between items-center py-[4rem] sm:py-[1.5rem] top-0 sticky"
      style={{ zIndex: 999 }}
    >
      <Link to="/lurny/search" className="select-none">
        <img
          src={LetterLogo}
          alt="Letter logo"
          className="w-[56rem] sm:w-[32rem] md:w-[24rem] lg:w-[18rem] xl:w-[12rem]"
        />
      </Link>
      <div className="flex items-center gap-[4rem]">
        {/* {lurnies.length > 0 && (
          <Link to={`/admin/lurny`}>
            <GrUserAdmin className="text-zinc-300 text-[16rem] sm:text-[3.2rem] hover:text-gray-400" />
          </Link>
        )} */}
        {todayStudies && (
          <Link to="#">
            <div className="relative">
              <img
                src={BrainIcon}
                className="w-[4rem] border-2 border-gray-300 rounded-full hover:transform cursor-pointer"
              />
              <div className="absolute w-[2.5rem] h-[2.5rem] flex items-center justify-center bottom-[-0.5rem] left-[-1rem] bg-red-600 p-[0.5rem] rounded-full text-white">
                {todayStudies.length}
              </div>
            </div>
          </Link>
        )}

        {lurnies.length > 0 && (
          <Link to={`/lurny/feeds/${lurnies[0]._id}`}>
            <IoCompassOutline className="text-zinc-300 text-[16rem] sm:text-[4rem] hover:text-gray-400" />
          </Link>
        )}
        {lurnies.length > 0 && (
          <Link to={"/lurny/search"}>
            <IoSearchSharp className="text-zinc-300 text-[16rem] sm:text-[4rem] hover:text-gray-400" />
          </Link>
        )}
        {userData ? (
          <Link to="/lurny/profile">
            <img
              src={userData.photoURL}
              alt="User avatar"
              className="w-[16rem] sm:w-[12rem] md:w-[10rem] lg:w-[8rem] xl:w-[4rem] rounded-[100%] cursor-pointer"
            />
          </Link>
        ) : (
          <div className="flex items-center gap-[2rem]">
            <a
              href="https://chromewebstore.google.com/detail/lurny/fhoanimekkdanmnoddlgdaaocijnmbpj"
              target="blank"
              className="hidden sm:flex items-center gap-[1rem] text-white text-[1.5rem] cursor-pointer select-none"
            >
              <img src={ChromeIcon} alt="Chrome Icon" />
              Install Chrome Extension
            </a>
            <a
              href="/lurny/list"
              className="hidden sm:flex bg-white px-6 py-2 rounded-md text-black text-[6rem] sm:text-[2rem] font-bold hover:bg-gray-200 hover:text-black justify-center items-center focus:outline-none border-none"
            >
              Join Lurny
            </a>
          </div>
        )}
        {/* Hambuger */}
        <Menu
          menuButton={
            <MenuButton>
              <IoMenu className="text-[16rem] sm:text-[4rem] text-zinc-300" />
            </MenuButton>
          }
          transition
          gap={8}
          align="end"
        >
          <MenuItem>
            <Link
              to="/"
              className="w-full py-[2rem] sm:py-[0.5rem] text-black text-[8rem] sm:text-[1.5rem]"
            >
              About
            </Link>
          </MenuItem>
          <MenuItem>
            <span className="w-full py-[2rem] sm:py-[0.5rem] text-black text-[8rem] sm:text-[1.5rem]">
              Terms of Service
            </span>
          </MenuItem>
          <MenuItem>
            <Link
              to="/lurny/price"
              className="w-full py-[2rem] sm:py-[0.5rem] text text-[8rem] sm:text-[1.5rem] text-black hover:text-black"
            >
              Pricing
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/privacy"
              className="w-full py-[2rem] sm:py-[0.5rem] text text-[8rem] sm:text-[1.5rem] text-black hover:text-black"
            >
              Privacy
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/admin/prompt"
              className="px-[8rem] sm:px-[2rem] text-[8rem] sm:text-[1.5rem] text-black"
            >
              Admin
            </Link>
          </MenuItem>
          <MenuItem>
            <span
              onClick={handleLogout}
              className="px-[8rem] sm:px-[2rem] text-[8rem] sm:text-[1.5rem] text-black"
            >
              Logout
            </span>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
