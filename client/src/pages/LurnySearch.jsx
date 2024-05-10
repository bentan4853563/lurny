import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ImSearch } from "react-icons/im";

import LurnyItem from "../components/LurnyItem";
import NewPagination from "../components/NewPagination";
import Header from "../components/Header";

const LurnySearch = () => {
  const { lurnies } = useSelector((state) => state.lurny);
  const [publishedLurnies, setPublishedLurnies] = useState([]);

  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  const [filteredLurnies, setFilteredLurnies] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Adjust as needed
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLurnies.slice(indexOfFirstItem, indexOfLastItem);

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

  console.log("filteredLurnies", filteredLurnies);

  return (
    <div className="h-[100vh] font-raleway">
      <Header />
      <ToastContainer className="text-start" />

      <div className="w-full bg-[#262626] flex flex-col px-[12rem] py-[4rem] gap-[4rem]">
        {/* Search bar */}
        <div className="bg-transparent w-full px-[1.5rem] py-[0.5rem] flex flex-item items-center border border-gray-500 focus-within:border-white rounded-[0.5rem]">
          <ImSearch className="text-white text-[2rem]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-white text-[2rem] px-[1.5rem] flex flex-1 focus:outline-none"
            placeholder="Search topics and people"
          />
        </div>

        <div className="w-full flex flex-col justify-between items-center">
          <div className="w-full flex flex-wrap justify-start gap-[8rem] lg:gap-[4rem]">
            {currentItems.map((lurny, index) => (
              <LurnyItem key={index} data={lurny} />
            ))}
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

export default LurnySearch;
