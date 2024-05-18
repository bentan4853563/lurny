import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch } from "react-redux";

import { PiUserGear } from "react-icons/pi";
import { RiRepeatLine } from "react-icons/ri";
import { TbBellRinging } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";

import UserPan from "../components/UserPan";
import Header from "../components/Header";
import { changeROSI } from "../actions/auth";
import getSchedule from "../utils/reminder";

const LurnySetting = () => {
  const dispatch = useDispatch();

  const [userDetails, setUserDetails] = useState(null);
  // const [showSidePan, setShowSidePan] = useState(false);
  const [section, setSection] = useState("rosi");
  const [repeatTime, setRepeatTime] = useState("");
  const [period, setPeriod] = useState("");
  const [showSidePan, setShowSidePan] = useState(false);

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      setUserDetails(jwtDecode(accessToken));
    }
  }, []);

  useEffect(() => {
    if (userDetails) {
      if (userDetails.repeatTimes) setRepeatTime(userDetails.repeatTimes);
      if (userDetails.period) setPeriod(userDetails.period);
    }
  }, [userDetails]);

  useEffect(() => {
    setIsChanged(
      userDetails &&
        (userDetails.repeatTimes !== Number(repeatTime) ||
          userDetails.period !== Number(period))
    );
  }, [repeatTime, period, userDetails]);

  const handleSaveROSI = () => {
    const repeatTimeNumber = Number(repeatTime);
    const periodNumber = Number(period);
    if (repeatTime === "" || period === "") {
      toast.warning("Repeat Time and Period must not be empty.", {
        position: "top-right",
      });
      return; // Prevents further execution
    }
    if (repeatTimeNumber < 8 || repeatTimeNumber > 15) {
      toast.warning("Repeat Time must be between 8 and 15.", {
        position: "top-right",
      });
      return; // Prevents further execution
    }
    if (periodNumber <= 40) {
      toast.warning("Period must be greater than 40 days.", {
        position: "top-right",
      });
      return; // Prevents further execution
    }

    dispatch(changeROSI(userDetails.id, repeatTime, period));
    setIsChanged(false);
  };

  console.log("userDetails :>> ", userDetails);

  return (
    <div className="min-w-[100vw] min-h-[100vh] font-raleway">
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
      <div className="w-full bg-[#262626] flex flex-1 justify-between px-[12rem] py-[18rem] sm:py-[6rem] relative">
        {/* Toggle button for mobile */}
        <div
          onClick={() => setShowSidePan(!showSidePan)}
          className="h-full bg-transparent sm:hidden fixed bottom-0 left-0 flex items-center z-50"
        >
          <IoIosArrowForward
            className={`text-[12rem] text-white hover:translate-x-[2rem] hover:duration-300 ${
              showSidePan
                ? "rotate-180 hover:translate-x-[-2rem] hover:duration-300"
                : ""
            }`}
          />
        </div>

        {/* UserPan is hidden on small screens initially */}
        <div
          className={`${showSidePan ? "absolute" : "hidden"} sm:flex h-full`}
        >
          <UserPan />
        </div>

        {/* My Lurnies */}
        <div className="w-full sm:pl-[12rem]">
          <h3 className="text-white text-start text-[12rem] sm:text-[2.5rem] font-semibold">
            Settings
          </h3>
          <div className="flex flex-wrap mt-[4rem]">
            {/* Settings Group */}
            <div className="w-full sm:w-[20rem] px-[4rem] flex sm:flex-col gap-[8rem] sm:gap-[2rem] text-white text-[8rem] sm:text-[2rem]">
              <div
                onClick={() => setSection("account")}
                className={`flex flex-1 items-center justify-center gap-[2rem] cursor-pointer rounded-[0.5rem] px-[4rem] sm:px-[1rem] py-[1rem] sm:py-[0.5rem] ${
                  section === "account" ? "bg-[#404040]" : ""
                }`}
              >
                <PiUserGear /> <span>Account</span>
              </div>
              <div
                onClick={() => setSection("rosi")}
                className={`flex flex-1 items-center justify-center gap-[2rem] cursor-pointer rounded-[0.5rem] px-[4rem] sm:px-[1rem] py-[1rem] sm:py-[0.5rem] ${
                  section === "rosi" ? "bg-[#404040]" : ""
                }`}
              >
                <RiRepeatLine /> <span>ROSI</span>
              </div>
              <div
                onClick={() => setSection("notification")}
                className={`flex flex-1 items-center justify-center gap-[2rem] cursor-pointer rounded-[0.5rem] px-[4rem] sm:px-[1rem] py-[1rem] sm:py-[0.5rem] ${
                  section === "notification" ? "bg-[#404040]" : ""
                }`}
              >
                <TbBellRinging /> <span>Notification</span>
              </div>
            </div>

            {/* ROSI Setting */}
            <div
              className={`flex-col gap-[4rem] text-white px-[8rem] mt-[12rem] sm:mt-0 ${
                section === "rosi" ? "flex" : "hidden"
              }`}
            >
              <span className="text-bold text-start text-[8rem] sm:text-[2rem]">
                Repetition over Optimally Spaced Intervals (ROSI)
              </span>
              <div className="flex justify-between items-center gap-[2rem] text-[6rem] sm:text-[1.5rem]">
                <span className="w-[48rem] flex-1 text-start">
                  Number of Repetitions (Min 8, Max 15)
                </span>
                <div className="w-1/4 flex items-center justify-between">
                  <input
                    type="number"
                    min={8}
                    max={15}
                    value={repeatTime}
                    onChange={(e) => setRepeatTime(e.target.value)}
                    className="w-[12rem] sm:w-[6rem] bg-white text-black text-bold px-[2rem] sm:px-[0.5rem] py-[0.2rem] rounded-[0.5rem] focus:outline-orange-400"
                  />
                  <span>Repetitions</span>
                </div>
              </div>

              <div className="flex justify-between items-center gap-[2rem] text-[6rem] sm:text-[1.5rem]">
                <span className="w-[48rem] flex-1 text-start">
                  Period of Repetition (in days)
                </span>
                <div className="w-1/4 flex items-center justify-between">
                  <input
                    type="number"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-[12rem] sm:w-[6rem] bg-white text-black text-bold px-[2rem] sm:px-[0.5rem] py-[0.2rem] rounded-[0.5rem] focus:outline-orange-400"
                  />
                  <span>Days</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-[8rem] sm:gap-[4rem] text-white text-[6rem] sm:text-[2rem]">
                <label htmlFor="attempt-days" className="text-left">
                  Attempt Days:
                </label>
                <div
                  id="attempt-days"
                  className="flex items-center gap-[8rem] sm:gap-[2rem]"
                >
                  {getSchedule(repeatTime, period).map((item, index) => (
                    <span key={index} className="">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {isChanged && (
                <button
                  onClick={handleSaveROSI}
                  className="sm:w-[12rem] flex text-black bg-white rounded-[0.5rem] px-[1rem] py-[0.5rem] text-[10rem] sm:text-[2rem]"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LurnySetting;
