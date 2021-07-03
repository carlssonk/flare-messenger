import React, { useContext, useState, useEffect, useRef } from "react";
import PreviewAvatar from "../components/profile/PreviewAvatar";
import { UserContext } from "../context/UserContext";

function Profile() {
  const { setUser, user } = useContext(UserContext);
  const fileRef = useRef(null);

  const [previewAvatarUrl, setPreviewAvatarUrl] = useState("");
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
      />
      <div className="profile-section">
        <div className="img-box" onClick={() => fileRef.current.click()}>
          <img src="" alt="" />
          <input
            type="file"
            ref={fileRef}
            onChange={addFile}
            accept="image/*,video/*,audio/*"
            style={{ display: "none" }}
          />
        </div>
        <div className="name">{user.username}</div>
      </div>
      <div className="settings-section">
        <button onClick={handleLogout}>LOG OUT</button>
      </div>
    </div>
  );
}

export default Profile;
