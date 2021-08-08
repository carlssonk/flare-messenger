import React, { useEffect, useState, useContext } from "react";
import Ripple from "./Effects/Ripple";
import Avatar from "./Avatar";
import { UserContext } from "../context/UserContext";

function GroupAvatar({ style, chat: chatObj, scale = 1 }) {
  const { user } = useContext(UserContext);
  const [chat, setChat] = useState({});

  useEffect(() => {
    if (!chatObj.users) return;
    const users = chatObj.users.filter((e) => e.username !== user.username);
    chatObj.users = users;
    setChat(chatObj);
  }, [chatObj, user.username]);

  let multipleUsersStyle = {};
  let avatarBoxStyle = {};
  let lastUserStyle = {};

  switch (chat.users && chat.users.length) {
    case 2:
      multipleUsersStyle = {
        width: `${30 * scale}px`,
        height: `${30 * scale}px`,
        fontSize: `${13.5 * scale}px`,
      };
      break;
    case 3:
      multipleUsersStyle = {
        width: `${30 * scale}px`,
        height: `${30 * scale}px`,
        fontSize: `${13.5 * scale}px`,
      };
      avatarBoxStyle = {
        marginTop: `${8 * scale}px`,
      };
      lastUserStyle = {
        marginTop: `${-4 * scale}px`,
      };
      break;
    case 4:
      multipleUsersStyle = {
        width: `${26 * scale}px`,
        height: `${26 * scale}px`,
        fontSize: `${11.7 * scale}px`,
      };
      break;
    case 5:
      multipleUsersStyle = {
        width: `${26 * scale}px`,
        height: `${26 * scale}px`,
        fontSize: `${11.7 * scale}px`,
      };
      lastUserStyle = {
        position: "absolute",
      };
      break;
    default:
      multipleUsersStyle = {
        width: `${40 * scale}px`,
        height: `${40 * scale}px`,
        fontSize: `${18 * scale}px`,
      };
  }

  return (
    <Ripple.Div
      className="avatar-img-box"
      style={{ backgroundColor: "rgb(40,40,40)", ...style }}
    >
      {chat.image && chat.image.path ? ( // Chat has image
        <img src={chat.image && chat.image.path} alt="" />
      ) : chat.users && chat.users.length >= 6 ? ( // Chat has NO image and length > 5
        <div className="avatar-label">{chat && chat.name.substring(0, 1)}</div>
      ) : (
        // Chat has NO image and length < 6
        <div className="avatar-box-multiple" style={{ ...avatarBoxStyle }}>
          {chat.users &&
            chat.users.map((e) => {
              return (
                <Avatar
                  key={e.name}
                  user={e}
                  style={
                    e.username === chat.users[chat.users.length - 1].username
                      ? { ...multipleUsersStyle, ...lastUserStyle }
                      : { ...multipleUsersStyle }
                  }
                />
              );
            })}
        </div>
      )}
    </Ripple.Div>
  );
}

export default GroupAvatar;
