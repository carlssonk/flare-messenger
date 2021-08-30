import React from "react";
import Ripple from "../Effects/Ripple";
import Avatar from "../Avatar";
import GroupAvatar from "../GroupAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faThumbtack,
  faImages,
} from "@fortawesome/free-solid-svg-icons";

function ListItem({
  e,
  handleSelectChat,
  toggleEditChat,
  selectedChats,
  handleNavigation,
  sendImage,
  handleSelectChatImg,
}) {
  const LiStyle = {
    ...(!sendImage &&
    selectedChats &&
    selectedChats.some((item) => item._id === e._id)
      ? { backgroundColor: "#1a1c20" }
      : null),
    ...(sendImage &&
    selectedChats &&
    selectedChats.some((item) => item === e._id)
      ? { backgroundColor: "#1a1c20" }
      : null),
  };

  return (
    <Ripple.Li
      key={e._id}
      {...(!toggleEditChat &&
        !sendImage && {
          onClick: () => handleNavigation(`/chat/${e._id}`),
        })}
      {...(toggleEditChat &&
        !sendImage && {
          onClick: (event) =>
            handleSelectChat(event, { _id: e._id, status: e.status }),
        })}
      {...(sendImage && {
        onClick: () => handleSelectChatImg(e._id),
      })}
      {...(!sendImage && {
        onContextMenu: (event) =>
          handleSelectChat(event, { _id: e._id, status: e.status }),
      })}
      style={{ ...LiStyle }}
    >
      <div
        className="selected-chat-checkbox"
        style={
          selectedChats && selectedChats.some((item) => item._id === e._id)
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
            minWidth: "60px",
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
            minWidth: "60px",
            height: "60px",
            fontSize: "27px",
          }}
          chat={e}
        />
      )}
      <div className="text-box">
        {e.isPrivate ? (
          <div
            className="friend"
            style={
              sendImage &&
              selectedChats &&
              selectedChats.some((item) => item === e._id)
                ? { color: "#1bbbbb" }
                : null
            }
          >
            {e.users[0].name}
          </div>
        ) : (
          <>
            <div className="chat-people">{`${e.users.length} People`}</div>
            <div
              className="friend"
              style={
                sendImage &&
                selectedChats &&
                selectedChats.some((item) => item === e._id)
                  ? { color: "#1bbbbb" }
                  : null
              }
            >
              {e.name}
            </div>
          </>
        )}
        <div className="message">
          {e.gif && (
            <span
              style={{
                border: "1px solid #aaaaaa",
                borderRadius: "8px",
                padding: "0 4px",
              }}
            >
              GIF
            </span>
          )}
          {e.files && e.files.length > 0 ? (
            <>
              <FontAwesomeIcon icon={faImages} style={{ marginRight: "4px" }} />
              Photo
            </>
          ) : (
            e.text && e.text
          )}
        </div>
      </div>
      <div className="time-container">
        {sendImage &&
        selectedChats &&
        selectedChats.some((item) => item === e._id) ? (
          <FontAwesomeIcon icon={faCheck} style={{ color: "#1bbbbb" }} />
        ) : (
          <>
            {e.status === 1 ? (
              <FontAwesomeIcon icon={faThumbtack} className="thumbtack" />
            ) : null}
            <div className="time-box">{e.lastMessageTime}</div>
          </>
        )}
      </div>
    </Ripple.Li>
  );
}

export default ListItem;
