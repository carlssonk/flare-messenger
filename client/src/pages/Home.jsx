import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DeviceInfo from "../components/DeviceInfo";
import ProfileImg from "../imgs/oliverhaha.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Jeb_ from "../imgs/Jens-Bergensten.png";
import {
  faEdit,
  faSearch,
  faUserPlus,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";

function Home() {
  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.7,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { ease: "easeInOut", duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { ease: "easeInOut", duration: 0.2 },
      scale: 0.7,
    },
  };

  return (
    <>
      <motion.div
        key="poggers"
        style={{ width: "100%", height: "100%" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="home-page">
          <div className="header">
            <div className="nav-wrapper">
              <DeviceInfo />
              <div className="nav-container">
                <div className="profile-btn">
                  <Link to="/profile">
                    <img src={ProfileImg} alt="" />
                  </Link>
                </div>
                <div className="page-label">Chats</div>
                <div className="nav__icon">
                  <FontAwesomeIcon icon={faUserPlus} />
                </div>
                <div className="nav__icon">
                  <FontAwesomeIcon icon={faEdit} />
                </div>
              </div>
            </div>
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} />
              <input type="text" className="search" placeholder="Search" />
            </div>
          </div>
          <ul className="chat-list">
            <li>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="text-box">
                <div className="friend">Jens Bergensten</div>
                <div className="message">The business plan looking goo...</div>
              </div>
              <div className="time-box">9:40 AM</div>
            </li>
            <li>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="text-box">
                <div className="friend">Jens Bergensten</div>
                <div className="message">The business plan looking goo...</div>
              </div>
              <div className="time-box">9:40 AM</div>
            </li>
            <li>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="text-box">
                <div className="friend">Jens Bergensten</div>
                <div className="message">The business plan looking goo...</div>
              </div>
              <div className="time-box">9:40 AM</div>
            </li>
            <li>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="text-box">
                <div className="friend">Jens Bergensten</div>
                <div className="message">The business plan looking goo...</div>
              </div>
              <div className="time-box">9:40 AM</div>
            </li>
            <li>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="text-box">
                <div className="friend">Jens Bergensten</div>
                <div className="message">The business plan looking goo...</div>
              </div>
              <div className="time-box">9:40 AM</div>
            </li>
            <li>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="text-box">
                <div className="friend">Jens Bergensten</div>
                <div className="message">The business plan looking goo...</div>
              </div>
              <div className="time-box">9:40 AM</div>
            </li>
            <li>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="text-box">
                <div className="friend">Jens Bergensten</div>
                <div className="message">The business plan looking goo...</div>
              </div>
              <div className="time-box">9:40 AM</div>
            </li>
            <li>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="text-box">
                <div className="friend">Jens Bergensten</div>
                <div className="message">The business plan looking goo...</div>
              </div>
              <div className="time-box">9:40 AM</div>
            </li>
            <li>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="text-box">
                <div className="friend">Jens Bergensten</div>
                <div className="message">The business plan looking goo...</div>
              </div>
              <div className="time-box">9:40 AM</div>
            </li>
            <li>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="text-box">
                <div className="friend">Jens Bergensten</div>
                <div className="message">The business plan looking goo...</div>
              </div>
              <div className="time-box">9:40 AM</div>
            </li>
            <div className="bottom-space"></div>
          </ul>

          {/* <div className="bottom">HOasdasdME</div> */}
          <div className="footer-wrapper">
            <div className="footer">
              <div className="camera-box">
                <FontAwesomeIcon icon={faCamera} />
              </div>
            </div>
            <div className="blur"></div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Home;
