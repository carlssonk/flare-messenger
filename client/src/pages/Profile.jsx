import React, { useContext, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { useHistory } from "react-router-dom";
import { NavContext } from "../context/NavContext";
import { v4 as uuidv4 } from "uuid";
import Ripple from "../components/Effects/Ripple";
import Avatar from "../components/Avatar";

function Profile() {
  const { setUser, user } = useContext(UserContext);
  const fileRef = useRef(null);

  const history = useHistory();
  const { setNav } = useContext(NavContext);

  const handleNavigation = (to) => {
    if (to === "/") {
      setNav("backward");
    } else {
      setNav("forward");
    }
    // we need to give a small delay so our transition class appends on the DOM before we redirect
    setTimeout(() => history.push(to), 10);
  };

  const handleLogout = async () => {
    await fetch(`/api/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    setNav("backward");
    history.location.key = uuidv4(); // Change key to invoke animation
    setUser(null);
  };

  return (
    <div className="page profile-page">
      <div className="top-bar">
        <Ripple.Button onClick={() => handleNavigation("/")}>
          Done
        </Ripple.Button>
      </div>
      <Ripple.Div
        className="profile-section"
        onClick={() => handleNavigation("/profile/edit")}
      >
        <Avatar
          page="profile"
          user={user}
          fileRef={fileRef}
          style={{ width: "100px", height: "100px", fontSize: "45px" }}
        />

        <div className="name">{user && user.name}</div>
        <div className="username">@{user && user.username}</div>
      </Ripple.Div>
      <div className="settings-section">
        <button onClick={handleLogout}>LOG OUT</button>
      </div>
    </div>
  );
}

export default Profile;
