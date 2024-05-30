import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";

import LurnyItem from "../components/LurnyItem";
import NewPagination from "../components/NewPagination";
import Header from "../components/Header";
import LurnyGroupItem from "../components/GroupItem";
import Categories from "../utils/Categories.json";

const LurnyCategory = () => {
  const navigate = useNavigate();
  let { firstLevelCategory, secondLevelCategory, thirdLevelCategory } =
    useParams();

  const { lurnies } = useSelector((state) => state.lurny);
  const [publishedLurnies, setPublishedLurnies] = useState([]);

  const [groupedLurnies, setGroupedLurnies] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Adjust as needed
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (lurnies.length > 0) {
      console.log("change category =>");
      const filteredLurnies = lurnies.filter(
        (item) =>
          item.shared === true &&
          item.collections.some((collection) => {
            if (thirdLevelCategory) {
              return Object.values(collection)[0][2] === thirdLevelCategory;
            } else if (secondLevelCategory) {
              return Object.values(collection)[0][1] === secondLevelCategory;
            } else {
              return Object.values(collection)[0][0] === firstLevelCategory;
            }
          })
      );
      console.log("filteredLurnies :>> ", filteredLurnies);
      setPublishedLurnies(filteredLurnies);
    }
  }, [lurnies, firstLevelCategory, secondLevelCategory, thirdLevelCategory]);

  useEffect(() => {
    const grouped = _.chain(publishedLurnies)
      .groupBy(
        (lurny) => `${lurny.date.slice(0, 19)}|${lurny.user._id}|${lurny.url}`
      )
      .value();

    setGroupedLurnies(grouped);
  }, [publishedLurnies]);

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
  if (thirdLevelCategory && secondLevelCategory && firstLevelCategory) {
    fourthLevelCategories =
      Categories[firstLevelCategory][secondLevelCategory][thirdLevelCategory];
  }

  if (typeof Object.values(fourthLevelCategories)[0] === "object") {
    fourthLevelCategories = Object.keys(fourthLevelCategories);
  } else if (typeof Object.values(fourthLevelCategories)[0] === "string") {
    fourthLevelCategories = Object.values(fourthLevelCategories);
  }

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
                <li className="text-left ml-[1rem]">
                  {secondLevelCategory.includes("#")
                    ? secondLevelCategory
                    : `#${secondLevelCategory}`}
                </li>
              )}
              {thirdLevelCategory && (
                <li className="text-left ml-[2rem]">
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
          <div className="w-full h-full pl-[4rem] flex flex-col justify-between items-center">
            <div className="w-full h-full flex flex-wrap justify-center sm:justify-start gap-[8rem] lg:gap-[4rem]">
              {renderLurnies()}
            </div>
            {publishedLurnies.length > itemsPerPage && (
              <NewPagination
                totalItems={publishedLurnies && publishedLurnies.length}
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
