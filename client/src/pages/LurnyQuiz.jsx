// import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, Bounce } from "react-toastify";

import { Tooltip } from "react-tooltip";
import { jwtDecode } from "jwt-decode";

// import { IoMenu } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { IoMenu } from "react-icons/io5";

// import { SlHome } from "react-icons/sl";
import { RxBookmark } from "react-icons/rx";
import { RiSparkling2Fill } from "react-icons/ri";
import { BiLink } from "react-icons/bi";
import { LiaLanguageSolid } from "react-icons/lia";

import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

import LetterLogo from "../assets/icons/letter_logo.png";
import defaultImg from "../assets/images/Lurny/default.png";

import { IoSearchSharp } from "react-icons/io5";
import { FaTh } from "react-icons/fa";

import QuizItem from "../components/QuizItem";
import MobileQuizItem from "../components/MobileQuizItem";
import TranslateComponent from "../components/TranslateComponent";
import { LuPencil } from "react-icons/lu";

import CreateLurnyFromURL from "../components/CreateLurnyModals/CreateLurnyFromURL";
import CreateLurnyFromFile from "../components/CreateLurnyModals/CreateLurnyFromFile";
import CreateLurnyManually from "../components/CreateLurnyModals/CreateLurnyManually";

import { logout } from "../reducers/userSlice";
import useAdmin from "../hooks/useAdmin";
import CategoryModal from "../components/CategoryModal";

function LurnyQuiz() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = useAdmin();

  const { lurnies } = useSelector((state) => state.lurny);

  const [userData, setUserData] = useState(null);
  const [quizData, setQuizData] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [relatedLurnies, setRelatedLurnies] = useState([]);
  const [viewAllCollections, setViewAllCollections] = useState(false);

  const [content, setContent] = useState(0);

  const [imageUrl, setImageUrl] = useState(null);
  const [lurnifyModal, setLurnifyModal] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // const [isExpand, setIsExpand] = useState(false);

  const { collections } = quizData;
  let slicedCollections = [];

  if (collections && collections.length > 0) {
    slicedCollections = viewAllCollections
      ? collections
      : collections.slice(0, 8);
  }

  let { id } = useParams();
  const { image, url } = quizData;

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
        navigate("/lurny/profile");
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (lurnies.length > 0 && id) {
      const foundLurny = lurnies.find((lurny) => lurny && lurny._id === id); // Utilize .find() for efficiency
      if (foundLurny) {
        const foundIndex = lurnies.indexOf(foundLurny);
        if (foundIndex !== -1) {
          setSelectedIndex(foundIndex);
          setQuizData(foundLurny);
        }
      }
    }
  }, [lurnies, id]);

  useEffect(() => {
    const calculateRelevance = (lurnyCollections, targetCollections) => {
      return lurnyCollections.reduce((score, collection) => {
        return score + (targetCollections.includes(collection) ? 1 : 0);
      }, 0);
    };

    if (lurnies.length > 0 && quizData && quizData.collections) {
      let filteredLurnies = lurnies.filter(
        (lurny) => lurny.url !== quizData.url
      );
      let scoredLurnies = filteredLurnies.map((lurny) => ({
        ...lurny,
        relevanceScore: calculateRelevance(
          lurny.collections,
          quizData.collections
        ),
      }));

      scoredLurnies.sort((a, b) => b.relevanceScore - a.relevanceScore);

      // Get top 10 or fewer related lurnies
      const topRelatedLurnies = scoredLurnies
        .slice(0, 10)
        .filter((lurny) => lurny.relevanceScore > 0);

      setRelatedLurnies(topRelatedLurnies);
    } else {
      setRelatedLurnies([]); // Reset related lurnies if no relevant data is present
    }
  }, [lurnies, quizData]);

  const isYoutubeUrl = (url) => {
    if (url) {
      return url.includes("youtube.com") || url.includes("youtu.be");
    }
  };

  const getDefaultImg = (image, url) => {
    if (isYoutubeUrl(url)) {
      return getThumbnailURLFromVideoURL(url);
    } else if (image) {
      if (image && image !== null && image !== " " && image.includes("http"))
        return image;
      else return defaultImg;
    } else {
      return defaultImg;
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

  const buttons = ["Stubs", "Quiz Me!"];

  const handleClickHeadButton = (index) => {
    setContent(index);
  };

  const handleQuizItemClick = (index) => {
    if (index > 0 && index < lurnies.length - 1) {
      setQuizData(lurnies[index]);
      setSelectedIndex(index);
    }
  };

  const goBack = () => {
    if (selectedIndex > 0) {
      navigate(`/lurny/feeds/${lurnies[selectedIndex - 1]._id}`);
    }
  };

  const goForward = () => {
    if (selectedIndex < lurnies.length - 1) {
      console.log(
        "Down",
        lurnies[selectedIndex].title,
        lurnies[selectedIndex + 1].title
      );
      navigate(`/lurny/feeds/${lurnies[selectedIndex + 1]._id}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown") {
        goForward();
      } else if (event.key === "ArrowUp") {
        goBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, lurnies]);

  const handleOpenURLModal = () => {
    setLurnifyModal("URL");
  };

  const handleOpenFileModal = () => {
    setLurnifyModal("File");
  };

  const handleOpenManuallyModal = () => {
    setLurnifyModal("Manually");
  };

  const handleCloseLurnifyModal = () => {
    setLurnifyModal(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-[100vh] bg-black font-raleway flex flex-col justify-center sm:justify-start">
      {/* Header */}
      <div className="w-full bg-black px-[4rem] sm:px-[20rem] flex justify-between items-center mb-[4rem] sm:mb-0 sm:py-[2rem]">
        <div className="flex items-center gap-[4rem]">
          <Link to="/" className="select-none">
            <img
              src={LetterLogo}
              alt="Letter logo"
              className="w-[56rem] sm:w-[32rem] md:w-[24rem] lg:w-[18rem] xl:w-[12rem]"
            />
          </Link>
          <div
            onMouseOver={() => setShowCategoryModal(true)}
            onMouseLeave={() => setShowCategoryModal(false)}
            className="text-white text-[2rem] flex items-center gap-[1rem] cursor-pointer relative"
          >
            <FaTh />
            <span>Category</span>
            {showCategoryModal && (
              <CategoryModal
                hideModal={() => setShowCategoryModal(false)}
                maintainModal={() => setShowCategoryModal(true)}
              />
            )}
          </div>
        </div>

        {/* Button Group */}
        {quizData && Object.keys(quizData).length > 0 && (
          <div className="hidden sm:flex items-center gap-[4rem] sm:gap-[2rem]">
            <button
              onClick={goBack}
              data-tooltip-id="previous-lurny"
              className="flex items-center justify-center p-[0.5rem] sm:pl-2 text-white text-[10rem] sm:text-[3rem] bg-[#7F52BB] rounded-full focus:outline-none"
            >
              <IoIosArrowBack />
            </button>
            <Tooltip
              id="previous-lurny"
              place="bottom"
              content="Previous Lurny"
              style={{
                width: "150px",
                textAlign: "center",
                fontSize: "16px",
                backgroundColor: "#595959",
                color: "white",
                borderRadius: "4px",
                padding: "4px",
                zIndex: 100,
              }}
            />
            {buttons.map((name, index) => (
              <span
                key={index}
                className={`${
                  content === index
                    ? "bg-[#595959] flex"
                    : "bg-transparent hidden sm:flex"
                } w-[52rem] sm:w-auto items-center justify-center text-white px-[2rem] py-[2.5rem] sm:py-[0.5rem] rounded-[2rem] sm:rounded-[0.5rem] text-[6.5rem] sm:text-[2rem] font-thin focus:outline-none border-none cursor-pointer`}
                onClick={() => handleClickHeadButton(index)}
              >
                {name}
              </span>
            ))}
            <button
              onClick={goForward}
              data-tooltip-id="next-lurny"
              className="flex items-center justify-center p-[0.5rem] sm:pl-2 text-white text-[10rem] sm:text-[3rem] bg-[#7F52BB] rounded-full focus:outline-none"
            >
              <IoIosArrowForward />
            </button>

            <Tooltip
              id="next-lurny"
              place="bottom"
              content="Next Lurny"
              style={{
                width: "150px",
                textAlign: "center",
                fontSize: "16px",
                backgroundColor: "#595959",
                color: "white",
                borderRadius: "4px",
                padding: "4px",
                zIndex: 100,
              }}
            />
          </div>
        )}

        <div className="flex items-center gap-[8rem] lg:gap-[2rem]">
          {/* Lurnify in several ways */}
          <Menu
            menuButton={
              <MenuButton>
                <LuPencil className="text-zinc-300 text-[12rem] sm:text-[2.5rem] hover:bg-[#262626] box-content rounded-[0.5rem] p-[0.5rem] hover:text-gray-400" />
              </MenuButton>
            }
            transition
            align="center"
          >
            <MenuItem onClick={handleOpenURLModal}>
              <span className="w-full py-[2rem] sm:py-[0.5rem] text-black text-[8rem] sm:text-[1.5rem]">
                Create Lurnies From URL
              </span>
            </MenuItem>
            <MenuItem onClick={handleOpenFileModal}>
              <span className="w-full py-[2rem] sm:py-[0.5rem] text-black text-[8rem] sm:text-[1.5rem]">
                Create Lurnies From PDF
              </span>
            </MenuItem>
            <MenuItem onClick={handleOpenManuallyModal}>
              <span className="w-full py-[2rem] sm:py-[0.5rem] text-black text-[8rem] sm:text-[1.5rem]">
                Create Lurnies Manually
              </span>
            </MenuItem>
          </Menu>
          {lurnies.length > 0 && (
            <Link to={"/lurny/search"}>
              <IoSearchSharp className="text-zinc-300 text-[16rem] sm:text-[3rem] hover:text-gray-400 hover:bg-[#262626] box-content rounded-[0.5rem] p-[0.5rem]" />
            </Link>
          )}
          {userData && (
            <Link to="/lurny/profile">
              <img
                src={userData.photoURL}
                alt="User avatar"
                className="w-[16rem] sm:w-[12rem] md:w-[10rem] lg:w-[8rem] xl:w-[4rem] rounded-[100%] cursor-pointer"
              />
            </Link>
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
              {isAdmin && (
                <MenuItem>
                  <Link
                    to="/admin/prompt"
                    className="w-full px-[8rem] sm:px-[2rem] text-[8rem] sm:text-[1.5rem] text-black"
                  >
                    Admin
                  </Link>
                </MenuItem>
              )}
              <MenuItem>
                <span
                  onClick={handleLogout}
                  className="w-full px-[8rem] sm:px-[2rem] text-[8rem] sm:text-[1.5rem] text-black"
                >
                  Logout
                </span>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>

      {/* body */}
      <div className="flex flex-wrap px-[4rem] sm:px-[20rem] py-[2rem] gap-[8rem] sm:gap-0">
        {/* Image */}
        <div className="hidden sm:flex w-[36rem]">
          {quizData && Object.keys(quizData).length > 0 && (
            <div className="w-full px-[16rem] sm:px-0 flex flex-col ">
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
                {/* Select language button */}
                {/* <div className="flex flex-col">
                  <span
                    className="bg-[#FFC36D] w-full text-black text-[2rem] py-4 rounded-md cursor-pointer"
                    onClick={() => setIsExpand(!isExpand)}
                  >
                    Change Language
                  </span>
                  {isExpand && (
                    <ul className="bg-white mt-4 max-h-[48rem] overflow-y-auto">
                      {languageList.map((lang) => {
                        return (
                          <li
                            key={lang.code}
                            className="hover:bg-gray-200 text-black text-[2rem] py-4 cursor-pointer"
                            onClick={() => {
                              handleChangeLanguage(lang.code);
                              setIsExpand(false);
                            }}
                          >
                            {lang.name}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div> */}
                <TranslateComponent />
              </div>
            </div>
          )}
        </div>

        {/* Main part */}
        {/* <div className="h-[85vh] hidden sm:flex flex-1 flex-col gap-[4rem] px-[20rem] scroll-hidden">
          {lurnies.map(
            (lurny, index) =>
              lurny.shared && (
                <div ref={itemRefs[index]} key={index}>
                  <QuizItem
                    key={index}
                    index={index}
                    currentQuizId={
                      quizData && Object.keys(quizData).length > 0
                        ? quizData._id
                        : null
                    }
                    handleClick={() => handleQuizItemClick(index)}
                    data={lurny}
                    // language={language}
                    content={content}
                  />
                </div>
              )
          )}
        </div> */}

        <div
          id="current-quiz"
          className="hidden sm:flex flex-1 gap-[4rem] px-[12rem]"
        >
          {quizData && Object.keys(quizData).length > 0 && (
            <QuizItem
              index={selectedIndex}
              currentQuizId={
                quizData && Object.keys(quizData).length > 0
                  ? quizData._id
                  : null
              }
              handleClick={() => handleQuizItemClick(selectedIndex)}
              data={quizData}
              // language={language}
              content={content}
            />
          )}
        </div>

        {/* Mobile */}
        <div className="flex sm:hidden">
          {lurnies && lurnies.length > 0 && lurnies[selectedIndex] && (
            <MobileQuizItem
              currentQuizId={
                quizData && Object.keys(quizData).length > 0
                  ? quizData._id
                  : null
              }
              data={lurnies[selectedIndex]}
              // language={language}
              content={content}
              index={selectedIndex}
              handleClick={handleQuizItemClick}
            />
          )}
        </div>

        {/* Right Panel */}
        <div className="hidden sm:flex w-[36rem]">
          {quizData && Object.keys(quizData).length > 0 && (
            <div className="flex flex-col items-start sm:gap-[2rem]">
              {/* Related Collections */}
              <div className="w-1/2 sm:w-full flex flex-col items-start text-white">
                <span className="text-start text-[8rem] sm:text-[3rem] font-bold">
                  Related Collections
                </span>
                <ul className="ml-[6rem] sm:ml-[2rem]">
                  {slicedCollections &&
                    slicedCollections.length > 0 &&
                    slicedCollections.map((collection, index) => {
                      if (collection) {
                        const keyword =
                          typeof collection === "string"
                            ? collection
                            : Object.keys(collection)[0];
                        return (
                          <li
                            onClick={() =>
                              navigate("/lurny/list", {
                                state: { category: keyword },
                              })
                            }
                            key={index}
                            className="text-gray-300 text-left text-[6rem] sm:text-[2rem] cursor-pointer"
                          >
                            {keyword.includes("#") ? keyword : `#${keyword}`}
                          </li>
                        );
                      }
                    })}
                  {collections.length > 9 && (
                    <li
                      onClick={() => setViewAllCollections(!viewAllCollections)}
                      className="mt-[1rem] text-gray-300 text-left text-[6rem] sm:text-[2rem] cursor-pointer hover:underline font-bold"
                    >
                      {viewAllCollections
                        ? "Collapse"
                        : `${collections.length - 9} more`}
                    </li>
                  )}
                </ul>
              </div>

              {/* Related Lurnies */}
              {quizData && (
                <div className="w-1/2 sm:w-full flex flex-col items-start text-white">
                  <span className="text-start text-[8rem] sm:text-[3rem] font-bold">
                    Related Lurnies
                  </span>
                  <div className="scroll-hidden flex flex-col gap-[1.5rem]">
                    {relatedLurnies.length > 0 &&
                      relatedLurnies.slice(0, 5).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-[2rem]"
                        >
                          <img
                            onClick={() => {
                              navigate(`/lurny/feeds/${item._id}`);
                            }}
                            src={
                              userData.email === "bentan010918@gmail.com"
                                ? defaultImg
                                : getDefaultImg(item.image, item.url)
                            }
                            // src={getDefaultImg(item.image, item.url)}
                            alt="lurny image"
                            className="w-[10rem] h-[6rem] rounded-lg cursor-pointer"
                          />
                          <span className="text-[1.5rem] text-left flex flex-1">
                            {item.title}
                          </span>
                        </div>
                      ))}
                    {relatedLurnies.length > 0 && (
                      <Link
                        to="/lurny/list"
                        className="bg-[#FFC36D] w-full py-2 text-black hover:text-gray-800 text-[2rem] rounded-md cursor-pointer"
                      >
                        View All
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        className="text-[6rem] sm:text-[2rem]"
      />

      {lurnifyModal === "URL" && (
        <CreateLurnyFromURL closeModal={handleCloseLurnifyModal} />
      )}
      {lurnifyModal === "File" && (
        <CreateLurnyFromFile closeModal={handleCloseLurnifyModal} />
      )}
      {lurnifyModal === "Manually" && (
        <CreateLurnyManually closeModal={handleCloseLurnifyModal} />
      )}

      {/* Footer */}
      <div className="w-full flex sm:hidden justify-around items-center mb-[24rem]">
        <div className="flex flex-col text-white text-[12rem] items-center gap-[2rem]">
          <Link to="/">
            <BiLink id="source" className="text-white" />
          </Link>
          <label htmlFor="source" className="text-[8rem]">
            Source
          </label>
        </div>
        <RiSparkling2Fill
          className="text-yellow-400 text-[24rem]"
          onClick={() => setContent(1)}
        />
        <div className="flex flex-col text-white text-[12rem] items-center gap-[2rem]">
          <RxBookmark id="collection" />
          <label htmlFor="collection" className="text-[8rem]">
            Collection
          </label>
        </div>
        <div className="flex flex-col text-white text-[12rem] items-center gap-[2rem]">
          <LiaLanguageSolid id="language" />
          <label htmlFor="language" className="text-[8rem]">
            Language
          </label>
        </div>
      </div>
    </div>
  );
}

// LurnyQuiz.propTypes = {};

export default LurnyQuiz;
