import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch } from "react-redux";

import { PiUserGear } from "react-icons/pi";
import { RiRepeatLine } from "react-icons/ri";
import { TbBellRinging } from "react-icons/tb";

import UserPan from "../components/UserPan";
import Header from "../components/Header";
import { changeROSI } from "../actions/auth";

const LurnySetting = () => {
  const dispatch = useDispatch();

  const [userDetails, setUserDetails] = useState(null);
  // const [showSidePan, setShowSidePan] = useState(false);
  const [section, setSection] = useState("rosi");
  const [repeatTime, setRepeatTime] = useState("");
  const [period, setPeriod] = useState("");

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
  };

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
        transition:Bounce
        className="text-[2rem]"
      />
      <div className="w-full bg-[#262626] flex flex-1 justify-between px-[12rem] py-[6rem]">
        {/* Toggle button for mobile */}
        {/* <div
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
        </div> */}
        <div className="hidden sm:flex">
          <UserPan />
        </div>

        {/* My Lurnies */}
        <div className="w-full pl-[12rem]">
          <h3 className="text-white text-start text-[2.5rem] font-semibold">
            Settings
          </h3>
          <div className="flex mt-[4rem]">
            {/* Settings Group */}
            <div className="w-[20rem] flex flex-col gap-[2rem]">
              <div
                onClick={() => setSection("account")}
                className={`flex items-center gap-[2rem] text-white text-[2rem] cursor-pointer rounded-[0.5rem] px-[1rem] py-[0.5rem] ${
                  section === "account" ? "bg-[#404040]" : ""
                }`}
              >
                <PiUserGear /> <span>Account</span>
              </div>
              <div
                onClick={() => setSection("rosi")}
                className={`flex items-center gap-[2rem] text-white text-[2rem] cursor-pointer rounded-[0.5rem] px-[1rem] py-[0.5rem] ${
                  section === "rosi" ? "bg-[#404040]" : ""
                }`}
              >
                <RiRepeatLine /> <span>ROSI</span>
              </div>
              <div
                onClick={() => setSection("notification")}
                className={`flex items-center gap-[2rem] text-white text-[2rem] cursor-pointer rounded-[0.5rem] px-[1rem] py-[0.5rem] ${
                  section === "notification" ? "bg-[#404040]" : ""
                }`}
              >
                <TbBellRinging /> <span>Notification</span>
              </div>
            </div>

            {/* ROSI Setting */}
            <div
              className={`flex-col gap-[4rem] text-white px-[8rem] ${
                section === "rosi" ? "flex" : "hidden"
              }`}
            >
              <span className="text-bold text-start text-[2rem]">
                Repetition over Optimally Spaced Intervals (ROSI)
              </span>
              <div className="flex items-center gap-[2rem] text-[1.5rem]">
                <span className="w-[48rem] text-start">
                  Number of Repetitions (Min 8, Max 15)
                </span>
                <input
                  type="number"
                  min={8}
                  max={15}
                  value={repeatTime}
                  onChange={(e) => setRepeatTime(e.target.value)}
                  className="w-[6rem] bg-white text-black text-bold text-[2rem] px-[0.5rem] py-[0.2rem] rounded-[0.5rem] focus:outline-orange-400"
                />
                <span>Repetitions</span>
              </div>

              <div className="flex items-center gap-[2rem] text-[1.5rem]">
                <span className="w-[48rem] text-start">
                  Period of Repetition (in days)
                </span>
                <input
                  type="number"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-[6rem] bg-white text-black text-bold text-[2rem] px-[0.5rem] py-[0.2rem] rounded-[0.5rem] focus:outline-orange-400"
                />
                <span>Days</span>
              </div>

              {isChanged && (
                <button
                  onClick={handleSaveROSI}
                  className="w-[12rem] text-black bg-white rounded-[0.5rem] px-[1rem] py-[0.5rem] text-[2rem]"
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
