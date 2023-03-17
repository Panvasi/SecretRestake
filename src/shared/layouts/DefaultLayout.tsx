import { faBars, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "shared/components/Footer";
import { KeplrPanel } from "shared/components/Keplr";
import { useState, createContext, useEffect, useContext } from "react";
import { Breakpoint } from "react-socks";
import { Flip, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import FloatingCTAButton from "shared/components/FloatingCTAButton";
import FeedbackButton from "shared/components/FeedbackButton";
import { ThemeContext } from "shared/context/ThemeContext";
import { ThemeSwitch } from "shared/components/ThemeSwitch";

export const NavigationContext = createContext<boolean | null>(null);

export const DefaultLayout = ({ children }: any) => {
  /**
   * Mobile Menu Handler
   */
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  // auto close menu
  const location = useLocation();
  useEffect(() => {
    if (showMobileMenu) {
      setShowMobileMenu(false);
    }
  }, [location]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024 && setShowMobileMenu) {
        setShowMobileMenu(false);
      }
    }
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Fixed Feedback Button */}
      <FeedbackButton
        url={"https://github.com/SecretSaturn/SecretRestake/issues/new"}
      />

      {/* Fixed Help Button */}
      <FloatingCTAButton
        url="https://linktr.ee/SCRTSupport"
        text="Need Help?"
      />

      <div className="flex">
        {/* Menu */}
        <main className="flex flex-col min-h-screen flex-1 lg:ml-[17rem]">
          <div className="flex-1">
            {/* Top Bar [Burger Menu | Socials | Keplr] */}
            <div className="flex items-center gap-4 p-4">
              <div className="flex-initial sm:flex-1 text-right space-x-2">
                <ThemeSwitch />
              </div>

              <div className="flex-1 sm:flex-initial sm:flex sm:justify-end">
                <KeplrPanel />
              </div>
            </div>

            <div className="lg:mr-[17rem]">{children}</div>
          </div>
          <div className="lg:mr-[17rem]">
            <div className="max-w-7xl mx-auto mt-auto">
              <Footer />
            </div>
          </div>
        </main>
      </div>
      <Breakpoint medium up>
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover={true}
          theme="dark"
        />
      </Breakpoint>
      <Breakpoint small down>
        <ToastContainer
          position={"bottom-left"}
          autoClose={false}
          hideProgressBar={true}
          closeOnClick={true}
          draggable={false}
          theme={"dark"}
          transition={Flip}
        />
      </Breakpoint>
    </>
  );
};

export default DefaultLayout;
