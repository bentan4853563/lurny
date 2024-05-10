import { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";

import { useSelector } from "react-redux";

import { IoIosArrowForward } from "react-icons/io";

import Header from "../components/Header";
import UserPan from "../components/UserPan";
import LurnyItem from "../components/LurnyItem";
import NewPagination from "../components/NewPagination";

import {} from "../actions/lurny";

const LurnySaved = () => {
  const { lurnies } = useSelector((state) => state.lurny);

  const [userDetails, setUserDetails] = useState(null);
  const [myLurnies, setMyLurnies] = useState([]);
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
        localStorage.setItem("tempData", JSON.stringify(data));
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    // clearLurnies();
    if (userDetails) {
      let tempLurnies = lurnies;
      let filtered = tempLurnies.filter(
        (lurny) => lurny.user._id === userDetails.id
      );
      setMyLurnies(filtered);
    }
  }, [userDetails, lurnies]);

  return (
    <div className="min-h-[100vh] font-raleway">
      <Header />
      <ToastContainer className="text-[2rem]" />
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
        <div className="w-full flex flex-col justify-between items-start">
          {/* <div className="flex flex-wrap ml-[6rem] justify-start gap-[8rem] lg:gap-[4rem]">
            {currentItems.map(
              (lurny, index) =>
                lurny.shared && <LurnyItem key={index} data={lurny} />
            )}
          </div> */}
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

export default LurnySaved;
