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

  const handleClickCategory = () => {
    console.log(firstLevelCategory, secondLevelCategory, thirdLevelCategory);
    navigate("/lurny/category", {
      state: {
        category: [firstLevelCategory, secondLevelCategory, thirdLevelCategory],
      },
    });
    hideModal();
  };

  return (
    <div
      onMouseLeave={() => hideModal()}
      onMouseEnter={() => maintainModal()}
      className="absolute left-0 top-full py-[1rem]"
    >
      <div className="bg-[#505050] rounded-[0.2rem] text-white shadow-md shadow-[#2e2e2e] flex flex-col">
        {firstLevelCategories.map((firtLevel, index) => {
          return (
            <span
              key={index}
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
                                  onClick={handleClickCategory}
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
