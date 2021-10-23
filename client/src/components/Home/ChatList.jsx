import React, { useContext } from "react";

import { NavContext } from "../../context/NavContext";
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

  const handleNavigation = (to) => {
    const direction = to === "/" ? 0 : 1;
    setNav({path: to, direction});
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
