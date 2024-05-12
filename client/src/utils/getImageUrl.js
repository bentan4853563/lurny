import defaultImg from "../assets/images/Lurny/default.png";

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
    return defaultImg;
  }
  return `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;
};

const checkImage = (imageUrl) => {
  return new Promise((resolve) => {
    fetch(imageUrl, {
      method: "HEAD", // Only fetch headers to minimize data download
      mode: "no-cors", // Avoid CORS errors - won't work for all images due to security restrictions
    })
      .then((response) => {
        // If we receive an ok response, resolve with the image Url
        if (response.ok) {
          console.log("image, response :>> ", imageUrl, response);
          resolve(imageUrl);
        } else {
          console.log("default");
          resolve(defaultImg);
        }
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
        resolve(defaultImg); // In case of an error, resolve with the default image
      });
  });
};

export const getValidatedImg = async (image, url) => {
  console.log("image, url :>> ", image, url);
  if (image) {
    const isValidImage = await checkImage(image);
    console.log("isValidImage :>> ", isValidImage);
    return isValidImage;
  } else if (isYoutubeUrl(url)) {
    return getThumbnailURLFromVideoURL(url);
  } else {
    return defaultImg;
  }
};
