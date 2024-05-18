import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LurnyItem from "../components/LurnyItem";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";
// import Pagination from "../components/Pagination";

const LurnyGroupList = () => {
  const location = useLocation();
  const groupItems = location.state?.groupItems;
  console.log("groupItems :>> ", groupItems);
  return (
    <div className="w-full min-h-[100vh] font-raleway">
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
      <div className="w-full bg-[#2E2E2E] flex flex-col gap-[1rem] items-center text-white py-[4rem] sm:py-[3rem] lg:py-[2rem]">
        <span className="text-[8rem] sm:text-[2.5rem] font-bold">
          Lurny Cluster
        </span>
        <span className="text-[8rem] sm:text-[2.5rem] font-bold">
          URL: {groupItems[0].url}
        </span>
        <span className="text-[8rem] sm:text-[2.5rem] font-bold">
          {groupItems.length} Lurnies
        </span>
      </div>
      <div className="w-full bg-[#262626] flex px-[12rem] py-[4rem] justify-between">
        <div className="w-full h-full flex flex-wrap justify-center sm:justify-start gap-[8rem] lg:gap-[4rem]">
          {groupItems.map((lurny, index) => (
            <LurnyItem key={index} data={lurny} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LurnyGroupList;
