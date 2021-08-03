import React, { useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { NavContext } from "../context/NavContext";
import { UserContext } from "../context/UserContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSearch,
  faUserPlus,
  faTimes,
  faTrash,
  faArchive,
  faThumbtack,
  faChevronLeft,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Ripple from "../components/Effects/Ripple";
import Avatar from "./Avatar";

function Header({ handleFindUsers, toggleEditChat, setToggleEditChat }) {
  const location = useLocation();
  const history = useHistory();
  const { setNav } = useContext(NavContext);
  const { user } = useContext(UserContext);

  const handleNavigation = (to) => {
    if (to === "/") {
      setNav("backward");
    } else {
      setNav("forward");
    }
    // we need to give a small delay so our transition class appends on the DOM before we redirect
    setTimeout(() => history.push(to), 10);
  };

  return (
    <div className="header">
      <div className="nav-wrapper">
        <div
          className="edit-chat-container"
          style={
            toggleEditChat ? { opacity: "1", visibility: "visible" } : null
          }
        >
          <div className="section">
            <Ripple.Div onClick={() => setToggleEditChat(false)}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Ripple.Div>
          </div>
          <div className="section">
            <Ripple.Div>
              <FontAwesomeIcon icon={faThumbtack} />
            </Ripple.Div>
            <Ripple.Div>
              <FontAwesomeIcon icon={faArchive} />
            </Ripple.Div>
            <Ripple.Div>
              <FontAwesomeIcon icon={faTrash} />
            </Ripple.Div>
          </div>
        </div>
        <div className="nav-container">
          <Avatar
            page="header"
            handleNavigation={handleNavigation}
            user={user}
            style={{ width: "40px", height: "40px", fontSize: "18px" }}
          />
          <div className="page-label">
            {location.pathname === "/" ? "Chats" : null}
            {location.pathname === "/add" ? "Add Friends" : null}
            {location.pathname === "/new/chat" ? "New Chat" : null}
            {location.pathname === "/new/group" ? "New Group" : null}
          </div>
          <div className="icon-wrapper">
            {location.pathname === "/" ? (
              <Ripple.Div
                onClick={() => handleNavigation("/add")}
                className="icon"
                style={{ marginRight: "10px" }}
              >
                <FontAwesomeIcon icon={faUserPlus} />
              </Ripple.Div>
            ) : null}
            {location.pathname === "/" ? (
              <Ripple.Div
                onClick={() => handleNavigation("/new/chat")}
                className="icon"
              >
                <FontAwesomeIcon icon={faEdit} />
              </Ripple.Div>
            ) : (
              <Ripple.Div
                onClick={() => handleNavigation("/")}
                className="icon"
              >
                <FontAwesomeIcon icon={faTimes} style={{ fontSize: "20px" }} />
              </Ripple.Div>
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
        ) : null}
        {location.pathname !== "/add" ? (
          <input type="text" className="search" placeholder="Search" />
        ) : null}
      </div>
    </div>
  );
}

export default Header;
