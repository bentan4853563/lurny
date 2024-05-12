// import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import { jwtDecode } from "jwt-decode";

import { IoMenu } from "react-icons/io5";

import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

import LetterLogo from "../assets/icons/letter_logo.png";
import defaultImg from "../assets/images/Lurny/default.png";

import { IoSearchSharp } from "react-icons/io5";

import TranslateComponent from "../components/TranslateComponent";
import { logout } from "../reducers/userSlice";
import TestQuizItem from "../components/TestQuizItem";

function LurnyRemind() {
  const dispatch = useDispatch();
  const { lurnies } = useSelector((state) => state.lurny);
  const { studies } = useSelector((state) => state.study);

  const [userData, setUserData] = useState(null);
  const [quizData, setQuizData] = useState({});

  const [imageUrl, setImageUrl] = useState(null);

  // const [isExpand, setIsExpand] = useState(false);

  const { image, url } = quizData;

  let { id } = useParams();

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      setUserData(jwtDecode(accessToken));
    }
  }, []);

  useEffect(() => {
    function handleMessage(event) {
      if (
        event.source === window &&
        event.data.type &&
        event.data.type === "FROM_EXTENSION"
      ) {
        const data = event.data.payload;
        localStorage.setItem("tempData", JSON.stringify(data));
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (studies.length > 0 && id) {
      const currentStudy = studies.find((study) => study._id === id); // Utilize .find() for efficiency
      if (currentStudy) {
        const foundIndex = studies.indexOf(currentStudy);
        if (foundIndex !== -1) {
          setQuizData(currentStudy.material);
        }
      }
    }
  }, [studies, id]);

  useEffect(() => {
    if (isYoutubeUrl(url)) {
      setImageUrl(getThumbnailURLFromVideoURL(url));
    } else if (image) {
      const img = new Image();

      img.onload = () => {
        setImageUrl(image);
      };
      img.onerror = () => {
        setImageUrl(defaultImg);
      };

      img.src = image;
    } else {
      setImageUrl(defaultImg);
    }
  }, [image, url]);

  const isYoutubeUrl = (url) => {
    if (url) {
      return url.includes("youtube.com") || url.includes("youtu.be");
    }
  };

  const getYoutubeVideoID = (url) => {
    const regExp =
      // eslint-disable-next-line no-useless-escape
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getThumbnailURLFromVideoURL = (videoURL) => {
    const videoID = getYoutubeVideoID(videoURL);
    if (!videoID) {
      // throw new Error("Invalid YouTube URL");
      return defaultImg;
    }
    return `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;
  };

  return (
    <div className="min-h-[100vh] bg-black font-raleway flex flex-col justify-center sm:justify-start">
      {/* Header */}
      <div className="w-full bg-black px-[4rem] sm:px-[20rem] flex justify-between items-center mb-[4rem] sm:mb-0 sm:py-[2rem]">
        <Link to="/lurny/search" className="select-none">
          <img
            src={LetterLogo}
            alt="Letter logo"
            className="w-[56rem] sm:w-[32rem] md:w-[24rem] lg:w-[18rem] xl:w-[12rem]"
          />
        </Link>

        <div className="flex items-center gap-[8rem] lg:gap-[2rem]">
          {lurnies.length > 0 && (
            <Link to={"/lurny/search"}>
              <IoSearchSharp className="text-white text-[16rem] sm:text-[4rem] hover:text-gray-400" />
            </Link>
          )}
          {userData && (
            <Menu
              menuButton={
                <img
                  src={userData.photoURL}
                  alt="User avatar"
                  className="w-[16rem] sm:w-[12rem] md:w-[10rem] lg:w-[8rem] xl:w-[4rem] rounded-[100%] cursor-pointer"
                />
              }
              transition
              gap={8}
              align="center"
            >
              <MenuItem>
                <Link
                  to="/lurny/profile"
                  className="px-[8rem] sm:px-[2rem] text-[8rem] sm:text-[1.5rem] text-black hover:text-black"
                >
                  Profile
                </Link>
              </MenuItem>
              <MenuItem>
                <span
                  onClick={() => dispatch(logout())}
                  className="px-[8rem] sm:px-[2rem] text-[8rem] sm:text-[1.5rem] text-black"
                >
                  Logout
                </span>
              </MenuItem>
            </Menu>
          )}
          <div className="hidden sm:flex">
            <Menu
              menuButton={
                <MenuButton>
                  <IoMenu className="flex text-[4rem] text-gray-500" />
                </MenuButton>
              }
              transition
              gap={8}
              align="center"
            >
              <MenuItem>
                <Link
                  to="/"
                  className="w-full py-[0.5rem] text-black text-[1.5rem]"
                >
                  About
                </Link>
              </MenuItem>
              <MenuItem>
                <span className="w-full py-[0.5rem] text-black text-[1.5rem]">
                  Terms of Service
                </span>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/privacy"
                  className="w-full py-[0.5rem] text-black text-[1.5rem] hover:text-black"
                >
                  Privacy
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/lurny/price"
                  className="w-full py-[0.5rem] text-black text-[1.5rem] hover:text-black"
                >
                  Pricing
                </Link>
              </MenuItem>
              <MenuItem className="hover:bg-white">
                <span className="w-full py-[0.5rem] text-[1.5rem]">
                  A&nbsp;
                  <span className="text-[#7030A0] font-semibold">
                    CarillonMedia
                  </span>
                  &nbsp;Company
                </span>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>

      {/* body */}
      <div className="flex flex-wrap px-[4rem] sm:px-[20rem] py-[2rem] gap-[8rem] sm:gap-0">
        {/* Image */}
        <div className="hidden sm:flex w-[32rem]">
          {quizData && Object.keys(quizData).length > 0 && (
            <div className="w-full px-[16rem] sm:px-0 flex flex-col">
              <span className="text-white text-start text-[7rem] sm:text-[2.5rem] leading-[3rem]">
                {quizData.title}
              </span>
              {userData && (
                <img
                  // src={imageUrl}
                  src={
                    userData.email === "bentan010918@gmail.com"
                      ? defaultImg
                      : imageUrl
                  }
                  alt=""
                  className="w-full h-[64rem] sm:h-[20rem] object-cover rounded-[2rem] mt-[3rem]"
                />
              )}
              <div className="flex flex-col gap-8 mt-12">
                <a
                  href={quizData.url}
                  target="black"
                  className="bg-[#FFC36D] w-full text-black hover:text-gray-800 text-[2rem] py-4 rounded-md cursor-pointer"
                >
                  Watch Source
                </a>
                <TranslateComponent />
              </div>
            </div>
          )}
        </div>

        <div
          id="current-quiz"
          className="hidden sm:flex flex-1 flex-col gap-[4rem] px-[16rem]"
        >
          {quizData && Object.keys(quizData).length > 0 && (
            <TestQuizItem
              data={quizData}
              // language={language}
            />
          )}
        </div>

        <div className="hidden sm:flex w-[36rem]"></div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default LurnyRemind;
