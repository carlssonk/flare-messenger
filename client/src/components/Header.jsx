import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { NavContext } from "../context/NavContext";
import { UserContext } from "../context/UserContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSearch,
  faUserPlus,
  faTimes,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Ripple from "../components/Effects/Ripple";
import Avatar from "./Avatar";
import EditChat from "./EditChat";

function Header({
  handleSearchUsers,
  hasIncomingRequests,
  handleFindUsers,
  handleSearchChats,
  toggleEditChat,
  setToggleEditChat,
  selectedChats,
  setChats,
  chats,
  page,
}) {
  const location = useLocation();
  const { setNav } = useContext(NavContext);
  const { user } = useContext(UserContext);

  const handleNavigation = (to) => {
    const direction = to === "/" ? 0 : 1;
    setNav({path: to, direction});
  };

  return (
    <div className="header">
      <div className="nav-wrapper">
        <div
          className="edit-chat-container"
          style={
            toggleEditChat || page === "archived"
              ? { opacity: "1", visibility: "visible" }
              : null
          }
        >
          <div className="section">
            <Ripple.Div
              {...(page === "archived" && {
                onClick: () => handleNavigation("/"),
              })}
              {...(page !== "archived" && {
                onClick: () => setToggleEditChat(false),
              })}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Ripple.Div>
          </div>
          <div className="section">
            <EditChat
              page={page}
              selectedChats={selectedChats}
              setToggleEditChat={setToggleEditChat}
              toggleEditChat={toggleEditChat}
              chats={chats}
              setChats={setChats}
            />
          </div>
        </div>
        <div className="nav-container">
          <Avatar
            page="header"
            handleNavigation={handleNavigation}
            user={user}
            style={{
              width: "40px",
              minWidth: "40px",
              height: "40px",
              fontSize: "18px",
            }}
          />
          <div className="page-label">
            {location.pathname === "/" ? "Chats" : null}
            {location.pathname === "/add" ? "Add Friends" : null}
            {location.pathname === "/new/chat" ? "New Chat" : null}
            {location.pathname === "/new/group" ? "New Group" : null}
            {location.pathname === "/archived" ? "Archived" : null}
            {location.pathname === "/send-photo" ? "Send Photo" : null}
          </div>
          <div className="icon-wrapper">
            {location.pathname === "/" ? (
              <div className="add-wrapper">
                <Ripple.Div
                  onClick={() => handleNavigation("/add")}
                  className="icon"
                  style={{ marginRight: "10px" }}
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                </Ripple.Div>
                {hasIncomingRequests ? (
                  <div className="notification-bubble"></div>
                ) : null}
              </div>
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
      {page === "archived" ? null : (
        <div className="input-wrapper">
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
              <input
                {...(handleSearchChats && {
                  onChange: (e) => handleSearchChats(e),
                })}
                {...(handleSearchUsers && {
                  onChange: (e) => handleSearchUsers(e),
                })}
                type="text"
                className="search"
                placeholder="Search"
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
