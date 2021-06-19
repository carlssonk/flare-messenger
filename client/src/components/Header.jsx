import React from "react";
import { Link, useLocation } from "react-router-dom";
import DeviceInfo from "./DeviceInfo";
import ProfileImg from "../imgs/oliverhaha.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSearch,
  faUserPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

function Header() {
  const location = useLocation();

  return (
    <div className="header">
      <div className="nav-wrapper">
        <DeviceInfo />
        <div className="nav-container">
          <div className="profile-btn">
            <Link to="/profile">
              <img src={ProfileImg} alt="" />
            </Link>
          </div>
          <div className="page-label">
            {location.pathname === "/" ? "Chats" : null}
            {location.pathname === "/add" ? "Add Friends" : null}
          </div>
          <div className="icon-wrapper">
            {location.pathname === "/" ? (
              <Link to="/add">
                <div className="icon" style={{ marginRight: "10px" }}>
                  <FontAwesomeIcon icon={faUserPlus} />
                </div>
              </Link>
            ) : null}
            {location.pathname === "/" ? (
              <div className="icon">
                <FontAwesomeIcon icon={faEdit} />
              </div>
            ) : (
              <Link to="/">
                <div className="icon">
                  <FontAwesomeIcon
                    icon={faTimes}
                    style={{ fontSize: "20px" }}
                  />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="search-box">
        <FontAwesomeIcon icon={faSearch} />
        {location.pathname === "/add" ? (
          <input type="text" className="search" placeholder="Find Friends" />
        ) : (
          <input type="text" className="search" placeholder="Search" />
        )}
      </div>
    </div>
  );
}

export default Header;
