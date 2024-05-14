/* eslint-disable no-useless-escape */
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import defaultImg from "../assets/images/Lurny/default.png";
import getSchedule from "../utils/reminder";

import { BsAlarm } from "react-icons/bs";

function MaterialItem({ data }) {
  const navigate = useNavigate();
  const { userDetails } = useSelector((state) => state.user);

  const [imageUrl, setImageUrl] = useState(null);
  const [nextStudyDay, setNextStudyDay] = useState(null);
  const [isNextStudyDayToday, setIsNextStudyDayToday] = useState(false);

  const { _id, image, url, user, learn_count, last_learned } = data;

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

  useEffect(() => {
    if (data) {
      const nextDay = getNextDay();
      setNextStudyDay(nextDay.toLocaleDateString());
      setIsNextStudyDayToday(isDueTodayOrBefore(nextDay)); // State that determines if the next study day is today
    }
  }, [data]);

  const isYoutubeUrl = (url) => {
    if (url) {
      return url.includes("youtube.com") || url.includes("youtu.be");
    } else {
      return false;
    }
  };

  const getYoutubeVideoID = (url) => {
    const regExp =
      // eslint-disable-next-line no-useless-escape
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\\&v=|shorts\/)([^#\&\?]*).*/;
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

  const handleClick = () => {
    navigate(`/lurny/remind/${_id}`);
  };

  const isDueTodayOrBefore = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const comparisonDate = new Date(date);
    comparisonDate.setHours(0, 0, 0, 0);

    // Check if the comparisonDate is today or before
    return comparisonDate.getTime() <= today.getTime();
  };

  const getNextDay = () => {
    const schedule = getSchedule(user.repeatTimes, user.period);
    const daysToAdd = schedule[learn_count];

    const lastLearnedDate = new Date(last_learned);
    const nextDay = new Date(lastLearnedDate);
    nextDay.setDate(nextDay.getDate() + daysToAdd);
    return nextDay;
  };

  // const newImg = getDefaultImg(image, url);
  // userDetails && console.log(userDetails.email);
  return (
    <div>
      <div
        onClick={handleClick}
        className="w-[150rem] sm:w-[48rem] lg:w-[30rem] cursor-pointer relative"
      >
        {userDetails && (
          <img
            src={
              userDetails.email === "bentan010918@gmail.com"
                ? defaultImg
                : imageUrl
            }
            // src={imageUrl}
            alt="lurny image"
            className="h-[80rem] sm:h-[24rem] lg:h-[16rem] w-full object-cover rounded-[8rem] sm:rounded-[1.5rem]"
          />
        )}
        <BsAlarm
          className={`absolute text-[2rem] top-[2rem] right-[2rem] text-red-600 bg-white rounded-full p-[0.5rem] box-content ${
            isNextStudyDayToday ? "" : "hidden"
          }`}
        />
        {/* Meta info */}
        <div className="flex flex-col items-start text-white text-[1.5rem] p-[1rem]">
          <span className="text-left">Repeat Times: {user.repeatTimes}</span>
          <span className="text-left">Period: {user.period}</span>
          <span className="text-left">Learned Count: {learn_count}</span>
          <span className="text-left">
            Last learned: {new Date(last_learned).toLocaleDateString()}
          </span>
          {nextStudyDay && (
            <span className="text-left">Next Day: {nextStudyDay}</span>
          )}
        </div>
      </div>
    </div>
  );
}

MaterialItem.propTypes = {
  data: PropTypes.object.isRequired,
};

export default MaterialItem;
