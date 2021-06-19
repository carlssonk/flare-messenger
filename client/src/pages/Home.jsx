import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DeviceInfo from "../components/DeviceInfo";
import ProfileImg from "../imgs/oliverhaha.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSearch,
  faUserPlus,
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
                  <img src={ProfileImg} alt="" />
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
        </div>
        <Link to="/profile">Profile</Link>
        <div>HOME</div>
      </motion.div>
    </>
  );
}

export default Home;
