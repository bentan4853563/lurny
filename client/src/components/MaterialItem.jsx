/* eslint-disable no-useless-escape */
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import defaultImg from "../assets/images/Lurny/default.png";

function MaterialItem({ data }) {
  const navigate = useNavigate();
  const { userDetails } = useSelector((state) => state.user);

  const [imageUrl, setImageUrl] = useState(null);
  const { _id, image, url } = data;

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

  // const newImg = getDefaultImg(image, url);
  // userDetails && console.log(userDetails.email);
  return (
    <div
      onClick={handleClick}
      className="w-[150rem] sm:w-[48rem] lg:w-[30rem] cursor-pointer"
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
    </div>
  );
}

MaterialItem.propTypes = {
  data: PropTypes.object.isRequired,
};

export default MaterialItem;
