import PropTypes from "prop-types";

import folderImg from "../assets/images/Lurny/folder.png";

const LurnyGroupItem = ({ group, onGroupClick }) => {
  // Implementation details for the grouped items component
  // For example, show a folder with the count of items
  return (
    <div
      onClick={onGroupClick}
      className="group-item relative w-[80rem] sm:w-[48rem] lg:w-[30rem] cursor-pointer"
    >
      <img
        src={folderImg}
        alt="Folder"
        className="h-[40rem] sm:h-[24rem] lg:h-[24rem] w-full object-cover rounded-[6rem] sm:rounded-[1.5rem]"
      />
      <div className="absolute top-[4rem] left-0 w-full p-[2rem] flex flex-col gap-[2rem] text-black">
        <span className="text-[1.5rem] text-left font-bold">
          CLUSTER {group.length} LURNIES
        </span>
        <span className="w-full text-[6.5rem] sm:text-[4rem] lg:text-[2rem] leading-[11rem] sm:leading-[6rem] lg:leading-[2.5rem] text-left font-bold line-clamp-4">
          {group[0].title}
        </span>
      </div>
    </div>
  );
};

LurnyGroupItem.propTypes = {
  group: PropTypes.array.isRequired,
  onGroupClick: PropTypes.func,
};

export default LurnyGroupItem;
