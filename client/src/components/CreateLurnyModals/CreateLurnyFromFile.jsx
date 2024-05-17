import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { ThreeDots } from "react-loader-spinner";

import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { handleLurnyData } from "../../actions/lurny";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateLurnyFromFile({ closeModal }) {
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
        className="text-[2rem]"
      />
      <div className="w-[150rem] sm:w-[150rem] relative p-[10rem] sm:p-[8rem] bg-white rounded-[2rem] shadow-md shadow-gray-400 flex gap-[4rem] divide-x-2 m-auto">
        <div className="flex flex-col flex-1 gap-[4rem] text-black text-[1.5rem]">
          <div className="flex flex-col gap-[2rem]">
            <h3 className="font-bold text-left">LURNIFY A PDF</h3>
            <span className="text-left ml-[2rem]">
              Convert entire PDF documents into multiple Lurnies by uploading
              the PDF file or providing its URL.
            </span>
          </div>
          <div className="flex flex-col gap-[2rem]">
            <h3 className="font-bold text-left">INSTRUCTIONS</h3>
            <ul className="list-disc ml-[4rem]">
              <li className="text-left">Upload the PDF or</li>
              <li className="text-left">
                Paste the copied text into the box on the right.
              </li>
              <li className="text-left">Click &quot;Lurnify&quot; button</li>
              <li className="text-left">
                Wait for a few seconds while Lurny processes the text. The time
                taken to process will depend on the length of the content;
                longer content may take more time to Lurnify.. lick on the
                &quot;Download&quot; button to save the Lurny to your profile
                under the My Lurnies section.
              </li>
              <li className="text-left">under the My Lurnies section.</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-[1rem] items-center justify-center">
          <span className="text-[2rem]">
            Paste the URL in the field below this text
          </span>
          <input
            type="text"
            ref={inputUrlRef}
            value={url}
            onChange={onChangeURL}
            className="w-3/4 p-[1rem] border border-gray-300 rounded-[1rem] text-[1.5rem] focus:outline-gray-600"
          />
          <div className="w-full mt-[4rem]">
            {status === "" && (
              <button
                onClick={onClickLurnifyFromURL}
                className="w-1/2 bg-[#7F52BB] text-white text-[2rem]"
              >
                LURNIFY
              </button>
            )}
            {status === "processing" && (
              <button
                disabled
                className="w-1/2 flex justify-center items-end gap-[1rem] bg-[#FFC000] text-white text-[2rem]"
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
              <button
                onClick={handleDownload}
                className="w-1/2 bg-[#00B050] text-white text-[2rem]"
              >
                DOWNLOAD TO LURNY
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

CreateLurnyFromFile.propTypes = {
  closeModal: PropTypes.func.isRequired,
};
