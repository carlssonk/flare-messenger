import React, { useContext, useState, useEffect, useRef } from "react";
import PreviewAvatar from "../components/profile/PreviewAvatar";
import { UserContext } from "../context/UserContext";
import { useHistory } from "react-router-dom";
import { NavContext } from "../context/NavContext";

function Profile() {
  const { setUser, user } = useContext(UserContext);
  const fileRef = useRef(null);

  const history = useHistory();
  const { setNav } = useContext(NavContext);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [togglePopup, setTogglePopup] = useState(false);
  const [isFading, setIsFading] = useState(false);

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
    history.location.key = "logged out!"; // Change key to invoke animation
    setTimeout(() => setUser(null), 10);
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

  return (
    <div className="page profile-page">
      <PreviewAvatar
        togglePopup={togglePopup}
        handleTogglePopup={handleTogglePopup}
        imageUrl={previewAvatarUrl}
        image={imageFile}
      />
      <div className="profile-section">
        <div className="img-box" onClick={() => fileRef.current.click()}>
          <img src="" alt="" />
          <input
            type="file"
            ref={fileRef}
            onChange={addFile}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>
        <div className="name">{user && user.username}</div>
      </div>
      <div className="settings-section">
        <button onClick={handleLogout}>LOG OUT</button>
      </div>
    </div>
  );
}

export default Profile;
