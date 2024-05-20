import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";

import { ImSearch } from "react-icons/im";

import LurnyItem from "../components/LurnyItem";
import NewPagination from "../components/NewPagination";
import Header from "../components/Header";
import LurnyGroupItem from "../components/GroupItem";

const Landing = () => {
  const navigate = useNavigate();
  const { lurnies } = useSelector((state) => state.lurny);
  const [publishedLurnies, setPublishedLurnies] = useState([]);

  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  const [filteredLurnies, setFilteredLurnies] = useState([]);
  const [groupedLurnies, setGroupedLurnies] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Adjust as needed
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (lurnies.length > 0) {
      setPublishedLurnies(lurnies.filter((item) => item.shared === true));
    }
  }, [lurnies]);

  const matchesSearchTerms = (lurny) => {
    // If unsure about the structure, add additional checks
    const collectionText = lurny.collections?.join(" ") || "";
    const summaryText = lurny.summary || "";
    const titleText = lurny.title || "";
    const quizContent =
      lurny.quiz
        ?.map((quizItem) => {
          const questionText = quizItem.question || "";
          const answersText = quizItem.answers?.join(" ") || "";
          return `${questionText} ${answersText}`;
        })
        .join(" ") || "";

    const searchWords = searchTerm.toLowerCase().split(" ");
    const textToSearch = [collectionText, summaryText, titleText, quizContent]
      .join(" ")
      .toLowerCase();

    return searchWords.every((word) => textToSearch.includes(word));
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLurnies(publishedLurnies);
    } else {
      const filteredBySearch = publishedLurnies.filter(matchesSearchTerms);
      setFilteredLurnies(filteredBySearch);
    }
  }, [searchTerm, publishedLurnies]);

  useEffect(() => {
    if (filteredLurnies && filteredLurnies.length > 0) {
      const grouped = _.chain(filteredLurnies)
        .groupBy(
          (lurny) => `${lurny.date.slice(0, 19)}|${lurny.user._id}|${lurny.url}`
        )
        .value();

      setGroupedLurnies(grouped);
    }
  }, [filteredLurnies]);

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
        return <LurnyItem key={groupKey} data={lurny} />;
      }

      // If more than one, render your LurnyGroupItem component
      return (
        <LurnyGroupItem
          key={groupKey}
          group={groupItems}
          onGroupClick={() => handleExpand(groupItems)} // Implement this as needed
        />
      );
    });
  }, [groupedLurnies, currentPage, itemsPerPage]);

  const handleExpand = (groupItems) => {
    navigate("/lurny/sub-group", { state: { groupItems } });
  };

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

      <div className="w-full h-full bg-[#262626] flex flex-col px-[12rem] pt-[12rem] pb-[8rem] gap-[4rem]">
        {/* Search bar */}
        <div className="flex flex-col gap-[12rem] sm:gap-[4rem] items-center">
          <h1 className="text-white text-[10rem] leading-[11rem] sm:text-[4rem] sm:leading-[6rem] font-bold">
            Learn from millions of Lurnies <br className="hidden sm:flex" />{" "}
            drawn from the best content available on the Internet
          </h1>

          <div className="bg-white w-full sm:w-1/3 px-[4rem] sm:px-[1.5rem] py-[0.8rem] flex flex-item items-center border border-gray-500 focus-within:border-white rounded-[2rem] sm:rounded-full">
            <ImSearch className="text-gray-500 text-[8rem] sm:text-[2rem]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white text-black text-[8rem] sm:text-[2rem] px-[3rem] py-[2rem] sm:py-0 sm:px-[1.5rem] flex flex-1 focus:outline-none"
              placeholder="Search title or hashtags"
            />
          </div>
        </div>

        <div className="w-full h-full flex flex-col justify-between items-center mt-[12rem]">
          <div className="w-full h-full flex flex-wrap justify-center gap-[8rem] lg:gap-[6rem]">
            {renderLurnies()}
          </div>
          {filteredLurnies.length > itemsPerPage && (
            <NewPagination
              totalItems={filteredLurnies && filteredLurnies.length}
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

export default Landing;
