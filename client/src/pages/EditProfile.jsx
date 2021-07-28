import React, { useContext, useRef, useState, useEffect } from "react";
import PreviewAvatar from "../components/Profile/PreviewAvatar";
import Ripple from "../components/Effects/Ripple";
import { NavContext } from "../context/NavContext";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faCamera,
  faTemperatureHigh,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/UserContext";

import { IonLoading } from "@ionic/react";

function EditProfile() {
  const { setUser, user } = useContext(UserContext);
  const fileRef = useRef(null);

  const { setNav } = useContext(NavContext);
  const history = useHistory();
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [togglePopup, setTogglePopup] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState("");

  const handleNavigation = (to) => {
    if (to === "/profile") {
      setNav("backward");
    } else {
      setNav("forward");
    }
    // we need to give a small delay so our transition class appends on the DOM before we redirect
    setTimeout(() => history.push(to), 10);
  };

  // useEffect(() => {
  //   setHasMounted(true);
  // }, []);

  useEffect(() => {
    setIsFading(true);
    setTimeout(() => setIsFading(false), 250);
    if (!togglePopup) resetAvatarState();
  }, [togglePopup]);

  const handleTogglePopup = (bool) => {
    if (isFading) return; // to avoid spam
    setTogglePopup(bool);
  };

  const addFile = (e) => {
    if (e.target.files[0].type.indexOf("image/") > -1) {
      const file = e.target.files[0];
      console.log(file);
      const fileURL = window.URL.createObjectURL(file);
      setImageFile(file);
      setPreviewAvatarUrl(fileURL);
    }
    setTogglePopup(true);
  };

  const resetAvatarState = () => {
    setPreviewAvatarUrl("");
    setImageFile(null);
    fileRef.current.value = "";
  };

  return (
    <div className="page edit-profile-page">
      <IonLoading isOpen={isLoading} message={"Updating..."} />
      <PreviewAvatar
        setIsLoading={setIsLoading}
        setNewAvatarUrl={setNewAvatarUrl}
        togglePopup={togglePopup}
        handleTogglePopup={handleTogglePopup}
        imageUrl={previewAvatarUrl}
        image={imageFile}
      />
      <div className="top-bar">
        <Ripple.Div
          className="back-arrow"
          onClick={() => handleNavigation("/profile")}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Ripple.Div>
      </div>

      <div className="img-container">
        <div className="img-wrapper">
          <div className="avatar-camera-box">
            <FontAwesomeIcon className="avatar-camera" icon={faCamera} />
          </div>

          <Ripple.Div
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
            {user ? (
              user.avatar.path ? null : (
                <div className="avatar-label">
                  {user && user.username.substring(0, 1)}
                </div>
              )
            ) : null}
            <img
              src={newAvatarUrl.length > 0 ? newAvatarUrl : user.avatar.path}
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
          </Ripple.Div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
