import React from "react";
import { useLocation, NavLink } from "react-router-dom";

import DeviceInfo from "./DeviceInfo";
import ProfileImg from "../imgs/oliverhaha.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSearch,
  faUserPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

function Header({ handleFindUsers }) {
  const location = useLocation();

  return (
    <div className="header">
      <div className="nav-wrapper">
        <DeviceInfo />
        <div className="nav-container">
          <div className="profile-btn">
            <NavLink to="/profile">
              <img src={ProfileImg} alt="" />
            </NavLink>
          </div>
          <div className="page-label">
            {location.pathname === "/" ? "Chats" : null}
            {location.pathname === "/add" ? "Add Friends" : null}
          </div>
          <div className="icon-wrapper">
            {location.pathname === "/" ? (
              <NavLink to="/add">
                <div className="icon" style={{ marginRight: "10px" }}>
                  <FontAwesomeIcon icon={faUserPlus} />
                </div>
              </NavLink>
            ) : null}
            {location.pathname === "/" ? (
              <div className="icon">
                <FontAwesomeIcon icon={faEdit} />
              </div>
            ) : (
              <NavLink to="/">
                <div className="icon">
                  <FontAwesomeIcon
                    icon={faTimes}
                    style={{ fontSize: "20px" }}
                  />
                </div>
              </NavLink>
            )}
          </div>
        </div>
      </div>
      <div className="search-box">
        <FontAwesomeIcon icon={faSearch} />
        {location.pathname === "/add" ? (
          <input
            onChange={handleFindUsers}
            type="text"
            className="search"
            placeholder="Find Friends"
          />
        ) : (
          <input type="text" className="search" placeholder="Search" />
        )}
      </div>
    </div>
  );
}

export default Header;
