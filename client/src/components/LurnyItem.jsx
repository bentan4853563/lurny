/* eslint-disable no-useless-escape */
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import defaultImg from "../assets/images/Lurny/default.png";

function LurnyItem({ data }) {
  const navigate = useNavigate();
  const { userDetails } = useSelector((state) => state.user);

  const { _id, title, image, url } = data;

  const isYoutubeUrl = (url) => {
    if (url) {
      return url.includes("youtube.com") || url.includes("youtu.be");
    } else {
      return false;
    }
  };

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

  const getDefaultImg = (image, url) => {
    if (isYoutubeUrl(url)) {
      return getThumbnailURLFromVideoURL(url);
    } else if (
      image &&
      image !== null &&
      image !== "" &&
      image.includes("http")
    ) {
      const extensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
      const fileExtension = image.split(".").pop().toLowerCase();
      if (extensions.includes(fileExtension)) {
        return image;
      }
    }
    return defaultImg;
  };

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
              : getDefaultImg(image, url)
          }
          // src={getDefaultImg(image, url)}
          loading="lazy"
          alt="lurny image"
          className="h-[40rem] sm:h-[24rem] lg:h-[16rem] w-full object-cover rounded-[6rem] sm:rounded-[1.5rem]"
        />
      )}
      <div className="w-full flex flex-col text-white items-start gap-[2rem] sm:gap-[1rem] p-[4rem] sm:p-[2rem]">
        <span className="w-full text-start text-[6rem] sm:text-[3rem] lg:text-[1.2rem] font-semibold truncate">
          {url}
        </span>
        <div className="w-full text-[6.5rem] sm:text-[4rem] lg:text-[2rem] leading-[11rem] sm:leading-[6rem] lg:leading-[2.5rem] text-left font-medium line-clamp-2">
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
