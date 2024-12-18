import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { ThreeDots } from "react-loader-spinner";

import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { handleLurnyData } from "../../actions/lurny";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateLurnyFromURL({ closeModal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const quiz_server_url = import.meta.env.VITE_QUIZ_SERVER;
  const inputUrlRef = useRef(null);

  const { userDetails } = useSelector((state) => state.user);

  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [lurnyData, setLurnyData] = useState(null);

  const onChangeURL = (e) => {
    setUrl(e.target.value);
  };

  const onClickLurnifyFromURL = async () => {
    if (url === "") {
      toast.error("Please input url");
      inputUrlRef.current.focus();
      return;
    }
    setStatus("processing");
    const response = await fetch(`${quiz_server_url}/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    if (response.ok) {
      setStatus("download");
      const data = await response.json();
      setLurnyData(data);
    }
  };

  const handleDownload = () => {
    if (lurnyData) {
      dispatch(handleLurnyData(userDetails.id, lurnyData, navigate));
      closeModal();
    } else {
      toast.error("There is no lurny data to download");
    }
  };

  const handleClickModal = (e) => {
    if (e.target.id === "modal") {
      closeModal();
    }
  };

  return (
    <div
      onClick={handleClickModal}
      id="modal"
      className="fixed inset-0 z-50 overflow-auto bg-neutral-800/50 flex"
    >
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
      <div className="w-[180rem] sm:w-[150rem] relative p-[10rem] sm:p-[8rem] bg-white rounded-[2rem] shadow-md shadow-gray-400 flex gap-[4rem] sm:divide-x-2 m-auto">
        <div className="hidden sm:flex flex-col flex-1 gap-[4rem] text-black text-[2rem]">
          <div className="flex flex-col gap-[2rem]">
            <h3 className="font-bold text-left">LURNIFY A URL</h3>
            <span className="text-left ml-[2rem]">
              Easily convert any online article or video into a Lurny by copying
              and pasting its URL
            </span>
            <span className="text-left ml-[2rem]">
              If you haven&apos;t installed the Lurny Chrome extension, use this
              method to easily convert web pages and videos into learning
              objects by just pasting the URL.
            </span>
          </div>
          <div className="flex flex-col gap-[2rem]">
            <h3 className="font-bold text-left">INSTRUCTIONS</h3>
            <ul className="list-disc ml-[4rem]">
              <li className="text-left">Copy the URL</li>
              <li className="text-left">
                Paste copied URL in the box on the right
              </li>
              <li className="text-left">Click &quot;Lurnify&quot; button</li>
              <li className="text-left">
                Wait for a few seconds while Lurny processes the text. The time
                taken to process will depend on the length of the content;
                longer content may take more time to Lurnify.. lick on the
                &quot;Download&quot; button to save the Lurny to your profile
                under the My Lurnies section.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-[1rem] items-center justify-center">
          <span className="text-[8rem] sm:text-[2rem]">
            Paste the URL in the field below this text
          </span>
          <input
            type="text"
            ref={inputUrlRef}
            value={url}
            autoFocus
            onChange={onChangeURL}
            className="w-full sm:w-3/4 bg-white text-black p-[4rem] sm:p-[1rem] border border-gray-300 rounded-[1rem] text-[6rem] sm:text-[1.5rem]  focus:outline-gray-600"
          />
          <div className="w-full flex flex-col items-center mt-[4rem] text-[6.5rem] sm:text-[2rem] text-white">
            {status === "" && (
              <button
                onClick={onClickLurnifyFromURL}
                className="w-1/2 bg-[#7F52BB]"
              >
                LURNIFY
              </button>
            )}
            {status === "processing" && (
              <button
                disabled
                className="w-1/2 flex justify-center items-end gap-[1rem] bg-[#FFC000]"
              >
                <span>PROCESSING</span>
                <ThreeDots
                  visible={true}
                  height="20"
                  width="20"
                  color="white"
                  radius="5"
                  ariaLabel="three-dots-loading"
                />
              </button>
            )}
            {status === "download" && (
              <button onClick={handleDownload} className="w-1/2 bg-[#00B050]">
                DOWNLOAD TO LURNY
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

CreateLurnyFromURL.propTypes = {
  closeModal: PropTypes.func.isRequired,
};
