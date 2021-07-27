import React, { useContext, useState, useEffect, useRef } from "react";
import PreviewAvatar from "../components/Profile/PreviewAvatar";
import { UserContext } from "../context/UserContext";
import { useHistory } from "react-router-dom";
import { NavContext } from "../context/NavContext";
import { v4 as uuidv4 } from "uuid";
import DeviceInfo from "../components/DeviceInfo";
import Ripple from "../components/Effects/Ripple";

function Profile() {
  const { setUser, user } = useContext(UserContext);
  const fileRef = useRef(null);

  const history = useHistory();
  const { setNav } = useContext(NavContext);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [togglePopup, setTogglePopup] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const handleNavigation = (to) => {
    if (to === "/") {
      setNav("backward");
    } else {
      setNav("forward");
    }
    // we need to give a small delay so our transition class appends on the DOM before we redirect
    setTimeout(() => history.push(to), 10);
  };

  useEffect(() => {
    setIsFading(true);
    setTimeout(() => setIsFading(false), 250);
  }, [togglePopup]);

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

  const handleTogglePopup = (bool) => {
    if (isFading) return; // to avoid spam
    setTogglePopup(bool);
  };

  const addFile = (e) => {
    if (e.target.files[0].type.indexOf("image/") > -1) {
      const file = e.target.files[0];
      const fileURL = window.URL.createObjectURL(file);
      setImageFile(file);
      setPreviewAvatarUrl(fileURL);
    }
    setTogglePopup(true);
  };

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <div className="page profile-page">
      <DeviceInfo />
      <div className="top-bar">
        <Ripple.Button>Done</Ripple.Button>
      </div>
      <PreviewAvatar
        togglePopup={togglePopup}
        handleTogglePopup={handleTogglePopup}
        imageUrl={previewAvatarUrl}
        image={imageFile}
      />
      <Ripple.Div
        className="profile-section"
        onClick={() => handleNavigation("/profile/edit")}
      >
        <div
          className="img-box"
          style={
            user
              ? user.avatar.path
                ? null
                : { backgroundColor: user.avatar.hexCode }
              : null
          }
          onClick={() => fileRef.current.click()}
        >
          <div className="avatar-label">
            {user && user.username.substring(0, 1)}
          </div>
          <img
            src=""
            alt=""
            style={
              user ? (user.avatar.path ? null : { display: "none" }) : null
            }
          />
          <input
            type="file"
            ref={fileRef}
            onChange={addFile}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>
        <div className="name">{user && user.name}</div>
        <div className="username">{user && user.username}</div>
      </Ripple.Div>
      <div className="settings-section">
        <button onClick={handleLogout}>LOG OUT</button>
      </div>
    </div>
  );
}

export default Profile;
