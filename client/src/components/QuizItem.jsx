import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Tooltip } from "react-tooltip";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";

import defaultImg from "../assets/images/Lurny/default.png";
import ROSIIcon from "../assets/icons/ROSI_icon.png";

import { handleDeleteStubOrQuiz } from "../actions/lurny";
import { handleRemember } from "../actions/study";

export default function QuizItem({
  data,
  index,
  content,
  handleClick,
  currentQuizId,
  // language,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { _id, title, summary, quiz, image, url, user } = data;

  // const api_key = import.meta.env.VITE_CLOUD_TRANSLATE_API_KEY;
  const [summaryNumber, setSummaryNumber] = useState(0);

  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [answerNumber, setAnswerNumber] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isShowCorrectAnswer, setIsShowCorrectAnswer] = useState(false);

  const [openRememberModal, setOpenRememberModal] = useState(false);

  // const [translatedTitle, setTranslatedTitle] = useState("");
  // const [translatedSummary, setTranslatedSummary] = useState([]);
  // const [translatedQuestions, setTranslatedQuestions] = useState([]);
  // const [translatedAnswers, setTranslatedAnswers] = useState([]);
  // const [translatedUserName, setTranslatedUserName] = useState("");

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const [userData, setUserData] = useState(null);

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      setUserData(jwtDecode(accessToken));
    }
  }, []);

  useEffect(() => {
    setSummaryNumber(0);
    setCurrentQuestionNumber(0);
  }, [currentQuizId]);

  // Translate
  // useEffect(() => {
  //   if (data) {
  //     if (language === "en") {
  //       setTranslatedSummary(summary);
  //       setTranslatedTitle(title);
  //       setTranslatedQuestions(quiz.map((q) => q.question));
  //       setTranslatedAnswers(
  //         quiz.map((q) => ({ ...q, answer: q.answer.slice() }))
  //       );
  //       setTranslatedUserName(user.displayName);
  //     } else {
  //       if (currentQuizId === data._id) translateContent();
  //     }
  //   }
  // }, [language, data]);

  useEffect(() => {
    setSummaryNumber(0);
    setCurrentQuestionNumber(0);
  }, [content]);

  useEffect(() => {
    setAnswerNumber(null);
    setAnswered(false);
  }, [currentQuestionNumber]);

  // const translateContent = async () => {
  //   try {
  //     const translatedUserName = await translateText(
  //       user.displayName,
  //       "en",
  //       language
  //     );
  //     const summaryPromises = summary.map((text) =>
  //       translateText(text, "en", language)
  //     );
  //     const summaryTranslations = await Promise.all(summaryPromises);
  //     const translatedTitle = await translateText(title, "en", language);

  //     const questionPromises = quiz.map((item) =>
  //       translateText(item.question, "en", language)
  //     );
  //     const questionTranslations = await Promise.all(questionPromises);

  //     const answerPromises = quiz.flatMap((item) =>
  //       item.answer.map((answer) => translateText(answer, "en", language))
  //     );

  //     const explanationPromises = quiz.map((item) =>
  //       translateText(item.explanation, "en", language)
  //     );
  //     const explanationTranslations = await Promise.all(explanationPromises);

  //     const answerTranslations = await Promise.all(answerPromises);
  //     let groupedAnswers = [],
  //       i = 0;
  //     quiz.forEach((qItem, index) => {
  //       let answersForQuestion = answerTranslations.slice(
  //         i,
  //         i + qItem.answer.length
  //       );
  //       groupedAnswers.push({
  //         ...qItem,
  //         answer: answersForQuestion,
  //         explanation: explanationTranslations[index],
  //       });
  //       i += qItem.answer.length;
  //     });

  //     setTranslatedUserName(translatedUserName);
  //     setTranslatedSummary(summaryTranslations);
  //     setTranslatedTitle(translatedTitle);
  //     setTranslatedQuestions(questionTranslations);
  //     setTranslatedAnswers(groupedAnswers);
  //   } catch (error) {
  //     console.error("Translation error:", error);
  //     // Handle error, e.g., show notification
  //   }
  // };

  // const translateText = async (text, sourceLang, targetLang) => {
  //   const endpoint = "https://translation.googleapis.com/language/translate/v2";

  //   try {
  //     const response = await fetch(`${endpoint}?key=${api_key}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         q: text,
  //         source: sourceLang,
  //         target: targetLang,
  //         format: "text",
  //       }),
  //     });

  //     const result = await response.json();

  //     // Log the full API response for debugging purposes
  //     console.log("result", result);

  //     // Check if the translations array exists
  //     if (result.data && Array.isArray(result.data.translations)) {
  //       return result.data.translations[0].translatedText;
  //     } else {
  //       // If the translations array does not exist, log the error and throw an exception
  //       console.error("Translations array is missing in the response:", result);
  //       throw new Error("Translations array is missing in the response");
  //     }
  //   } catch (error) {
  //     // Handle any errors that occur during the fetch operation
  //     console.error("Error during translation:", error);
  //     throw error; // Rethrow the error so you can handle it where translateText is called
  //   }
  // };

  // Set image url

  const isYoutubeUrl = (url) => {
    if (url) {
      return url.includes("youtube.com") || url.includes("youtu.be");
    } else {
      return false;
    }
  };

  // const getDefaultImg = (image, url) => {
  //   if (isYoutubeUrl(url)) {
  //     return getThumbnailURLFromVideoURL(url);
  //   } else if (image) {
  //     return image ? image : defaultImg;
  //   } else {
  //     return defaultImg;
  //   }
  // };

  useEffect(() => {
    if (isYoutubeUrl(url)) {
      setImageUrl(getThumbnailURLFromVideoURL(url));
    } else if (image) {
      const img = new Image();

      img.onload = () => {
        setImageUrl(image);
      };
      img.onerror = () => {
        setImageUrl(defaultImg);
      };

      img.src = image;
    } else {
      setImageUrl(defaultImg);
    }
  }, [image, url]);

  function getYoutubeVideoID(url) {
    const regExp =
      // eslint-disable-next-line no-useless-escape
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  function getThumbnailURLFromVideoURL(videoURL) {
    const videoID = getYoutubeVideoID(videoURL);
    if (!videoID) {
      // throw new Error("Invalid YouTube URL");
      return defaultImg;
    }
    return `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;
  }

  // const newImg = getDefaultImg(image, url);

  // change summary
  const handlePrevious = () => {
    if (summaryNumber > 0) {
      handleClick(index);
      setSummaryNumber(summaryNumber - 1);
    }
  };

  const handleNext = () => {
    if (summaryNumber < summary.length) {
      handleClick(index);
      setSummaryNumber(summaryNumber + 1);
    }
  };

  // change quiz
  const handleNextQuiz = () => {
    if (currentQuizId === data._id) {
      if (currentQuestionNumber < quiz.length) {
        setCurrentQuestionNumber(currentQuestionNumber + 1);
      }
      setAnswered(false);
    }
  };

  const handlePreviousQuiz = () => {
    if (currentQuizId === data._id) {
      if (currentQuestionNumber > 0) {
        setCurrentQuestionNumber(currentQuestionNumber - 1);
      }
      setAnswered(false);
    }
  };

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  const moveSliderLeft = () => {
    if (currentQuizId === data._id) {
      if (content === 0 && summaryNumber === 0) {
        alert("This bullet is the first.");
      } else {
        setSummaryNumber(summaryNumber - 1);
      }
    }
  };

  const moveSliderRight = () => {
    if (currentQuizId === data._id) {
      if (content === 0 && summaryNumber < summary.length - 1) {
        setSummaryNumber(summaryNumber + 1);
      } else {
        alert("This lurny is the end.");
      }
    }
  };

  function handleTouchStart(e) {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }

  function handleTouchMove(e) {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }

  function handleTouchEnd() {
    if (touchStart.x - touchEnd.x > 150) {
      moveSliderRight();
    }

    if (touchStart.x - touchEnd.y < -150) {
      moveSliderLeft();
    }
  }

  const handleDelete = (type, number) => {
    dispatch(handleDeleteStubOrQuiz(type, number));
  };

  const onClickRemember = (user_id, lurny_id, type, number) => {
    dispatch(handleRemember(user_id, lurny_id, type, number));
    setOpenRememberModal(true);
  };

  const handleClickModal = (e) => {
    if (e.target.id === "remember-modal") {
      setOpenRememberModal(false);
    }
  };

  const handleGotoROSISetting = () => {
    navigate("/#");
  };

  const handleGotoSavedLurnies = () => {
    navigate("/lurny/saved");
  };

  // const translations = {
  //   en: {
  //     nextQuestion: "Next Question",
  //     goToHome: "Go to Home",
  //     submitAnswer: "Submit Answer",
  //     learningPoints: "learning points",
  //   },
  //   hi: {
  //     nextQuestion: "अगला प्रश्न",
  //     goToHome: "मुखपृष्ठ पर जाएं",
  //     submitAnswer: "उत्तर सबमिट करें",
  //     learningPoints: "सीखने के अंक",
  //   },
  //   bn: {
  //     nextQuestion: "পরবর্তী প্রশ্ন",
  //     goToHome: "হোমে যান",
  //     submitAnswer: "উত্তর জমা দিন",
  //     learningPoints: "শেখার পয়েন্ট",
  //   },
  //   te: {
  //     nextQuestion: "తదుపరి ప్రశ్న",
  //     goToHome: "హోమ్‌కి వెళ్లు",
  //     submitAnswer: "జవాబు సమర్పించండి",
  //     learningPoints: "నేర్చుకునే పాయింట్లు",
  //   },
  //   mr: {
  //     nextQuestion: "पुढील प्रश्न",
  //     goToHome: "होमकडे जा",
  //     submitAnswer: "उत्तर सबमिट करा",
  //     learningPoints: "शिकण्याचे गुण",
  //   },
  //   ta: {
  //     nextQuestion: "அடுத்த கேள்வி",
  //     goToHome: "முகப்புக்கு செல்",
  //     submitAnswer: "பதில் சமர்ப்பி",
  //     learningPoints: "கற்றல் புள்ளிகள்",
  //   },
  //   gu: {
  //     nextQuestion: "આગલો પ્રશ્ન",
  //     goToHome: "હોમ પર જાઓ",
  //     submitAnswer: "જવાબ સબમિટ કરો",
  //     learningPoints: "શીખવાના પોઈંટ્સ",
  //   },
  //   ur: {
  //     nextQuestion: "اگلا سوال",
  //     goToHome: "ہوم جائیں",
  //     submitAnswer: "جواب جمع کرائیں",
  //     learningPoints: "سیکھنے کے پوائنٹس",
  //   },
  //   pa: {
  //     nextQuestion: "ਅਗਲਾ ਸਵਾਲ",
  //     goToHome: "ਘਰ ਜਾਓ",
  //     submitAnswer: "ਜਵਾਬ ਜਮਾਂ ਕਰੋ",
  //     learningPoints: "ਸਿੱਖਣ ਦੇ ਅੰਕ",
  //   },
  //   kn: {
  //     nextQuestion: "ಮುಂದಿನ ಪ್ರಶ್ನೆ",
  //     goToHome: "ಹೋಮ್‌ಗೆ ಹೋಗಿ",
  //     submitAnswer: "ಉತ್ತರ ಸಲ್ಲಿಸಿ",
  //     learningPoints: "ಕಲಿಕೆ ಅಂಕಗಳು",
  //   },
  //   ml: {
  //     nextQuestion: "അടുത്ത ചോദ്യം",
  //     goToHome: "ഹോം പേജിലേക്ക് പോകുക",
  //     submitAnswer: "ഉത്തരം സമർപ്പിക്കുക",
  //     learningPoints: "പഠന പോയിന്റുകൾ",
  //   },
  //   or: {
  //     nextQuestion: "ପରବର୍ତ୍ତୀ ପ୍ରଶ୍ନ",
  //     goToHome: "ଘରେ ଯାଅ",
  //     submitAnswer: "ଉତ୍ତର ଦାଖଲ କର",
  //     learningPoints: "ଶିକ୍ଷା ପାଇନ୍ଟ",
  //   },
  //   as: {
  //     nextQuestion: "পৰৱৰ্তী প্ৰশ্ন",
  //     goToHome: "হোম লৈ যাওক",
  //     submitAnswer: "উত্তৰ দাখিল কৰক",
  //     learningPoints: "শিক্ষা পইণ্ট",
  //   },
  // };

  return (
    <div
      className=""
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {content === 0 && (
        <div
          className="w-full h-[72vh] sm:h-[80rem] relative cursor-pointer sm:cursor-default"
          onClick={() => navigate(`/lurny/feeds/${_id}`)}
        >
          {summaryNumber === 0 && userData && (
            <div className="h-full flex flex-col justify-start relative animate__animated animate__flipInY">
              <img
                // src={imageUrl}
                src={
                  userData.email === "bentan010918@gmail.com"
                    ? defaultImg
                    : imageUrl
                }
                alt={title}
                className="w-full h-full object-cover rounded-[8rem] sm:rounded-[2rem]"
              />
              <div className="w-full h-full bg-[#404040] rounded-[8rem] sm:rounded-[2rem] absolute top-0 left-0 opacity-50"></div>
              <div className="w-full absolute text-white bottom-0 left-0 bg-transparent flex flex-col justify-center sm:justify-end items-start gap-[8rem] sm:gap-[2rem] p-[12rem] sm:p-[4rem]">
                <div className="flex gap-[4rem] sm:gap-[1.5rem]">
                  <div>
                    <img
                      src={user.photoURL}
                      alt="User Avatar"
                      className=" rounded-full w-[32rem] sm:w-[4.5rem] border border-white-2"
                    />
                  </div>
                  <div className="flex flex-col justify-center items-start text-white">
                    <span className="font-bold text-[12rem] sm:text-[1.8rem]">
                      {user.displayName}
                    </span>
                  </div>
                </div>

                <span className="text-[#FFFF00] text-[10rem] leading-[12rem] sm:text-[2.5rem] sm:leading-[3rem] font-bold">
                  {summary.length} learning points
                </span>
                <h3 className="text-left text-white text-[18rem] sm:text-[3rem] leading-[16rem] sm:leading-[3.5rem] font-semibold cursor-pointer">
                  {title}
                </h3>
              </div>
            </div>
          )}
          {summary &&
            summary.length > 0 &&
            summary.map((bullet, index) => {
              return (
                summaryNumber === index + 1 && (
                  <div
                    key={index}
                    className={`relative w-full h-full bg-white rounded-2xl text-[8rem] sm:text-[2.5rem] text-[#404040] font-bold flex flex-col items-center justify-center gap-[2rem] p-[8rem] ${
                      summaryNumber === 1
                        ? "animate__animated animate__flipInY"
                        : "animate__animated animate__fadeIn"
                    } `}
                  >
                    <span className="font-bold  text-[10rem] sm:text-[3rem]">
                      {index + 1} / {summary.length}
                    </span>
                    <p>{bullet}</p>
                    <div className="absolute flex gap-[2rem] sm:bottom-[4rem] sm:right-[4rem]">
                      {userData.id === user._id && (
                        <div
                          onClick={() => handleDelete("stub", summaryNumber)}
                          data-data-tooltip-id="delete-stub"
                          className="border-2 border-gray-300 hover:border-yellow-400 active:border-yellow-600 rounded-full w-[4rem] flex justify-center items-center cursor-pointer"
                        >
                          <IoTrashOutline className="bg-yellow-400 rounded-full p-1 box-content" />
                        </div>
                      )}
                      <img
                        src={ROSIIcon}
                        data-tooltip-id="remember-stub"
                        onClick={() =>
                          onClickRemember(
                            userData.id,
                            _id,
                            "stub",
                            summaryNumber
                          )
                        }
                        className="w-[4rem] border-2 border-gray-300 hover:border-yellow-400 active:border-yellow-600 rounded-full hover:transform hover:scale-105 cursor-pointer"
                      />
                      <Tooltip
                        id="remember-stub"
                        place="top"
                        content="Save Stub"
                        style={{
                          width: "80px",
                          textAlign: "center",
                          backgroundColor: "#facc15",
                          color: "black",
                          borderRadius: "4px",
                          padding: "6px",
                          lineHeight: "12px",
                          fontSize: "12px",
                        }}
                      />
                      <Tooltip
                        id="delete-stub"
                        place="top"
                        content="Delete Stub"
                        style={{
                          width: "80px",
                          textAlign: "center",
                          backgroundColor: "#facc15",
                          color: "black",
                          borderRadius: "4px",
                          padding: "6px",
                          lineHeight: "12px",
                          fontSize: "12px",
                        }}
                      />
                    </div>
                  </div>
                )
              );
            })}

          {summaryNumber > 0 && (
            <button
              onClick={handlePrevious}
              className="hidden sm:flex items-center justify-center p-[0.5rem] sm:pl-2 text-white text-[12rem] sm:text-[3rem] bg-[#adadad] hover:bg-neutral-400 active:bg-neutral-500 rounded-full focus:outline-none absolute -left-[2rem] top-1/2 z-30"
            >
              <IoIosArrowBack />
            </button>
          )}
          {summaryNumber < summary.length && (
            <button
              onClick={handleNext}
              className="hidden sm:flex items-center justify-center p-[0.5rem] sm:pl-2 text-white text-[12rem] sm:text-[3rem] bg-[#adadad] hover:bg-neutral-400 active:bg-neutral-500 rounded-full focus:outline-none absolute -right-[2rem] top-1/2 z-30"
            >
              <IoIosArrowForward />
            </button>
          )}
        </div>
      )}

      {content === 1 && (
        <div
          className="w-full sm:h-[80rem] relative cursor-pointer"
          onClick={() => navigate(`/lurny/feeds/${_id}`)}
        >
          {currentQuestionNumber === 0 && (
            <div className="h-full relative animate__animated animate__flipInY">
              {userData && (
                <img
                  // src={imageUrl}
                  src={
                    userData.email === "bentan010918@gmail.com"
                      ? defaultImg
                      : imageUrl
                  }
                  alt={title}
                  className="w-full h-full object-cover rounded-2xl"
                />
              )}
              <div className="w-full h-full bg-[#404040] rounded-2xl absolute top-0 left-0 opacity-50"></div>
              <div className="w-full absolute text-white bottom-0 left-0 bg-transparent flex flex-col items-start gap-[1rem] p-[4rem]">
                <div className="flex gap-[1.5rem]">
                  <div>
                    <img
                      src={user.photoURL}
                      alt="User Avatar"
                      className=" rounded-full w-[4.5rem] border border-white-2"
                    />
                  </div>
                  <div className="flex flex-col justify-center items-start text-white">
                    <span className="font-bold text-[1.8rem]">
                      {user.displayName}
                    </span>
                  </div>
                </div>

                <span className="text-[#FFFF00] text-[2.5rem] font-bold">
                  {quiz.length} Multiple Choice Questions
                </span>
                <h3 className="text-left text-white text-[3rem] leading-[3.5rem] font-semibold cursor-pointer">
                  {title}
                </h3>
              </div>
            </div>
          )}

          {currentQuestionNumber > 0 && (
            <div className="h-full bg-white p-[6rem] rounded-[2rem] flex flex-col justify-center gap-[6rem] sm:gap-[2rem] items-start">
              {/* Question */}
              <p className="flex gap-4 text-black text-left text-[6rem] sm:text-[2.5rem] leading-[8.5rem] sm:leading-[3rem] font-semibold">
                <span>Q{currentQuestionNumber}:</span>
                <span>{quiz[currentQuestionNumber - 1].question}</span>
              </p>

              <ToastContainer />

              <div className="w-full flex flex-col gap-[8rem] sm:gap-[2rem] items-start">
                {quiz[currentQuestionNumber - 1].answer.map(
                  (translatedAnswer, index) => (
                    // Answer
                    <div
                      className={classNames(
                        "w-full flex justify-between items-center px-[8rem] sm:px-[1rem] py-[2rem] sm:py-[1rem] rounded-[0.5rem] text-left text-[4rem] sm:text-[1.8rem] leading-[7.5rem] sm:leading-[2.5rem] cursor-pointer border",
                        answered
                          ? answerNumber === index
                            ? quiz[currentQuestionNumber - 1].correctanswer ===
                              quiz[currentQuestionNumber - 1].answer[index]
                              ? "border-[#00AF4F]"
                              : "border-[#FF0000]"
                            : quiz[currentQuestionNumber - 1].correctanswer ===
                              quiz[currentQuestionNumber - 1].answer[index]
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
                      {answered &&
                        quiz[currentQuestionNumber - 1].correctanswer ===
                          quiz[currentQuestionNumber - 1].answer[index] && (
                          <IoIosInformationCircleOutline
                            id="correct-answer"
                            onClick={() =>
                              setIsShowCorrectAnswer(!isShowCorrectAnswer)
                            }
                            className="text-[16rem] sm:text-[2.5rem] my-auto text-black"
                          />
                        )}
                      <Tooltip
                        id="correct-answer"
                        place="left"
                        content={quiz[currentQuestionNumber - 1].explanation}
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
                  )
                )}
              </div>

              {!answered ? (
                <button
                  onClick={() => setAnswered(true)}
                  className="bg-[#FFC36D] hover:bg-[#ebb161] active:bg-[#f1b765] mx-auto mt-[2rem] text-[6rem] sm:text-[1.8rem] border-none focus:outline-none text-black"
                >
                  {/* {translations[language].submitAnswer} */}
                  Submit Answer
                </button>
              ) : (
                currentQuestionNumber < quiz.length && (
                  <button
                    onClick={handleNextQuiz}
                    className="bg-[#FFC36D] hover:bg-[#ebb161] active:bg-[#f1b765] mx-auto mt-[2rem] text-[6rem] sm:text-[1.8rem] border-none focus:outline-none text-black"
                  >
                    {/* {translations[language].nextQuestion} */}
                    Next Question
                  </button>
                )
              )}

              {/* Remember button */}
              <div className="absolute flex gap-[2rem] sm:bottom-[4rem] sm:right-[4rem]">
                {userData.id === user._id && (
                  <div
                    onClick={() => handleDelete("quiz", currentQuestionNumber)}
                    data-tooltip-id="delete-quiz"
                    className="border-2 border-gray-300 hover:border-yellow-400 active:border-yello userData.id w-600 rounded-full w-[4rem] flex justify-center items-center cursor-pointer"
                  >
                    <IoTrashOutline className="bg-yellow-400 rounded-full p-1 box-content text-[2.5rem]" />
                  </div>
                )}
                <img
                  src={ROSIIcon}
                  data-tooltip-id="remember-quiz"
                  onClick={() =>
                    onClickRemember(
                      userData.id,
                      _id,
                      "quiz",
                      currentQuestionNumber
                    )
                  }
                  className="w-[4rem] border-2 border-gray-300 hover:border-yellow-400 active:border-yellow-600 rounded-full hover:transform hover:scale-105 cursor-pointer"
                />
                <Tooltip
                  id="remember-quiz"
                  place="top"
                  content="Save Quiz"
                  style={{
                    width: "80px",
                    textAlign: "center",
                    backgroundColor: "#facc15",
                    color: "black",
                    borderRadius: "4px",
                    padding: "6px",
                    lineHeight: "12px",
                    fontSize: "12px",
                  }}
                />
                <Tooltip
                  id="delete-quiz"
                  place="top"
                  content="Delete Quiz"
                  style={{
                    width: "80px",
                    textAlign: "center",
                    backgroundColor: "#facc15",
                    color: "black",
                    borderRadius: "4px",
                    padding: "6px",
                    lineHeight: "12px",
                    fontSize: "12px",
                  }}
                />
              </div>
            </div>
          )}

          {currentQuestionNumber > 0 && (
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
          )}
        </div>
      )}

      {/* Remember Modal */}
      {openRememberModal && (
        <div
          className="w-full h-full bg-black/20 fixed flex items-center justify-center top-0 left-0 z-50"
          id="remember-modal"
          onClick={handleClickModal}
        >
          <div className="w-[80rem] p-[4rem] bg-[#404040] rounded-[1rem] flex flex-col items-center gap-[4rem] text-white text-[2rem]">
            <span className="">
              This Lurny is now saved in your Saved Lurnies folder for
              Repetition over Optimally Spaced Intervals (ROSI)
            </span>
            <div className="flex items-center justify-center gap-[4rem]">
              <button
                onClick={handleGotoSavedLurnies}
                className="bg-[#7F51BA] hover:bg-[#583685] focus:outline-none"
              >
                Go to Saved Lurnies
              </button>
              <button
                onClick={handleGotoROSISetting}
                className="bg-[#7F51BA] hover:bg-[#583685] focus:outline-none"
              >
                Go to ROSI Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

QuizItem.propTypes = {
  data: PropTypes.object,
  index: PropTypes.number,
  content: PropTypes.number,
  currentQuizId: PropTypes.string,
  handleClick: PropTypes.func,
  // language: PropTypes.string,
};
