import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
// import { GrGoogle } from "react-icons/gr";
import { FcGoogle } from "react-icons/fc";

// import { FaFacebookSquare } from "react-icons/fa";
// import { FaLinkedin } from "react-icons/fa";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { auth } from "../firebase/config";
import {
  signInWithPopup,
  GoogleAuthProvider,
  // FacebookAuthProvider,
} from "firebase/auth";

import BgImage from "../assets/images/signin.png";
import { signIn } from "../actions/auth";

export default function Signin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      const result = await signInWithPopup(auth, provider);
      dispatch(signIn(result.user.accessToken, navigate));
    } catch (error) {
      console.log(error);
    }
  }

  // function signInWithFacebook() {
  //   const provider = new FacebookAuthProvider();
  //   signInWithPopup(auth, provider)
  //     .then((result) => {
  //       if (result.credential) {
  //         var token = result.credential.accessToken;
  //         signIn(token, navigate);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  const handleCloseSigninModal = () => {
    navigate("/");
  };

  return (
    <div className="w-[100vw] min-h-[100vh] bg-black flex items-center justify-center">
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
      <img
        src={BgImage}
        alt="background image"
        className="w-full h-full object-cover"
      />
      <div className="w-[140rem] sm:w-[100rem] md:w-[64rem] lg:w-[56rem] xl:w-[36rem] px-[8rem] sm:px-[4rem] xl:px-[2.5rem] py-[16rem] sm:py-[8rem] xl:py-[4rem] bg-white flex flex-col items-start gap-[10rem] md:gap-[6rem] xl:gap-[2.5rem] text-black rounded-[4rem] sm:rounded-[2rem] fixed">
        <IoClose
          onClick={handleCloseSigninModal}
          className="absolute top-[4rem] sm:top-[2rem] right-[4rem] sm:right-[2rem] text-black text-[10rem] sm:text-[8rem] md:text-[4rem] lg:text-[2.5rem] xl:text-[2rem] cursor-pointer"
        />
        <h1 className="text-black text-[16rem] sm:text-[10rem] md:text-[6rem] lg:text-[5rem] xl:text-[3rem] font-bold">
          Signin Lurny
        </h1>
        <p className="text-black text-left text-[8rem] sm:text-[6rem] md:text-[4rem] lg:text-[3rem] xl:text-[2rem]">
          The world&lsquo;s largest collection of smart learning objects that
          help you learn efficiently.
        </p>
        <div className="flex flex-col gap-[4rem] sm:gap-[3rem] md:gap-[2rem] xl:gap-[1rem] text-black text-[8rem] sm:text-[6rem] md:text-[4rem] lg:text-[2.5rem] xl:text-[2rem]">
          {/* <div className="flex items-center gap-[2rem] px-[4rem] sm:px-[1rem] py-[0.5rem] border border-gray-300 outline-none hover:border-[#7F52BB] rounded-md cursor-pointer ">
            <FaLinkedin />
            <span>Continue with LinkedIn</span>
          </div> */}
          <div
            onClick={signInWithGoogle}
            className=" flex items-center gap-[4rem] sm:gap-[2rem] px-[4rem] sm:px-[2rem] py-[1rem] border border-gray-300 outline-none hover:border-[#7F52BB] rounded-md cursor-pointer hover:"
          >
            <FcGoogle />
            <span className="text-black">Continue with Google</span>
          </div>
          {/* <div
            onClick={signInWithFacebook}
            className="flex items-center gap-[2rem] px-[4rem] sm:px-[1rem] py-[0.5rem] border border-gray-300 outline-none hover:border-[#7F52BB] rounded-md cursor-pointer hover:"
          >
            <FaFacebookSquare />
            <span>Continue with Facebook</span>
          </div> */}
        </div>
        <p className="text-left text-[6rem] sm:text-[4rem] md:text-[2.5rem] lg:text-[2rem] xl:text-[1.5rem]">
          By signing up to <b>Lurny.net</b> you consent and agree to Lurny’s
          privacy policy to store, anage and process your personal information.
          To read more, please see our <Link to="/privacy">privacy policy</Link>{" "}
          here.
        </p>
      </div>
    </div>
  );
}
