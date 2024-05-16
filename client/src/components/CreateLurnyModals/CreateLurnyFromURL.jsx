import PropTypes from "prop-types";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";

export default function CreateLurnyFromURL({ closeModal }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");

  const onChangeURL = (e) => {
    setUrl(e.target.value);
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
      <div className="w-[150rem] sm:w-[150rem] relative p-[10rem] sm:p-[8rem] bg-white rounded-[2rem] shadow-md shadow-gray-400 flex gap-[4rem] divide-x-2 m-auto">
        <div className="flex flex-col flex-1 gap-[4rem] text-black text-[1.5rem]">
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
              <li className="text-left">Click button</li>
              <li className="text-left">
                Click on the &quot;Download&quot; button to save the Lurny to
                your profile
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
            value={url}
            onChange={onChangeURL}
            className="w-3/4 p-[1rem] border border-gray-300 rounded-[1rem] text-[2rem] focus:outline-gray-600"
          />
          {status === "" && (
            <button className="w-1/2 bg-[#7F52BB] text-white text-[2rem]">
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
            <button className="w-1/2 bg-[#00B050] text-white text-[2rem]">
              DOWNLOAD TO LURNY
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

CreateLurnyFromURL.propTypes = {
  closeModal: PropTypes.func.isRequired,
};
