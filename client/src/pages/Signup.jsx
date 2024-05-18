import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../firebase/config";

import { useDispatch } from "react-redux";
import { signUp } from "../actions/auth";

import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

import { FcGoogle } from "react-icons/fc";
import { ImFacebook } from "react-icons/im";
import { ImLinkedin2 } from "react-icons/im";

import signupImg from "../assets/images/signup.png";
import letterLogo from "../assets/icons/letter_logo.png";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  function signUpWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    signInWithPopup(auth, provider)
      .then((result) => {
        dispatch(signUp(result.user.accessToken, navigate));
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  function signUpWithFacebook() {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        if (result.credential) {
          var token = result.credential.accessToken;
          dispatch(signUp(token, navigate));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="w-full min-h-[100vh] flex font-raleway">
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
      <div className="w-1/2 relative">
        <img
          src={signupImg}
          alt="signup image"
          className="h-full object-cover"
        />
        <img
          src={letterLogo}
          alt="logo image"
          className="absolute top-1/2 left-1/2 tansform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div className="w-1/2 h-full px-[8rem] py-[12rem] flex flex-col gap-[6rem] justify-center items-center">
        <span className="text-white text-[3rem]">
          Sign in or create a new account
        </span>
        <div className="w-full flex flex-col gap-[2rem] items-center ">
          <label htmlFor="email" className="text-white text-[2rem]">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-2/3 bg-transparent border border-violet-600 px-[1rem] py-[1rem] text-center text-[#FFC36D] text-[2rem] outline-none focus:border-[#7F52BB] focus:border rounded-lg"
          />
          <button className="bg-white hover:bg-gray-200 px-[4rem] py-[0.5rem] mt-[2rem] text-black rounded-md text-[2rem] inline-block focus:outline-none active:bg-gray-200">
            Continue
          </button>
        </div>
        <div className="w-2/3 flex items-center">
          <div className="flex-grow border-t border-gray-300 px-4"></div>
          <span className="px-[4rem] text-white text-[2rem]">or</span>
          <div className="flex-grow border-t border-gray-300 px-4"></div>
        </div>
        <div className="flex flex-col gap-[2rem]">
          <div className="bg-[#007BB5] hover:bg-[#606BB5] flex items-center gap-[2rem] px-[1rem] py-[0.5rem] rounded-md text-white text-[2rem] cursor-pointer ">
            <ImLinkedin2 className="text-[2rem]" />
            <span>Continu with LinkedIn</span>
          </div>
          <div
            onClick={signUpWithGoogle}
            className="bg-white hover:bg-gray-200 flex items-center gap-[2rem] px-[1rem] py-[0.5rem] rounded-md text-white text-[2rem] cursor-pointer hover:"
          >
            <FcGoogle className="text-[2rem]" />
            <span className="text-black">Continu with Goggle</span>
          </div>
          <div
            onClick={signUpWithFacebook}
            className="bg-[#3B5999] hover:bg-[#3B5979] flex items-center gap-[2rem] px-[1rem] py-[0.5rem] rounded-md text-white text-[2rem] cursor-pointer hover:"
          >
            <ImFacebook className="text-[2rem]" />
            <span>Continu with LinkedIn</span>
          </div>
        </div>
        <Link
          to="/signin"
          className="w-full px-[12rem] text-start text-white text-[2rem] "
        >
          Sign in?
        </Link>
        <span className="text-white text-[1.5rem] mt-[4rem]">
          By signing up to Lurny.net you consent and agree to Lurny&asquo;s
          <Link to="/privacy-policy">privacy policy</Link> to store, manage and
          process your personal information. To read more, please see
        </span>
      </div>
    </div>
  );
};

export default Signup;
