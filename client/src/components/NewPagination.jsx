import { useState } from "react";
import PropTypes from "prop-types";

import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const NewPagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];
  const [pageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  const handleClick = (event) => {
    paginate(Number(event.target.id));
  };

  const handleNextBtn = () => {
    if (currentPage < pageNumbers.length) {
      paginate(currentPage + 1);

      if (currentPage + 1 > maxPageNumberLimit) {
        setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
        setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
      }
    }
  };

  const handlePrevBtn = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);

      if ((currentPage - 1) % pageNumberLimit === 0) {
        setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
        setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
      }
    }
  };

  return (
    <nav className="flex justify-center my-[8rem] sm:my-[4rem] mx-auto border border-gray-400 rounded-[2rem] text-white">
      {pageNumbers.length > 1 && (
        <ul className="list-reset flex items-center gap-[4rem] sm:gap-[1.5rem] px-[2rem] py-[1rem]">
          <li>
            <span
              aria-label="Previous Page"
              onClick={handlePrevBtn}
              disabled={currentPage === 1}
              className={`text-[8rem] sm:text-[2rem] p-[0.5rem] rounded focus:outline-none bg-transparent block cursor-pointer hover:border border-white ${
                currentPage === 1 && "cursor-not-allowed"
              }`}
            >
              <IoIosArrowBack />
            </span>
          </li>
          {pageNumbers.map((number) => {
            if (
              number < maxPageNumberLimit + 1 &&
              number > minPageNumberLimit
            ) {
              return (
                <li key={number}>
                  <a
                    id={number}
                    onClick={handleClick}
                    href="#!"
                    className={`text-[8rem] sm:text-[2rem] text-white px-12 sm:px-4 py-4 sm:py-2 font-sans rounded-full hover:border hover:border-gray-100 hover:text-white ${
                      currentPage === number ? "font-bold border" : ""
                    }`}
                  >
                    {number}
                  </a>
                </li>
              );
            } else {
              return null;
            }
          })}
          {maxPageNumberLimit < pageNumbers.length && (
            <li className="mx-2 text-[8rem] sm:text-[2rem] text-white">...</li>
          )}
          <li>
            <span
              onClick={handleNextBtn}
              disabled={currentPage === pageNumbers[pageNumbers.length - 1]}
              className={`text-[8rem] sm:text-[2rem] p-[0.5rem] focus:outline-none bg-transparent hover:border border-white block ${
                currentPage === pageNumbers[pageNumbers.length - 1] &&
                "cursor-not-allowed"
              }`}
            >
              <IoIosArrowForward />
            </span>
          </li>
        </ul>
      )}
    </nav>
  );
};

NewPagination.propTypes = {
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number,
  currentPage: PropTypes.number,
  paginate: PropTypes.func,
};

export default NewPagination;
