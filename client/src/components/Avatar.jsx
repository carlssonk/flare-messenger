import React from "react";
import Ripple from "./Effects/Ripple";

function Avatar({ page, style, user, handleNavigation, handleAvatarClick }) {
  const userStyle = user
    ? user.avatar.path && page !== "add-friends"
      ? null
      : { backgroundColor: user.avatar.hexCode }
    : null;

  return (
    <Ripple.Div
      className="avatar-img-box"
      {...(page === "header" && {
        onClick: () => handleNavigation("/profile"),
      })}
      {...(page === "edit" && {
        onClick: () => handleAvatarClick(),
      })}
      style={{ ...userStyle, ...style }}
    >
      {user ? (
        user.avatar.path && page !== "add-friends" ? null : (
          <div className="avatar-label">
            {user && user.username.substring(0, 1)}
          </div>
        )
      ) : null}
      {page !== "add-friends" ? (
        <img
          src={user && user.avatar.path}
          alt=""
          style={user ? (user.avatar.path ? null : { display: "none" }) : null}
        />
      ) : null}
    </Ripple.Div>
  );
}

export default Avatar;
