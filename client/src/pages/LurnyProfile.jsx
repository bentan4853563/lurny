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

import defaultImg from "../assets/images/Lurny/default.png";

import Header from "../components/Header";
import UserPan from "../components/UserPan";
import LurnyItem from "../components/LurnyItem";
import NewPagination from "../components/NewPagination";

import {
  handleDeleteLurny,
  handleInsertLurny,
  handleShareLurny,
} from "../actions/lurny";

const LurnyProfile = () => {
  const dispatch = useDispatch();

  const { lurnies } = useSelector((state) => state.lurny);

  const [userDetails, setUserDetails] = useState(null);
  const [myLurnies, setMyLurnies] = useState([]);
  const [tempData, setTempData] = useState(null);
  const [showSidePan, setShowSidePan] = useState(false);
  // const [showAll, setShowAll] = useState(true);
  // const [filterdLurnies, setFilteredLurnies] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Adjust as needed
  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    myLurnies &&
    myLurnies.length > 0 &&
    myLurnies.slice(indexOfFirstItem, indexOfLastItem);
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
    // clearLurnies();
    if ((userDetails, lurnies)) {
      let tempLurnies = lurnies;
      let filtered = tempLurnies.filter(
        (lurny) => lurny.user._id === userDetails.id
      );
      setMyLurnies(filtered);
    }
  }, [userDetails, lurnies]);

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
        let newLurnies = [];
        const parsedTempData = JSON.parse(tempData);
        for (let i = 0; i < parsedTempData.length; i++) {
          const parsedLurny = JSON.parse(parsedTempData[i]);
          if (parsedLurny.media === "PDF") {
            const { summary_content, questions, fileName, url } = parsedLurny;
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
              newLurnies.push(lurnyObject);
            }
          } else {
            const { summary_content, questions, image, url } = parsedLurny;

            // if (Array.isArray(summary_content) && summary_content.length > 0) {
            const json_summary_content = JSON.parse(summary_content);
            // If summary_content[0] is a string containing JSON, parse it as well

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
            newLurnies.push(lurnyObject);
          }
        }
        if (newLurnies.length > 0) {
          console.log("newLurnies", newLurnies);
          dispatch(handleInsertLurny(newLurnies));
        }
      } catch (e) {
        console.error("Failed to parse tempData", e);
      }
      // setTempData(null);
    }
  }, [tempData, userDetails]);

  // useEffect(() => {
  //   setCurrentPage(1);
  //   if (showAll) {
  //     setFilteredLurnies(lurnies);
  //   } else {
  //     let temp = lurnies.filter((lurny) => lurny.user !== userDetails.id);
  //     setFilteredLurnies(temp);
  //   }
  // }, [showAll, lurnies]);

  // const [countSharedTrue, setCountSharedTrue] = useState(0);

  // useEffect(() => {
  //   if (userDetails && lurnies && lurnies.length > 0) {
  //     const count =
  //       lurnies.length > 0
  //         ? lurnies.filter((obj) => obj.user !== userDetails.id).length
  //         : 0;
  //     setCountSharedTrue(count);
  //   }
  // }, [userDetails, lurnies]);

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
    <div className="min-h-[100vh] font-raleway">
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
            all={myLurnies.length}
            // saved={countSharedTrue}
            // showAll={(value) => setShowAll(value)}
          />
        </div>

        {/* UserPan is hidden on small screens initially */}
        <div
          className={`${showSidePan ? "absolute" : "hidden"} sm:block`}
        ></div>

        {/* My Lurnies */}
        <div className="w-full flex flex-col justify-between items-center">
          <div className="w-full flex flex-wrap pl-[6rem] justify-start gap-[8rem] lg:gap-[4rem]">
            {currentItems &&
              currentItems.length > 0 &&
              currentItems.map((lurny, index) => {
                // if (typeof lurny === "object" && Object.keys(lurny).length > 3)
                return (
                  <div key={index} className="relative flex flex-col">
                    <div className="absolute right-[8rem] sm:right-[2rem] top-[60rem] sm:top-[12rem] z-50 cursor-pointer">
                      <IoTrashOutline
                        onClick={() => handleDelete(lurny._id)}
                        className="text-[12rem] sm:text-[2rem] text-red-500 hover:text-red-400"
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
          {myLurnies.length > 0 && (
            <NewPagination
              totalItems={myLurnies && myLurnies.length}
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

export default LurnyProfile;
