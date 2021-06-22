import React from "react";
import DeviceInfo from "../components/DeviceInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faPhoneAlt,
  faVideo,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import Jeb_ from "../imgs/Jens-Bergensten.png";

function Chat() {
  return (
    <div className="chat-page page">
      <div className="header-wrapper">
        <div className="header">
          <DeviceInfo />
          <div className="top-bar">
            <div className="left-section">
              <div className="back-arrow">
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>

              <div className="user-box">
                <div className="img-box-wrapper">
                  <div className="img-box">
                    <img src={Jeb_} alt="" />
                  </div>
                </div>

                <div className="text-box">
                  <div className="name">Jeb_</div>
                  <div className="status">Currently Active</div>
                </div>
              </div>
            </div>
            <div className="right-section">
              <FontAwesomeIcon icon={faPhoneAlt} />
              <FontAwesomeIcon icon={faVideo} />
              <FontAwesomeIcon icon={faEllipsisV} />
            </div>
          </div>
        </div>
        <div className="blur"></div>
      </div>
      <div className="message-container">
        <ul className="message-list"></ul>
      </div>
      <div className="controller-container"></div>
    </div>
  );
}

export default Chat;
