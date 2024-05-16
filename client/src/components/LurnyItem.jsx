/* eslint-disable no-useless-escape */
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import defaultImg from "../assets/images/Lurny/default.png";

function LurnyItem({ data }) {
  const navigate = useNavigate();
  const { userDetails } = useSelector((state) => state.user);

  const [imageUrl, setImageUrl] = useState(null);
  const { _id, title, image, url } = data;

  const isYoutubeUrl = (url) => {
    if (url) {
      return url.includes("youtube.com") || url.includes("youtu.be");
    } else {
      return false;
    }
  };

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

  const handleClick = () => {
    navigate(`/lurny/feeds/${_id}`);
  };

  function getYoutubeVideoID(url) {
    const regExp =
      // eslint-disable-next-line no-useless-escape
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  function getThumbnailURLFromVideoURL(videoURL) {
    const videoID = getYoutubeVideoID(videoURL);
    if (!videoID) {
      // throw new Error("Invalid YouTube URL");
      return defaultImg;
    }
    return `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;
  }

  return (
    <div
      onClick={handleClick}
      className="w-[80rem] sm:w-[48rem] lg:w-[30rem] cursor-pointer"
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
          className="h-[40rem] sm:h-[24rem] lg:h-[16rem] w-full object-cover rounded-[6rem] sm:rounded-[1.5rem]"
        />
      )}
      <div className="w-full flex flex-col text-white items-start gap-[2rem] sm:gap-[1rem] p-[4rem] sm:p-[2rem]">
        <span className="w-full text-start text-[6rem] sm:text-[3rem] lg:text-[1.2rem] font-semibold truncate">
          {url}
        </span>
        <div className="w-full text-[8rem] sm:text-[5rem] lg:text-[2rem] leading-[11rem] sm:leading-[6rem] lg:leading-[2.5rem] text-left font-medium line-clamp-2">
          {title}
        </div>
      </div>
    </div>
  );
}

LurnyItem.propTypes = {
  data: PropTypes.object.isRequired,
};

export default LurnyItem;
