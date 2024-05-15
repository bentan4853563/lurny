import { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import { useSelector, useDispatch } from "react-redux";

import { TfiShare } from "react-icons/tfi";
import { IoIosArrowForward } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";

import LurnyItem from "../components/LurnyItem";

import defaultImg from "../assets/images/Lurny/default.png";
import UserPan from "../components/UserPan";
import NewPagination from "../components/NewPagination";
import {
  handleDeleteLurny,
  handleInsertLurny,
  handleShareLurny,
} from "../actions/lurny";
import Header from "../components/Header";
import getSchedule from "../utils/reminder";

const LurnyFeeds = () => {
  const dispatch = useDispatch();

  const { feeds } = useSelector((state) => state.feed);

  const [userDetails, setUserDetails] = useState(null);
  const [myFeeds, setMyFeeds] = useState([]);
  const [tempData, setTempData] = useState(null);
  const [showSidePan, setShowSidePan] = useState(false);
  // const [showAll, setShowAll] = useState(true);
  // const [filterdfeeds, setFilteredfeeds] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Adjust as needed
  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    myFeeds &&
    myFeeds.length > 0 &&
    myFeeds.slice(indexOfFirstItem, indexOfLastItem);
  // Change page
  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      setUserDetails(jwtDecode(accessToken));
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
        setTempData(JSON.stringify(data));
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    // clearfeeds();
    if (userDetails) {
      let myFeeds = [];
      feeds.map((lurny) => {
        const schedule = getSchedule(lurny.user.repeatTimes, lurny.user.period);
        if (
          userDetails.id === lurny.user._id &&
          Date.now() - lurny.last_learned > schedule[lurny.learn_count]
        ) {
          myFeeds.push(lurny);
        }
      });
      setMyFeeds(feeds);
    }
  }, [userDetails, feeds]);

  const storedTempData = localStorage.getItem("tempData");
  useEffect(() => {
    if (storedTempData) {
      setTempData(storedTempData);
      localStorage.removeItem("tempData");
    }
  }, [storedTempData]);

  useEffect(() => {
    if (userDetails && tempData && tempData !== "undefined") {
      try {
        const parsedTempData = JSON.parse(tempData);
        if (parsedTempData.media === "PDF") {
          const { summary_content, questions, fileName, url } = parsedTempData;

          if (Array.isArray(summary_content) && summary_content.length > 0) {
            // If summary_content[0] is a string containing JSON, parse it as well
            const json_summary_content = JSON.parse(summary_content[0]);

            const title = json_summary_content.title;
            const summary = json_summary_content.summary;
            const collections = json_summary_content.hash_tags;

            let quiz = [];
            questions.forEach((element) => {
              quiz.push(JSON.parse(element));
            });
            const lurnyObject = {
              user: userDetails.id,
              title,
              summary,
              collections,
              quiz,
              image: defaultImg, // Ensure getDefaultImg function is defined or imported
              url: url ? url : fileName,
            };
            dispatch(handleInsertLurny(lurnyObject, myFeeds[0].user));
          }
        } else {
          const { summary_content, questions, image, url } = parsedTempData;

          if (Array.isArray(summary_content) && summary_content.length > 0) {
            // If summary_content[0] is a string containing JSON, parse it as well
            const json_summary_content = JSON.parse(summary_content[0]);

            const title = json_summary_content.title;
            const summary = json_summary_content.summary;
            const collections = json_summary_content.hash_tags;

            let quiz = [];
            questions.forEach((element) => {
              quiz.push(JSON.parse(element));
            });

            const lurnyObject = {
              user: userDetails.id,
              title,
              summary,
              collections,
              quiz,
              image: getDefaultImg(image, url), // Ensure getDefaultImg function is defined or imported
              url,
            };
            dispatch(handleInsertLurny(lurnyObject));
          }
        }
      } catch (e) {
        console.error("Failed to parse tempData", e);
      }
      // setTempData(null);
    }
  }, [tempData, userDetails]);

  const isYoutubeUrl = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getDefaultImg = (image, url) => {
    if (isYoutubeUrl(url)) {
      return `${url}/maxresdefault.jpg`;
    } else {
      return image ? image : defaultImg;
    }
  };

  const handleDelete = useCallback(
    async (id) => {
      confirmAlert({
        title: "Are you sure to delete this Lurny?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              dispatch(handleDeleteLurny(id));
            },
          },
          {
            label: "No",
            onClick: () => console.log("Click No"),
          },
        ],
      });
    },
    [dispatch]
  );

  return (
    <div className="min-w-[100vw] min-h-[100vh] font-raleway">
      <Header />
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
        transition:Bounce
        className="text-[2rem]"
      />
      <div className="w-full bg-[#262626] flex flex-1 justify-between px-[12rem] py-[6rem]">
        {/* Toggle button for mobile */}
        <div
          onClick={() => setShowSidePan(!showSidePan)}
          className="h-full bg-transparent sm:hidden fixed bottom-0 left-0 flex items-center z-50"
        >
          <IoIosArrowForward
            className={`text-[12rem] text-white hover:translate-x-[2rem] hover:duration-300 ${
              showSidePan
                ? "rotate-180 hover:translate-x-[-2rem] hover:duration-300"
                : ""
            }`}
          />
        </div>
        <div className="hidden sm:flex">
          <UserPan
            all={myFeeds.length}
            // saved={countSharedTrue}
            // showAll={(value) => setShowAll(value)}
          />
        </div>

        {/* UserPan is hidden on small screens initially */}
        <div
          className={`${showSidePan ? "absolute" : "hidden"} sm:block`}
        ></div>

        {/* My feeds */}
        <div className="w-full flex flex-col justify-between items-center">
          <div className="w-full flex flex-wrap pl-[10rem] justify-start gap-[8rem] lg:gap-[4rem]">
            {currentItems &&
              currentItems.length > 0 &&
              currentItems.map((lurny, index) => {
                if (typeof lurny === "object" && Object.keys(lurny).length > 3)
                  return (
                    <div key={index} className="relative flex flex-col">
                      <div className="absolute right-[8rem] sm:right-[2rem] top-[60rem] sm:top-[12rem] z-50 cursor-pointer">
                        <IoTrashOutline
                          onClick={() => handleDelete(lurny._id)}
                          className="text-[12rem] sm:text-[2rem] text-white hover:text-red-400"
                        />
                      </div>

                      <LurnyItem data={lurny} />
                      {lurny.shared ? (
                        <div className="bg-[#00B050] py-[4rem] sm:py-[0.5rem] mt-auto rounded-md text-white text-[8rem] sm:text-[2rem] cursor-pointer">
                          Shared
                        </div>
                      ) : (
                        <div
                          className="bg-white px-[2rem] py-[4rem] sm:py-[0.5rem] mt-auto rounded-md flex justify-around items-center text-black text-[8rem] sm:text-[2rem] cursor-pointer"
                          onClick={() => dispatch(handleShareLurny(lurny._id))}
                        >
                          <TfiShare />
                          <span className="justify-center">
                            Share with Community
                          </span>
                        </div>
                      )}
                    </div>
                  );
              })}
          </div>
          {myFeeds.length > 0 && (
            <NewPagination
              totalItems={myFeeds && myFeeds.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              paginate={(value) => paginate(value)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LurnyFeeds;
