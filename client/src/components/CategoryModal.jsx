import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Categories from "../utils/Categories.json";

import { FaAngleRight } from "react-icons/fa";

function CategoryModal({ hideModal, maintainModal }) {
  const navigate = useNavigate();

  const firstLevelCategories = Object.keys(Categories);
  const [secondLevelCategories, setSecondLevelCategories] = useState(null);
  const [thirdLevelCategories, setThirdLevelCategories] = useState(null);

  const [firstLevelCategory, setFirstLevelCategory] = useState(null);
  const [secondLevelCategory, setSecondLevelCategory] = useState(null);
  const [thirdLevelCategory, setThirdLevelCategory] = useState(null);

  useEffect(() => {
    if (firstLevelCategory) {
      setSecondLevelCategories(Object.keys(Categories[firstLevelCategory]));
    }
  }, [firstLevelCategory]);

  useEffect(() => {
    if (secondLevelCategory) {
      setThirdLevelCategories(
        Object.keys(Categories[firstLevelCategory][secondLevelCategory])
      );
    }
  }, [secondLevelCategory]);

  const handleClickCategory = (level, value) => {
    let newPath;

    // Updating the state according to the level of the category clicked.
    if (level === "first") {
      setFirstLevelCategory(value);
      setSecondLevelCategory(null);
      setThirdLevelCategory(null);
      setSecondLevelCategories(Object.keys(Categories[value]));
      newPath = `/lurny/category/${value}`;
    } else if (level === "second") {
      if (!firstLevelCategory) return; // Ensure that the first-level category has been selected
      setSecondLevelCategory(value);
      setThirdLevelCategory(null);
      setThirdLevelCategories(
        Object.keys(Categories[firstLevelCategory][value])
      );
      newPath = `/lurny/category/${firstLevelCategory}/${value}`;
    } else if (level === "third") {
      if (!firstLevelCategory || !secondLevelCategory) return; // Ensure that the first-level and second-level categories have been selected
      setThirdLevelCategory(value);
      newPath = `/lur ny/category/${firstLevelCategory}/${secondLevelCategory}/${value}`;
    }

    // Navigate to the new path
    navigate(newPath);

    hideModal(); // Since we're navigating away, we should close any open modal.
  };

  return (
    <div
      onMouseLeave={() => hideModal()}
      onMouseEnter={() => maintainModal()}
      className="absolute left-0 top-full py-[1rem]"
      style={{ zIndex: 300 }}
    >
      <div className="bg-[#505050] rounded-[0.2rem] text-white shadow-md shadow-[#2e2e2e] flex flex-col">
        {firstLevelCategories.map((firtLevel, index) => {
          return (
            <span
              key={index}
              onClick={() => handleClickCategory("first", firtLevel)}
              onMouseOver={() => setFirstLevelCategory(firtLevel)}
              className="flex items-center justify-between gap-[1rem] px-[2rem] py-[0.8rem] whitespace-nowrap text-[1.5rem] hover:bg-[#E6DEF2] hover:text-[#7F52BB] relative"
            >
              {firtLevel}
              <FaAngleRight />
              <div className="bg-[#505050] rounded-[0.2rem] text-white shadow-md shadow-[#2e2e2e] flex flex-col absolute top-0 left-full">
                {firtLevel === firstLevelCategory &&
                  secondLevelCategories &&
                  secondLevelCategories.map((secondLevel, index) => {
                    return (
                      <span
                        key={index}
                        onClick={() =>
                          handleClickCategory("second", secondLevel)
                        }
                        onMouseOver={() => setSecondLevelCategory(secondLevel)}
                        className="flex items-center justify-between gap-[1rem] px-[2rem] py-[0.8rem] whitespace-nowrap text-[1.5rem] hover:bg-[#E6DEF2] hover:text-[#7F52BB] relative"
                      >
                        {secondLevel}
                        <FaAngleRight />
                        <div className="bg-[#505050] rounded-[0.2rem] text-white shadow-md shadow-[#2e2e2e] flex flex-col absolute top-0 left-full">
                          {secondLevel === secondLevelCategory &&
                            thirdLevelCategories &&
                            thirdLevelCategories.map((thirdLevel, index) => {
                              return (
                                <span
                                  key={index}
                                  onClick={() =>
                                    handleClickCategory("third", thirdLevel)
                                  }
                                  onMouseOver={() =>
                                    setThirdLevelCategory(thirdLevel)
                                  }
                                  className="flex items-center justify-between gap-[1rem] px-[2rem] py-[0.8rem] whitespace-nowrap text-[1.5rem] hover:bg-[#E6DEF2] hover:text-[#7F52BB]"
                                >
                                  {thirdLevel}
                                  {/* <FaAngleRight /> */}
                                </span>
                              );
                            })}
                        </div>
                      </span>
                    );
                  })}
              </div>
            </span>
          );
        })}
      </div>
    </div>
  );
}

CategoryModal.propTypes = {
  hideModal: PropTypes.func.isRequired,
  maintainModal: PropTypes.func.isRequired,
};

export default CategoryModal;
