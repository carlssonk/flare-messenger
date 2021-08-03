import React, { useContext } from "react";

import { NavContext } from "../../context/NavContext";
import { useHistory } from "react-router-dom";
import Ripple from "../Effects/Ripple";
import Avatar from "../Avatar";
import GroupAvatar from "../GroupAvatar";

function ChatList({
  chats,
  handleEditChat,
  selectedChats,
  toggleEditChat,
  setToggleEditChat,
}) {
  const { setNav } = useContext(NavContext);
  const history = useHistory();

  const handleNavigation = (to) => {
    if (to === "/") {
      setNav("backward");
    } else {
      setNav("forward");
    }
    // we need to give a small delay so our transition class appends on the DOM before we redirect
    setTimeout(() => history.push(to), 10);
  };

  const handleSelectChat = (e, chatId) => {
    e.preventDefault();
    console.log("SELECT CHAT");
    if (selectedChats.includes(chatId)) {
      handleEditChat(e, chatId, "remove");
    } else {
      handleEditChat(e, chatId, "add");
    }
  };

  return (
    <div className="chat-list">
      <ul>
        {chats &&
          chats.map((e) => {
            return (
              <Ripple.Li
                key={e._id}
                {...(!toggleEditChat && {
                  onClick: () => handleNavigation(`/chat/${e._id}`),
                })}
                {...(toggleEditChat && {
                  onClick: (event) => handleSelectChat(event, e._id),
                })}
                onContextMenu={(event) => handleSelectChat(event, e._id)}
                style={
                  selectedChats.includes(e._id)
                    ? { backgroundColor: "#1a1c20" }
                    : null
                }
              >
                {e.isPrivate ? (
                  <Avatar
                    style={{
                      marginLeft: "14px",
                      width: "60px",
                      height: "60px",
                      fontSize: "27px",
                    }}
                    user={e.users[0]}
                  />
                ) : (
                  <GroupAvatar
                    style={{
                      marginLeft: "14px",
                      width: "60px",
                      height: "60px",
                      fontSize: "27px",
                    }}
                    chat={e}
                  />
                )}

                <div className="text-box">
                  {e.isPrivate ? (
                    <div className="friend">{e.users[0].name}</div>
                  ) : (
                    <>
                      <div className="chat-people">{`${e.users.length} People`}</div>
                      <div className="chat">{e.name}</div>
                    </>
                  )}
                  <div className="message">{e.text}</div>
                </div>
                <div className="time-box">{e.lastMessageTime}</div>
              </Ripple.Li>
            );
          })}

        <div className="bottom-space"></div>
      </ul>
    </div>
  );
}

export default ChatList;
