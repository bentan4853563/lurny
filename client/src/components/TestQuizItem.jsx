import PropTypes from "prop-types";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { IoIosInformationCircleOutline } from "react-icons/io";
import BrainIcon from "../assets/icons/brain.png";

function TestQuizItem({ data, studyId }) {
  const { question, answer, correctanswer, explanation } = data;

  const [answerNumber, setAnswerNumber] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isShowCorrectAnswer, setIsShowCorrectAnswer] = useState(false);

  const handleAnswer = () => {
    setAnswered(true);
    let correctAnswerIndex = 0;
    answer.map((item, index) => {
      if (item === correctanswer) correctAnswerIndex = index;
    });
    const accuracy = correctAnswerIndex === answerNumber;
    // dispatchEvent(handleTest(studyId, accuracy));
  };

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <div>
      <div
        className="w-full sm:h-[80rem] relative"
        // onClick={() => navigate(`/lurny/feeds/${_id}`)}
      >
        <div className="h-full bg-white p-[6rem] rounded-[2rem] flex flex-col justify-center gap-[6rem] sm:gap-[2rem] items-start">
          <img
            src={BrainIcon}
            className="absolute sm:top-[4rem] sm:right-[4rem] w-[4rem] border-2 border-gray-300 hover:border-yellow-400 active:border-yellow-600 rounded-full"
          />
          {/* Question */}
          <p className="flex gap-4 text-black text-left text-[6rem] sm:text-[2.5rem] leading-[8.5rem] sm:leading-[3rem] font-semibold">
            <span>{question}</span>
          </p>

          <ToastContainer />

          <div className="w-full flex flex-col gap-[8rem] sm:gap-[2rem] items-start">
            {answer &&
              answer.length > 0 &&
              answer.map((translatedAnswer, index) => (
                // Answer
                <div
                  className={classNames(
                    "w-full flex justify-between items-center px-[8rem] sm:px-[1rem] py-[2rem] sm:py-[1rem] rounded-[0.5rem] text-left text-[4rem] sm:text-[1.8rem] leading-[7.5rem] sm:leading-[2.5rem] cursor-pointer border",
                    answered
                      ? answerNumber === index
                        ? correctanswer === answer[index]
                          ? "border-[#00AF4F]"
                          : "border-[#FF0000]"
                        : correctanswer === answer[index]
                        ? "border-[#00AF4F]"
                        : "border-none"
                      : answerNumber === index
                      ? "bg-[#b1b1b1]"
                      : "border-none"
                  )}
                  key={index}
                  onClick={() => !answered && setAnswerNumber(index)}
                >
                  <p className="flex flex-1 text-black">
                    <span className="mr-[2rem]">
                      {String.fromCharCode(index + 65)}.
                    </span>
                    <span className="text-left">{translatedAnswer}</span>
                  </p>
                  {answered && correctanswer === answer[index] && (
                    <IoIosInformationCircleOutline
                      data-tooltip-id="correct-answer"
                      onClick={() =>
                        setIsShowCorrectAnswer(!isShowCorrectAnswer)
                      }
                      className="text-[16rem] sm:text-[2.5rem] my-auto text-black"
                    />
                  )}
                  <Tooltip
                    id="correct-answer"
                    place="left"
                    content={explanation}
                    style={{
                      width: "300px",
                      textAlign: "justify",
                      backgroundColor: "#00B050",
                      color: "white",
                      borderRadius: "8px",
                      padding: "24px",
                      lineHeight: "20px",
                      fontSize: "16px",
                    }}
                  />
                </div>
              ))}
          </div>

          {!answered ? (
            <button
              onClick={handleAnswer}
              className="bg-[#FFC36D] hover:bg-[#ebb161] active:bg-[#f1b765] mx-auto mt-[4rem] text-[6rem] sm:text-[1.8rem] border-none focus:outline-none text-black"
            >
              {/* {translations[language].submitAnswer} */}
              Submit Answer
            </button>
          ) : (
            ""
          )}
        </div>

        {/* {currentQuestionNumber > 0 && (
          <button
            onClick={handlePreviousQuiz}
            className="hidden sm:flex items-center justify-center p-[0.5rem] sm:pl-2 text-white text-[12rem] sm:text-[3rem] bg-[#adadad] hover:bg-neutral-400 active:bg-neutral-500 rounded-full focus:outline-none absolute -left-[2rem] top-1/2 z-30"
          >
            <IoIosArrowBack />
          </button>
        )}
        {currentQuestionNumber < quiz.length && (
          <button
            onClick={handleNextQuiz}
            className="hidden sm:flex items-center justify-center p-[0.5rem] sm:pl-2 text-white text-[12rem] sm:text-[3rem] bg-[#adadad] hover:bg-neutral-400 active:bg-neutral-500 rounded-full focus:outline-none absolute -right-[2rem] top-1/2 z-30"
          >
            <IoIosArrowForward />
          </button>
        )} */}
      </div>
    </div>
  );
}

TestQuizItem.propTypes = {
  data: PropTypes.object,
  studyId: PropTypes.string,
};

export default TestQuizItem;
