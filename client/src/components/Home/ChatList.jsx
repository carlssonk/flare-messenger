import React, { useContext } from "react";

import { NavContext } from "../../context/NavContext";
import { useHistory } from "react-router-dom";
import Ripple from "../Effects/Ripple";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faArchive } from "@fortawesome/free-solid-svg-icons";
import ListItem from "./ListItem";

function ChatList({
  chats,
  handleEditChat,
  selectedChats,
  toggleEditChat,
  sendImage,
  handleSelectChatImg,
  page,
}) {
  const { setNav } = useContext(NavContext);
  const history = useHistory();

  const handleNavigation = (to) => {
    if (to === "/") {
      setNav("backward");
    } else {
      setNav("forward");
    }

    // const chatId = to.replace("/chat/", "");
    // const status = chats.filter((e) => e._id === chatId);
    // console.log(status);

    // we need to give a small delay so our transition class appends on the DOM before we redirect
    setTimeout(() => history.push(to), 10);
  };

  const handleSelectChat = (e, chat) => {
    e.preventDefault();

    if (selectedChats.some((e) => e._id === chat._id)) {
      handleEditChat(e, chat, "remove");
    } else {
      handleEditChat(e, chat, "add");
    }
  };

  return (
    <div className="chat-list">
      <ul>
        {page === "archived" ? (
          chats &&
          chats
            .filter((e) => e.status === 2)
            .map((e) => (
              <ListItem
                key={e._id}
                e={e}
                handleSelectChat={handleSelectChat}
                toggleEditChat={toggleEditChat}
                selectedChats={selectedChats}
                handleNavigation={handleNavigation}
                sendImage={sendImage}
                handleSelectChatImg={handleSelectChatImg}
              />
            ))
        ) : (
          <>
            {chats &&
              chats
                .filter((e) => e.status === 1)
                .map((e) => (
                  <ListItem
                    key={e._id}
                    e={e}
                    handleSelectChat={handleSelectChat}
                    toggleEditChat={toggleEditChat}
                    selectedChats={selectedChats}
                    handleNavigation={handleNavigation}
                    sendImage={sendImage}
                    handleSelectChatImg={handleSelectChatImg}
                  />
                ))}
            {chats &&
              chats
                .filter((e) => e.status === 0)
                .map((e) => (
                  <ListItem
                    key={e._id}
                    e={e}
                    handleSelectChat={handleSelectChat}
                    toggleEditChat={toggleEditChat}
                    selectedChats={selectedChats}
                    handleNavigation={handleNavigation}
                    sendImage={sendImage}
                    handleSelectChatImg={handleSelectChatImg}
                  />
                ))}
          </>
        )}

        {chats && chats.some((e) => e.status === 2) && page !== "archived" ? (
          <Ripple.Li
            className="archived-box"
            onClick={() => handleNavigation("/archived")}
          >
            <FontAwesomeIcon icon={faArchive} />
            <div>Archived</div>
          </Ripple.Li>
        ) : null}
        <div className="bottom-space"></div>
      </ul>
    </div>
  );
}

export default ChatList;
