import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";

import { ImSearch } from "react-icons/im";

import LurnyItem from "../components/LurnyItem";
import NewPagination from "../components/NewPagination";
import Header from "../components/Header";
import LurnyGroupItem from "../components/GroupItem";
import Categories from "../utils/Categories.json";

const LurnyCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { category } = location.state || {};
  const [firstLevelCategory, secondLevelCategory, thirdLevelCategory] =
    category;

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
    console.log("change category =>");
    if (lurnies.length > 0 && category.length > 0) {
      const filteredLurnies = lurnies.filter(
        (item) =>
          item.shared === true &&
          item.collections.some(
            (collection) =>
              Object.values(collection)[0][2] === thirdLevelCategory
          )
      );
      setPublishedLurnies(filteredLurnies);
    }
  }, [lurnies, category]);

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

  let fourthLevelCategories = [];
  if (Categories[firstLevelCategory][secondLevelCategory][thirdLevelCategory]) {
    fourthLevelCategories =
      Categories[firstLevelCategory][secondLevelCategory][thirdLevelCategory];
  }

  if (typeof Object.values(fourthLevelCategories)[0] === "object") {
    fourthLevelCategories = Object.keys(fourthLevelCategories);
  } else if (typeof Object.values(fourthLevelCategories)[0] === "string") {
    fourthLevelCategories = Object.values(fourthLevelCategories);
  }

  console.log(firstLevelCategory, secondLevelCategory, thirdLevelCategory);

  console.log("fourthLevelCategories", fourthLevelCategories);

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

      <div className="w-full h-full bg-[#262626] flex flex-col px-[12rem] py-[12rem] sm:py-[4rem] gap-[4rem]">
        {/* Search bar */}
        <div className="bg-transparent w-full px-[4rem] sm:px-[1.5rem] py-[1rem] sm:py-[0.5rem] flex flex-item items-center border border-gray-500 focus-within:border-white rounded-[2rem] sm:rounded-[0.5rem]  text-[8rem] sm:text-[2rem] text-white">
          <ImSearch />
          <input
            type="text"
            value={searchTerm}
            autoComplete
            // autoFocus
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent  px-[1.5rem] flex flex-1 focus:outline-none"
            placeholder="Search topics and people"
          />
        </div>
        <div className="flex">
          <div className="w-[32rem] text-white">
            <ul className="flex flex-col items-start text-[2rem]">
              {firstLevelCategory && (
                <li className="text-left">
                  {firstLevelCategory.includes("#")
                    ? firstLevelCategory
                    : `#${firstLevelCategory}`}
                </li>
              )}
              {secondLevelCategory && (
                <li className="text-left">
                  {secondLevelCategory.includes("#")
                    ? secondLevelCategory
                    : `#${secondLevelCategory}`}
                </li>
              )}
              {thirdLevelCategory && (
                <li className="text-left">
                  {thirdLevelCategory.includes("#")
                    ? thirdLevelCategory
                    : `#${thirdLevelCategory}`}
                </li>
              )}
            </ul>
            <ul className="mt-[4rem] flex flex-col gap-[2rem] items-start text-[2rem]">
              {fourthLevelCategories.map((category, index) => (
                <div key={index} className="flex flex-col items-start">
                  <li className="text-white text-left">
                    {category.includes("#") ? category : `#${category}`}
                  </li>
                  <button className="px-[2rem] py-[0.5rem] bg-white text-black">
                    See All
                  </button>
                </div>
              ))}
            </ul>
          </div>
          <div className="w-full h-full flex flex-col justify-between items-center">
            <div className="w-full h-full flex flex-wrap justify-center sm:justify-start gap-[8rem] lg:gap-[4rem]">
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
    </div>
  );
};

export default LurnyCategory;
