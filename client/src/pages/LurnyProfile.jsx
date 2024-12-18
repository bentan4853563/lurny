import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import _ from "lodash";

import { useSelector, useDispatch } from "react-redux";

import { TfiShare } from "react-icons/tfi";
import { IoIosArrowForward } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";

import Header from "../components/Header";
import UserPan from "../components/UserPan";
import LurnyItem from "../components/LurnyItem";
import LurnyGroupItem from "../components/GroupItem";
import NewPagination from "../components/NewPagination";

import {
  handleDeleteLurny,
  handleDeleteLurnyCluster,
  handleLurnyData,
  handleShareLurny,
  handleShareMany,
} from "../actions/lurny";

const LurnyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { lurnies } = useSelector((state) => state.lurny);

  const [userDetails, setUserDetails] = useState(null);
  const [myLurnies, setMyLurnies] = useState([]);
  const [tempData, setTempData] = useState(null);
  const [showSidePan, setShowSidePan] = useState(false);

  const [groupedLurnies, setGroupedLurnies] = useState({});
  // const [showAll, setShowAll] = useState(true);
  // const [filterdLurnies, setFilteredLurnies] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Adjust as needed
  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

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
    if (userDetails && lurnies && lurnies.length > 0) {
      let tempLurnies = lurnies;
      let filtered = tempLurnies.filter(
        (lurny) => lurny.user._id === userDetails.id
      );
      setMyLurnies(filtered);
    }
  }, [userDetails, lurnies]);

  useEffect(() => {
    if (myLurnies && myLurnies.length > 0) {
      const grouped = _.chain(myLurnies)
        .groupBy(
          (lurny) => `${lurny.date.slice(0, 19)}|${lurny.user._id}|${lurny.url}`
        )
        .value();
      setGroupedLurnies(grouped);
    }
  }, [myLurnies]);

  const storedTempData = localStorage.getItem("tempData");

  useEffect(() => {
    if (storedTempData) {
      setTempData(storedTempData);
      localStorage.removeItem("tempData");
    }
  }, [storedTempData]);

  useEffect(() => {
    console.log("tempData :>> ", tempData);
    if (userDetails && tempData && tempData !== "undefined") {
      dispatch(handleLurnyData(userDetails.id, tempData, navigate));
      // try {
      //   let newLurnies = [];
      //   const parsedTempData = JSON.parse(tempData);
      //   for (let i = 0; i < parsedTempData.length; i++) {
      //     const parsedLurny = JSON.parse(parsedTempData[i]);
      //     if (parsedLurny.media === "PDF") {
      //       const { summary_content, questions, fileName, url } = parsedLurny;
      //       if (Array.isArray(summary_content) && summary_content.length > 0) {
      //         // If summary_content[0] is a string containing JSON, parse it as well
      //         const json_summary_content = JSON.parse(summary_content[0]);

      //         const title = json_summary_content.title;
      //         const summary = json_summary_content.summary;
      //         const collections = json_summary_content.hash_tags;

      //         let quiz = [];
      //         questions.forEach((element) => {
      //           quiz.push(JSON.parse(element));
      //         });
      //         const lurnyObject = {
      //           user: userDetails.id,
      //           title,
      //           summary,
      //           collections,
      //           quiz,
      //           image: defaultImg, // Ensure getDefaultImg function is defined or imported
      //           url: url ? url : fileName,
      //         };
      //         newLurnies.push(lurnyObject);
      //       }
      //     } else {
      //       const { summary_content, questions, image, url } = parsedLurny;

      //       // if (Array.isArray(summary_content) && summary_content.length > 0) {
      //       const json_summary_content = JSON.parse(summary_content);
      //       // If summary_content[0] is a string containing JSON, parse it as well

      //       const title = json_summary_content.title;
      //       const summary = json_summary_content.summary;
      //       const collections = json_summary_content.hash_tags;

      //       let quiz = [];
      //       questions.forEach((element) => {
      //         quiz.push(JSON.parse(element));
      //       });

      //       const lurnyObject = {
      //         user: userDetails.id,
      //         title,
      //         summary,
      //         collections,
      //         quiz,
      //         image: getDefaultImg(image, url), // Ensure getDefaultImg function is defined or imported
      //         url,
      //       };
      //       newLurnies.push(lurnyObject);
      //     }
      //   }
      //   if (newLurnies.length > 0) {
      //     console.log("newLurnies", newLurnies);
      //     dispatch(handleInsertLurny(newLurnies));
      //   }
      // } catch (e) {
      //   console.error("Failed to parse tempData", e);
      // }
    }
  }, [tempData, userDetails]);

  function areAllLurnisShared(groupItems) {
    return groupItems.every((item) => item.shared === true);
  }

  // Render the grouped lurnies or individual lurnies based on the grouping condition
  const renderLurnies = useCallback(() => {
    const groupArray = Object.entries(groupedLurnies);

    // Calculate the current groups based on pagination
    const currentGroupIndices = groupArray.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    return currentGroupIndices.map(([groupKey, groupItems]) => {
      // If only one item in the group, render LurnyItem
      if (groupItems.length === 1) {
        const lurny = groupItems[0];
        return (
          <div key={groupKey} className="relative flex flex-col">
            <div className="absolute right-[4rem] sm:right-[2rem] top-[20rem] sm:top-[12rem] z-50 cursor-pointer">
              <IoTrashOutline
                onClick={() => handleDelete(lurny._id)}
                className="text-[10rem] sm:text-[2rem] text-red-500 hover:text-red-400"
              />
            </div>

            <LurnyItem data={lurny} />
            {lurny.shared ? (
              <div className="bg-[#00B050] py-[2rem] sm:py-[0.5rem] mt-auto rounded-[2rem] sm:rounded-[0.5rem] text-white text-[8rem] sm:text-[2rem] cursor-pointer">
                Shared
              </div>
            ) : (
              <div
                className="bg-white px-[2rem] py-[4rem] sm:py-[0.5rem] mt-auto rounded-[2rem] sm:rounded-[0.5rem] flex justify-around items-center text-black text-[6.5rem] sm:text-[2rem] cursor-pointer"
                onClick={() => dispatch(handleShareLurny(lurny._id))}
              >
                <TfiShare />
                <span className="justify-center">Share with Community</span>
              </div>
            )}
          </div>
        );
      }
      // If more than one, render your LurnyGroupItem component
      const allLurnisShared = areAllLurnisShared(groupItems);

      return (
        <div key={groupKey} className="relative flex flex-col">
          <div className="absolute right-[4rem] sm:right-[2rem] top-[20rem] sm:top-[20rem] z-50 cursor-pointer">
            <IoTrashOutline
              onClick={() => handleDeleteCluster(groupKey)}
              className="text-[10rem] sm:text-[2rem] text-red-500 hover:text-red-400"
            />
          </div>

          {/* <LurnyItem data={lurny} /> */}
          <LurnyGroupItem
            key={groupKey}
            group={groupItems}
            onGroupClick={() => handleExpand(groupItems)} // Implement this as needed
          />
          {allLurnisShared ? (
            <div className="bg-[#00B050] py-[2rem] sm:py-[0.5rem] mt-auto rounded-[2rem] sm:rounded-[0.5rem] text-white text-[8rem] sm:text-[2rem] cursor-pointer">
              Shared
            </div>
          ) : (
            <div
              className="bg-white px-[2rem] py-[4rem] sm:py-[0.5rem] mt-auto rounded-[2rem] sm:rounded-[0.5rem] flex justify-around items-center text-black text-[6.5rem] sm:text-[2rem] cursor-pointer"
              onClick={() => dispatch(handleShareMany(groupKey))}
            >
              <TfiShare />
              <span className="justify-center">Share with Community</span>
            </div>
          )}
        </div>
      );
    });
  }, [groupedLurnies, currentPage, itemsPerPage]);

  const handleExpand = (groupItems) => {
    navigate("/lurny/sub-group", { state: { groupItems } });
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

  const handleDeleteCluster = useCallback(
    async (groupKey) => {
      confirmAlert({
        title: "Are you sure to delete this Lurny Cluster?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              dispatch(handleDeleteLurnyCluster(groupKey));
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

  handleDeleteCluster;

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
        transition={Bounce}
        className="text-[6rem] sm:text-[2rem]"
      />
      <div className="w-full bg-[#262626] flex flex-1 justify-between px-[12rem] py-[6rem] relative">
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

        {/* UserPan is hidden on small screens initially */}
        <div
          className={`${showSidePan ? "absolute" : "hidden"} sm:block h-full`}
        >
          <UserPan />
        </div>

        {/* My Lurnies */}
        <div className="w-full flex flex-col justify-between items-center">
          <div className="w-full flex flex-wrap pl-[6rem] justify-start gap-[8rem] lg:gap-[4rem]">
            {renderLurnies()}
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
