import React, { useContext, useRef, useState, useEffect } from "react";
import PreviewAvatar from "../components/Profile/PreviewAvatar";
import Ripple from "../components/Effects/Ripple";
import { NavContext } from "../context/NavContext";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faCamera,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/UserContext";

import { IonLoading, IonAlert } from "@ionic/react";

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
  const [toggleOptions, setToggleOptions] = useState(false);
  const [toggleRemoveAvatar, setToggleRemoveAvatar] = useState(false);

  const handleNavigation = (to) => {
    if (to === "/profile") {
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

  const handleAvatarClick = () => {
    setToggleOptions(true);
  };

  const handleToggleChooseAvatar = () => {
    fileRef.current.click();
    setToggleOptions(false);
  };

  const handleToggleRemoveAvatar = () => {
    setToggleRemoveAvatar(true);
    setToggleOptions(false);
  };

  const handleRemoveAvatar = async () => {
    setIsLoading(true);
    const res = await fetch(`http://localhost:3000/api/avatar`, {
      method: "DELETE",
    });
    const data = await res.json();
    setIsLoading(false);
    setNewAvatarUrl("");
    setUser({
      ...user,
      avatar: {
        path: null,
        hexCode: data.hexCode,
      },
    });
  };

  return (
    <>
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
              onClick={() => handleAvatarClick()}
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
        <div>
          <Ripple.Div
            className="edit-name-box"
            onClick={() => handleNavigation("/profile/edit/name")}
          >
            <div className="label">Name</div>
            <div className="value">{user && user.name}</div>
            <FontAwesomeIcon icon={faChevronRight} />
          </Ripple.Div>
          <Ripple.Div className="edit-name-box">
            <div className="label">Username</div>
            <div className="value">@{user && user.username}</div>
          </Ripple.Div>
        </div>
        <div
          className="avatar-options-popup"
          style={toggleOptions ? { transform: "translate3d(0, 0%, 0)" } : null}
        >
          <Ripple.Div>
            <div>Take Photo</div>
          </Ripple.Div>
          <Ripple.Div onClick={() => handleToggleChooseAvatar()}>
            <div>Choose From Gallery</div>
          </Ripple.Div>
          {user ? (
            user.avatar.path ? (
              <Ripple.Div onClick={() => handleToggleRemoveAvatar()}>
                <div>Remove Image</div>
              </Ripple.Div>
            ) : null
          ) : null}
        </div>
        <IonAlert
          isOpen={toggleRemoveAvatar}
          onDidDismiss={() => setToggleRemoveAvatar(false)}
          cssClass="remove-avatar-alert"
          header={"Remove avatar?"}
          buttons={[
            "Cancel",
            { text: "Remove", handler: () => handleRemoveAvatar() },
          ]}
        />
      </div>
      <div
        onClick={() => setToggleOptions(false)}
        className={`click-catcher ${
          toggleOptions ? "show-fade-half" : "hide-fade-half"
        }`}
      ></div>
    </>
  );
}

export default EditProfile;
