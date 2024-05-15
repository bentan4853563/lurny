import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function TranslateComponent() {
  const location = useLocation();
  const [isRender, setIsRender] = useState(false);

  // This useEffect runs once on component mount to add the Google Translate script
  useEffect(() => {
    const googleTranslateScript = document.createElement("script");
    googleTranslateScript.type = "text/javascript";
    googleTranslateScript.async = true;
    googleTranslateScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

    document.body.appendChild(googleTranslateScript);

    // Callback function for Google Translate
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,es,de,zh,fr,ru,ar,hi,bn,te,mr,ta,gu,kn,ml,pa",
        },
        "google_translate_element"
      );
    };

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(googleTranslateScript);
    };
  }, []);

  // This useEffect runs when `location` changes
  useEffect(() => {
    // Check if the pathname includes "lurny/feeds" or "lurny/remind"
    const shouldRender =
      location.pathname.includes("lurny/feeds") ||
      location.pathname.includes("lurny/remind");
    setIsRender(shouldRender);
  }, [location]);

  return (
    <div>
      {isRender && (
        <div className="text-white" id="google_translate_element"></div>
      )}
    </div>
  );
}

export default TranslateComponent;
