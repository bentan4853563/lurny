import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { savePrompts } from "../../actions/prompts";

import Header from "../../components/Header";
import DynamicHeightTextarea from "../../components/DynamicHeightTextarea";

export default function Prompt() {
  const dispatch = useDispatch();

  const { prompts } = useSelector((state) => state.prompt);

  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState("");
  const [stub, setStub] = useState("");

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (prompts) {
      setSummary(prompts.summary);
      setQuiz(prompts.quiz);
      setStub(prompts.stub);
    }
  }, [prompts]);

  useEffect(() => {
    if (
      summary !== prompts.summary ||
      quiz !== prompts.quiz ||
      stub !== prompts.stub
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [summary, quiz, stub]);

  const handleSavePromps = () => {
    dispatch(savePrompts({ summary, quiz, stub }));
    setIsChanged(false);
  };

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
        transition:Bounce
        className="text-[2rem]"
      />
      <div className="flex flex-col w-full px-[12rem] gap-[4rem] py-[4rem]">
        {/* Summary Prompt */}
        <div className="w-full flex flex-col">
          <label
            htmlFor="summary"
            className="text-white text-[2rem] text-start"
          >
            Summary Prompt
          </label>
          <DynamicHeightTextarea
            content={summary}
            handleChange={(e) => setSummary(e.target.value)}
          />
        </div>

        {/* Quiz Prompt */}
        <div className="w-full flex flex-col">
          <label htmlFor="quiz" className="text-white text-[2rem] text-start">
            Quiz Prompt
          </label>
          <DynamicHeightTextarea
            content={quiz}
            handleChange={(e) => setQuiz(e.target.value)}
          />
        </div>

        {/* Stub Prompt */}
        <div className="w-full flex flex-col">
          <label htmlFor="stub" className="text-white text-[2rem] text-start">
            Stub Prompt
          </label>
          <DynamicHeightTextarea
            content={stub}
            handleChange={(e) => setStub(e.target.value)}
          />
        </div>

        {isChanged && (
          <button
            onClick={handleSavePromps}
            className="bg-white hover:bg-gray-100 active:bg-gray-200 text-black text-[2rem]"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}
