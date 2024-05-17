import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { handleLurnyData } from "../../actions/lurny";
import { useDispatch, useSelector } from "react-redux";

import { BsFilePdf } from "react-icons/bs";
import { BsFiletypeDocx } from "react-icons/bs";
import { BsFiletypePpt } from "react-icons/bs";
import { PiFileDocDuotone } from "react-icons/pi";
import { FiFileText } from "react-icons/fi";

export default function CreateLurnyFromFile({ closeModal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const quiz_server_url = import.meta.env.VITE_QUIZ_SERVER;

  // State hooks
  const { userDetails } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("");
  const [lurnyData, setLurnyData] = useState(null);

  useEffect(() => {
    setStatus("");
  }, [fileName]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      setFile(selectedFile); // Store file object
    }
  };

  const getFileIcon = (fileName) => {
    if (fileName) {
      const extension = fileName.split(".").pop().toLowerCase();
      console.log("extension :>> ", extension);
      switch (extension) {
        case "pdf":
          return <BsFilePdf />;
        case "docx":
          return <BsFiletypeDocx />;
        case "doc":
          return <PiFileDocDuotone />;
        case "ppt":
          return <BsFiletypePpt />;
        default:
          return <FiFileText />;
      }
    }
  };

  const onClickLurnify = async () => {
    console.log("Starting upload:", fileName);

    if (!file) {
      toast.error("Please upload a file");
      return;
    }

    setStatus("processing");

    try {
      const formData = new FormData();
      formData.append("file", file); // Append the file

      const response = await fetch(`${quiz_server_url}/lurnify-from-file`, {
        method: "POST",
        body: formData, // Send form data
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLurnyData(data);
      setStatus("download");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Error: ${error.message}`);
      setStatus("error");
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
                Drag and Drop some other text files.
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

        <div className="px-[2rem] flex flex-col flex-1 gap-[2rem] items-center justify-center">
          <div className="w-full h-full flex item-center justify-center border-2 border-gray-600 border-dotted rounded-[1rem]">
            <div className="flex flex-col gap-[2rem] justify-center text-[2rem] text-black">
              <span className="font-bold">
                Drag and Drop your files here <br />
                PDFs, DOC, DOCX, PPT etc.
              </span>
              <span>or</span>
              <label
                htmlFor="file-upload"
                className="bg-white p-[1rem] border border-gray-400 rounded-[1rem] cursor-pointer hover:border-gray-600"
              >
                Browse Files
              </label>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx"
              />
              <div className="flex items-center gap-[2rem]">
                <span className="text-[4rem]">{getFileIcon(fileName)}</span>
                <span className="text-[1.5rem]">{fileName}</span>
              </div>
            </div>
          </div>
          <div className="w-full">
            {status === "" && (
              <button
                onClick={onClickLurnify}
                className="w-1/2 bg-[#7F52BB] text-white text-[2rem]"
              >
                LURNIFY
              </button>
            )}
            {status === "processing" && (
              <span
                disabled
                className="w-1/2 mx-auto flex justify-center items-end gap-[1rem] bg-[#FFC000] text-white text-[2rem] p-[1rem] rounded-[1rem]"
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
              </span>
            )}
            {status === "error" && (
              <span
                disabled
                className="w-1/2 mx-auto flex justify-center items-end gap-[1rem] bg-red-400 text-white text-[2rem] p-[1rem] rounded-[1rem]"
              >
                Failed
              </span>
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
