import React from "react";
import Ripple from "../Effects/Ripple";
import Avatar from "../Avatar";
import GroupAvatar from "../GroupAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faThumbtack } from "@fortawesome/free-solid-svg-icons";

function ListItem({
  e,
  handleSelectChat,
  toggleEditChat,
  selectedChats,
  handleNavigation,
}) {
  return (
    <Ripple.Li
      key={e._id}
      {...(!toggleEditChat && {
        onClick: () => handleNavigation(`/chat/${e._id}`),
      })}
      {...(toggleEditChat && {
        onClick: (event) =>
          handleSelectChat(event, { _id: e._id, status: e.status }),
      })}
      onContextMenu={(event) =>
        handleSelectChat(event, { _id: e._id, status: e.status })
      }
      style={
        selectedChats.some((item) => item._id === e._id)
          ? { backgroundColor: "#1a1c20" }
          : null
      }
    >
      <div
        className="selected-chat-checkbox"
        style={
          selectedChats.some((item) => item._id === e._id)
            ? { opacity: "1" }
            : null
        }
      >
        <FontAwesomeIcon icon={faCheck} />
      </div>
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
      <div className="time-container">
        {e.status === 1 ? (
          <FontAwesomeIcon icon={faThumbtack} className="thumbtack" />
        ) : null}

        <div className="time-box">{e.lastMessageTime}</div>
      </div>
    </Ripple.Li>
  );
}

export default ListItem;
