import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import LurnyItem from "../components/LurnyItem";
import Header from "../components/Header";

import { useDispatch, useSelector } from "react-redux";
import { handleDeleteLurny, handleShareLurny } from "../actions/lurny";

import { TfiShare } from "react-icons/tfi";
import { IoTrashOutline } from "react-icons/io5";

// import Pagination from "../components/Pagination";

const LurnyGroupList = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { lurnies } = useSelector((state) => state.lurny);

  const groupItems = location.state?.groupItems;

  const [localGroupItems, setLocalGroupItems] = useState(groupItems);

  // Navigate back if there are no items left in the local group.
  useEffect(() => {
    if (localGroupItems.length === 0) {
      navigate("/lurny/profile");
    }
  }, [localGroupItems, navigate]);

  useEffect(() => {
    const idsOfGroupItems = groupItems.map((lurny) => lurny._id);
    const localLurnies = lurnies.filter((lurny) =>
      idsOfGroupItems.includes(lurny._id)
    );
    setLocalGroupItems(localLurnies);
  }, [lurnies, groupItems]);

  // const handleDelete = useCallback(
  //   async (id) => {
  //     confirmAlert({
  //       title: "Are you sure to delete this Lurny?",
  //       buttons: [
  //         {
  //           label: "Yes",
  //           onClick: async () => {
  //             dispatch(handleDeleteLurny(id));
  //             groupItems.filter((lurny) => lurny._id !== id);
  //           },
  //         },
  //         {
  //           label: "No",
  //           onClick: () => console.log("Click No"),
  //         },
  //       ],
  //     });
  //   },
  //   [dispatch]
  // );

  const handleDelete = useCallback(
    async (id) => {
      confirmAlert({
        title: "Are you sure to delete this Lurny?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              dispatch(handleDeleteLurny(id));
              // Set local group items to the filtered list after deletion
              setLocalGroupItems((prevItems) =>
                prevItems.filter((lurny) => lurny._id !== id)
              );
            },
          },
          {
            label: "No",
            onClick: () => console.log("Click No"),
          },
        ],
      });
    },
    [dispatch]
  );

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
          {localGroupItems.length > 0 && localGroupItems[0].title}
        </span>
        <span className="text-[8rem] sm:text-[2.5rem] font-bold">
          {localGroupItems.length > 0 && localGroupItems.length} Lurnies
        </span>
      </div>
      <div className="w-full bg-[#262626] flex px-[12rem] py-[4rem] justify-between">
        <div className="w-full h-full flex flex-wrap justify-center sm:justify-start gap-[8rem] lg:gap-[4rem]">
          {localGroupItems.length > 0 &&
            localGroupItems.map((lurny, index) => {
              return (
                <div key={index} className="relative flex flex-col">
                  <div className="absolute right-[4rem] sm:right-[2rem] top-[20rem] sm:top-[12rem] z-50 cursor-pointer">
                    <IoTrashOutline
                      onClick={() => handleDelete(lurny._id)}
                      className="text-[10rem] sm:text-[2rem] text-red-500 hover:text-red-400"
                    />
                  </div>

                  <LurnyItem data={lurny} />
                  {lurny.shared ? (
                    <div className="bg-[#00B050] py-[2rem] sm:py-[0.5rem] mt-auto rounded-[2rem] sm:rounded-[0.5rem] text-white text-[8rem] sm:text-[2rem] cursor-pointer">
                      Shared
                    </div>
                  ) : (
                    <div
                      className="bg-white px-[2rem] py-[4rem] sm:py-[0.5rem] mt-auto rounded-[2rem] sm:rounded-[0.5rem] flex justify-around items-center text-black text-[6.5rem] sm:text-[2rem] cursor-pointer"
                      onClick={() => dispatch(handleShareLurny(lurny._id))}
                    >
                      <TfiShare />
                      <span className="justify-center">
                        Share with Community
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default LurnyGroupList;
