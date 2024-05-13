// import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import { jwtDecode } from "jwt-decode";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

import defaultImg from "../assets/images/Lurny/default.png";

import TranslateComponent from "../components/TranslateComponent";
import TestQuizItem from "../components/TestQuizItem";
import Header from "../components/Header";

function LurnyRemind() {
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
      <Header />

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
              studyId={id}
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
