import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Tooltip } from "react-tooltip";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { IoIosArrowBack } from "react-icons/io";
// import { IoIosArrowForward } from "react-icons/io";
import { IoIosInformationCircleOutline } from "react-icons/io";

import defaultImg from "../assets/images/Lurny/1.jpg";
// import pdfImage from "../assets/images/Lurny/pdf.png";

export default function MobileQuizItem({
  data,
  index,
  handleClick,
  currentQuizId,
  // language,
}) {
  const navigate = useNavigate();

  const { title, summary, quiz, image, url, user } = data;

  // const api_key = import.meta.env.VITE_CLOUD_TRANSLATE_API_KEY;

  const [summaryNumber, setSummaryNumber] = useState(0);

  const [content, setContent] = useState(0);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [answerNumber, setAnswerNumber] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isShowCorrectAnswer, setIsShowCorrectAnswer] = useState(false);

  const [imageUrl, setImageUrl] = useState(null);

  // const [translatedTitle, setTranslatedTitle] = useState("");
  // const [translatedSummary, setTranslatedSummary] = useState([]);
  // const [translatedQuestions, setTranslatedQuestions] = useState([]);
  // const [translatedAnswers, setTranslatedAnswers] = useState([]);
  // const [translatedUserName, setTranslatedUserName] = useState("");

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const [userData, setUserData] = useState(null);

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
  //     setCurrentQuestionNumber(0);
  //     setSummaryNumber(0);
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
    setAnswerNumber(null);
    setAnswered(false);
  }, [content, currentQuestionNumber]);

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
  //   } else if (image.slice(1, 4) === "url") {
  //     return pdfImage;
  //   } else return defaultImg;
  // };

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
      return defaultImg;
    }
    return `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;
  }

  const removePrefix = (sentence) => {
    return sentence.replace(/^[A-Z]\. /, " ");
  };
  // change quiz
  const handleNextQuiz = () => {
    if (currentQuestionNumber < quiz.length) {
      setCurrentQuestionNumber(currentQuestionNumber + 1);
    }
    setAnswered(false);
  };

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  const moveSliderLeft = () => {
    if (content === 0 && summaryNumber > 0) {
      setSummaryNumber(summaryNumber - 1);
    }
    if (content === 1 && currentQuestionNumber > 0 && answered) {
      setCurrentQuestionNumber(currentQuestionNumber - 1);
    }
  };

  const moveSliderRight = () => {
    if (content === 0 && summaryNumber < summary.length) {
      setSummaryNumber(summaryNumber + 1);
    }
    if (content === 1 && currentQuestionNumber < quiz.length - 1) {
      if (currentQuestionNumber === 0 || answered) {
        setCurrentQuestionNumber(currentQuestionNumber + 1);
      }
    }
  };

  // Handle touch start
  function handleTouchStart(e) {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }

  // Handle touch move
  function handleTouchMove(e) {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }

  // Handle touch end
  function handleTouchEnd() {
    if (!touchStart || !touchEnd) {
      return; // Avoid errors if touchStart or touchEnd are null
    }

    const diffX = touchStart.x - touchEnd.x;
    const diffY = touchStart.y - touchEnd.y;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (diffX > 100) {
        // Swipe left
        moveSliderRight();
      } else if (diffX < -100) {
        // Swipe right
        moveSliderLeft();
      }
    } else {
      // Vertical swipe
      if (diffY > 100) {
        // Swipe up
        handleClick(index + 1);
      } else if (diffY < -100) {
        // Swipe down
        handleClick(index - 1);
      }
    }

    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
  }

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
    <div className="w-full">
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        className="w-full"
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
        {content === 0 && (
          <div className="w-full h-[64vh] relative cursor-pointer">
            {userData && (
              <div className="flex flex-col w-full h-full justify-center items-center relative">
                <img
                  // src={imageUrl}
                  src={
                    userData.email === "bentan010918@gmail.com"
                      ? defaultImg
                      : imageUrl
                  }
                  alt={title}
                  className="w-full h-full object-cover rounded-[8rem]"
                />
                <div className="w-full h-full bg-[#404040] rounded-[8rem] absolute top-0 left-0 opacity-50"></div>
                {summaryNumber === 0 && (
                  <div className="w-full h-full absolute text-white bottom-0 left-0 bg-transparent flex flex-col justify-center sm:justify-end items-start gap-[8rem] p-[12rem] sm:p-[4rem]">
                    <div className="flex gap-[4rem] sm:gap-[1.5rem]">
                      <div>
                        <img
                          src={user.photoURL}
                          alt="User Avatar"
                          className="w-[32rem]  rounded-full sm:w-[4.5rem] border border-white-2"
                        />
                      </div>
                      <div className="flex flex-col justify-center items-start text-white">
                        <span className="font-bold text-[12rem]">
                          {user.fullName}
                        </span>
                      </div>
                    </div>

                    <span className="text-[#FFFF00] text-[10rem] leading-[12rem] sm:text-[2.5rem] sm:leading-[3rem] font-bold">
                      {summary.length} learning points
                    </span>
                    <h3 className="text-left text-white text-[18rem] sm:text-[3rem] leading-[18rem] sm:leading-[3.5rem] font-semibold cursor-pointer">
                      {/* {translatedTitle && translatedTitle} */}
                      {title}
                    </h3>
                  </div>
                )}
                {summary &&
                  summary.length > 0 &&
                  summary.map((bullet, index) => {
                    return (
                      summaryNumber === index + 1 && (
                        <div
                          key={index}
                          className={`w-5/6 h-3/4 bg-white/90 rounded-[8rem] text-zinc-700 font-bold flex flex-col items-center justify-center gap-[2rem] p-[8rem] absolute`}
                        >
                          <span className="text-[12rem]">
                            {index + 1} / {summary.length}
                          </span>
                          <p className="text-[10rem]">{removePrefix(bullet)}</p>
                        </div>
                      )
                    );
                  })}
              </div>
            )}
          </div>
        )}
        {content === 1 && (
          <div className="w-full h-[64vh] sm:h-[56rem] relative cursor-pointer">
            {currentQuestionNumber === 0 && (
              <div className="h-full relative">
                <img
                  // src={imageUrl}
                  src={
                    userData.email === "bentan010918@gmail.com"
                      ? defaultImg
                      : imageUrl
                  }
                  alt={title}
                  className="w-full h-full object-cover rounded-[8rem]"
                />
                <div className="w-full h-full bg-[#404040] rounded-[8rem] absolute top-0 left-0 opacity-50"></div>
                <div className="w-full h-full absolute text-white bottom-0 left-0 bg-transparent flex flex-col items-start justify-center gap-[8rem] p-[12rem] sm:p-[4rem]">
                  <div className="flex gap-[4rem] sm:gap-[1.5rem]">
                    <div>
                      <img
                        src={user.photoURL}
                        alt="User Avatar"
                        className=" rounded-full w-[32rem] sm:w-[4.5rem] border border-white-2"
                      />
                    </div>
                    <div className="flex flex-col justify-center items-start text-white">
                      <span className="font-bold text-[12rem] sm:text-[1.8rem] text-left">
                        {user.fullName}
                      </span>
                    </div>
                  </div>

                  <span className="text-[#FFFF00] text-[10rem] leading-[12rem] sm:text-[2.5rem] sm:leading-[3rem] font-bold">
                    {quiz.length} learning points
                  </span>
                  <h3 className="text-left text-white text-[18rem] sm:text-[3rem] leading-[18rem] sm:leading-[3.5rem] font-semibold cursor-pointer">
                    {/* {translatedTitle && translatedTitle} */}
                    {title}
                  </h3>
                </div>
              </div>
            )}

            {currentQuestionNumber > 0 && (
              <div className="h-full bg-white p-[12rem] rounded-[8rem] flex flex-col justify-center gap-[12rem] items-start">
                {/* Question */}
                <p className="text-black text-left text-[12rem] leading-[12rem] font-semibold">
                  Q{currentQuestionNumber}:{" "}
                  {quiz[currentQuestionNumber - 1].question}
                </p>

                <div className=" w-full flex flex-col gap-[8rem] items-start">
                  {quiz[currentQuestionNumber - 1].answer.map(
                    (translatedAnswer, index) =>
                      // Answer
                      translatedAnswer && (
                        <div
                          className={classNames(
                            "w-full flex justify-between items-center px-[8rem] sm:px-[2rem] py-[4rem] sm:py-[0.5rem] rounded-[4rem] text-left text-[8rem] leading-[8rem] cursor-pointer border",
                            answered
                              ? answerNumber === index
                                ? quiz[currentQuestionNumber - 1]
                                    .correctanswer ===
                                  quiz[currentQuestionNumber - 1].answer[index]
                                  ? "border-[#00AF4F]"
                                  : "border-[#FF0000]"
                                : quiz[currentQuestionNumber - 1]
                                    .correctanswer ===
                                  quiz[currentQuestionNumber - 1].answer[index]
                                ? "border-[#00AF4F]"
                                : "border-none"
                              : answerNumber === index
                              ? "bg-[#9c9c9c]"
                              : "border-none"
                          )}
                          key={index}
                          onClick={() => !answered && setAnswerNumber(index)}
                        >
                          <p className="flex flex-1 text-black gap-[4rem]">
                            <span className="mr-[4rem]">
                              {String.fromCharCode(index + 65)}.
                            </span>
                            <span className="text-left">
                              {removePrefix(translatedAnswer)}
                            </span>
                          </p>
                          {answered &&
                            quiz[currentQuestionNumber - 1].correctanswer ===
                              quiz[currentQuestionNumber - 1].answer[index] && (
                              <IoIosInformationCircleOutline
                                data-tooltip-id="correct-answer"
                                onClick={() =>
                                  setIsShowCorrectAnswer(!isShowCorrectAnswer)
                                }
                                className="text-[12rem] my-auto right-4 focus:outline-none"
                              />
                            )}
                          <div></div>
                          <Tooltip
                            id="correct-answer"
                            place="left"
                            content={
                              quiz[currentQuestionNumber - 1].explanation
                            }
                            style={{
                              width: "200px",
                              textAlign: "justify",
                              backgroundColor: "#00B050",
                              color: "white",
                              borderRadius: "8px",
                              padding: "24px",
                            }}
                          />
                        </div>
                      )
                  )}
                </div>
                {!answered ? (
                  <button
                    onClick={() => setAnswered(true)}
                    className="bg-[#FFC36D] mx-auto mt-[2rem] text-[8rem] border-none focus:outline-none active:bg-yellow-300 text-black"
                  >
                    {/* {translations[language].submitAnswer} */}SUBMIT ANSWER
                  </button>
                ) : (
                  currentQuestionNumber < quiz.length && (
                    <button
                      onClick={handleNextQuiz}
                      className="bg-[#FFC36D] mx-auto mt-[2rem] text-[8rem] border-none focus:outline-none active:bg-yellow-300 text-black"
                    >
                      {/* {translations[language].nextQuestion} */}NEXT QUIZ
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        )}
        {content === 2 && (
          <div className="w-full h-[64vh] sm:h-[56rem] relative cursor-pointer">
            {currentQuestionNumber === 0 && (
              <div className="h-full relative">
                <img
                  // src={imageUrl}
                  src={
                    userData.email === "bentan010918@gmail.com"
                      ? defaultImg
                      : imageUrl
                  }
                  alt={title}
                  className="w-full h-full object-cover rounded-[8rem]"
                />
                <div className="w-full h-full bg-[#404040] rounded-[8rem] absolute top-0 left-0 opacity-50"></div>
                <div className="w-full h-full absolute text-white bottom-0 left-0 bg-transparent flex flex-col items-start justify-center gap-[8rem] p-[12rem] sm:p-[4rem]">
                  <div className="flex gap-[4rem] sm:gap-[1.5rem]">
                    <div>
                      <img
                        src={user.photoURL}
                        alt="User Avatar"
                        className=" rounded-full w-[32rem] sm:w-[4.5rem] border border-white-2"
                      />
                    </div>
                    <div className="flex flex-col justify-center items-start text-white">
                      <span className="font-bold text-[12rem] sm:text-[1.8rem] text-left">
                        {/* {translatedUserName} */}
                        {user.fullName}
                      </span>
                    </div>
                  </div>

                  <span className="text-[#FFFF00] text-[10rem] leading-[12rem] sm:text-[2.5rem] sm:leading-[3rem] font-bold">
                    {summary.length} Multiple Choice Quiz
                  </span>
                  <h3 className="text-left text-white text-[18rem] sm:text-[3rem] leading-[18rem] sm:leading-[3.5rem] font-semibold cursor-pointer">
                    {/* {translatedTitle && translatedTitle} */}
                    {title}
                  </h3>
                </div>
              </div>
            )}

            {currentQuestionNumber > 0 && (
              <div className="h-full bg-white p-[12rem] rounded-[8rem] flex flex-col justify-center gap-[6rem] sm:gap-[2rem] items-start">
                {/* Question */}
                <p className="text-black text-left text-[12rem] leading-[12rem] font-semibold">
                  Q{currentQuestionNumber + 1}:{" "}
                  {quiz[currentQuestionNumber].question}
                </p>

                <div className="w-full flex flex-col gap-[4rem] items-start">
                  {quiz[currentQuestionNumber].answer.map(
                    (translatedAnswer, index) => (
                      // Answer
                      <div
                        className={classNames(
                          "w-full flex justify-between items-center px-[8rem] sm:px-[2rem] py-[4rem] sm:py-[0.5rem] rounded-[4rem] text-left text-[8rem] leading-[8rem] cursor-pointer border",
                          answered
                            ? answerNumber === index
                              ? quiz[currentQuestionNumber].correctanswer ===
                                quiz[currentQuestionNumber].answer[index]
                                ? "border-[#00AF4F]"
                                : "border-[#FF0000]"
                              : quiz[currentQuestionNumber].correctanswer ===
                                quiz[currentQuestionNumber].answer[index]
                              ? "border-[#00AF4F]"
                              : "border-none"
                            : answerNumber === index
                            ? "bg-[#9c9c9c]"
                            : "border-none"
                        )}
                        key={index}
                        onClick={() => !answered && setAnswerNumber(index)}
                      >
                        <p className="flex flex-1">
                          <span className="mr-[4rem]">
                            {String.fromCharCode(index + 65)}
                          </span>
                          <span className="text-left">{translatedAnswer}</span>
                        </p>
                        {answered &&
                          quiz[currentQuestionNumber].correctanswer ===
                            quiz[currentQuestionNumber].answer[index] && (
                            <IoIosInformationCircleOutline
                              data-tooltip-id="correct-answer"
                              onClick={() =>
                                setIsShowCorrectAnswer(!isShowCorrectAnswer)
                              }
                              className="text-[12rem] my-auto right-4 focus:outline-none"
                            />
                          )}
                        <div></div>
                        <Tooltip
                          id="correct-answer"
                          place="left"
                          content={quiz[currentQuestionNumber].explanation}
                          style={{
                            width: "200px",
                            textAlign: "justify",
                            backgroundColor: "#00B050",
                            color: "white",
                            borderRadius: "8px",
                            padding: "24px",
                          }}
                        />
                      </div>
                    )
                  )}
                </div>
                {!answered ? (
                  <button
                    onClick={() => setAnswered(true)}
                    className="bg-[#FFC36D] mx-auto mt-[2rem] text-[8rem] border-none focus:outline-none active:bg-yellow-300 text-black"
                  >
                    {/* {translations[language].submitAnswer} */}SUBMIT ANSWER
                  </button>
                ) : currentQuestionNumber < quiz.length - 1 ? (
                  <button
                    onClick={handleNextQuiz}
                    className="bg-[#FFC36D] mx-auto mt-[2rem] text-[8rem] border-none focus:outline-none active:bg-yellow-300 text-black"
                  >
                    {/* {translations[language].nextQuestion} */}NEXT QUIZ
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/lurny/profile")}
                    className="bg-[#FFC36D] mx-auto mt-[2rem] text-[8rem] border-none focus:outline-none active:bg-yellow-300 text-black"
                  >
                    {/* {translations[language].goToHome} */}GO TO HOME
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-[2rem] text-white text-[8rem] my-[12rem]">
        <span
          onClick={() => setContent(0)}
          className={`${
            content !== 0 ? "border-2" : "bg-yellow-500"
          } border-white p-[2rem] flex justify-center flex-1 items-center`}
        >
          Stubs
        </span>
        <span
          onClick={() => setContent(1)}
          className={`${
            content !== 1 ? "border-2" : "bg-yellow-500"
          } border-white p-[2rem] flex justify-center flex-1 items-center after:bg-yellow-500 after:border-none`}
        >
          Quizzify!
        </span>
        <span
          onClick={() => setContent(2)}
          className={`${
            content !== 2 ? "border-2" : "bg-yellow-500"
          } border-white p-[2rem] leading-[10rem] flex justify-center flex-1 items-center`}
        >
          Remember this!
        </span>
      </div>
    </div>
  );
}

MobileQuizItem.propTypes = {
  data: PropTypes.object,
  index: PropTypes.number,
  currentQuizId: PropTypes.string,
  handleClick: PropTypes.func,
  language: PropTypes.string,
};
