import React, { useEffect } from "react";
import Ripple from "./Effects/Ripple";

function GroupAvatar({ style, chat }) {
  // const userStyle = user
  //   ? user.avatar.path && page !== "add-friends"
  //     ? null
  //     : { backgroundColor: user.avatar.hexCode }
  //   : null;

  useEffect(() => {
    console.log(chat);
  }, [chat]);

  return (
    <Ripple.Div
      className="avatar-img-box"
      // {...(page === "header" && {
      //   onClick: () => handleNavigation("/profile"),
      // })}
      // {...(page === "edit" && {
      //   onClick: () => handleAvatarClick(),
      // })}
      // style={{ ...userStyle, ...style }}
      style={{ backgroundColor: "rgb(40,40,40)", ...style }}
    >
      {chat.image ? (
        chat.image.path ? null : (
          <div className="avatar-label">
            {chat && chat.name.substring(0, 1)}
          </div>
        )
      ) : null}
      <img
        src={chat.image && chat.image.path}
        alt=""
        style={
          chat.image ? (chat.image.path ? null : { display: "none" }) : null
        }
      />
    </Ripple.Div>
  );
}

export default GroupAvatar;
