import React, { useContext, useRef, useState, useEffect } from "react";
import PreviewAvatar from "../components/PreviewAvatar";
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
import Avatar from "../components/Avatar";
import { hasImageCapture } from "../utils/hasImageCapture";
import UserMediaAlert from "../components/UserMediaAlert";

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
  const [toggleOptions, setToggleOptions] = useState(false);
  const [toggleRemoveAvatar, setToggleRemoveAvatar] = useState(false);
  const [toggleCameraAlert, setToggleCameraAlert] = useState(false);

  const handleNavigation = (to) => {
    if (to === "/camera") {
      setNav({path: to, direction: 1, state: { prevPath: history.location.pathname }})
      return
    }
    const direction = to === "/profile" ? 0 : 1;
    setNav({path: to,direction})
  };

  useEffect(() => {
    setIsFading(true);
    setTimeout(() => setIsFading(false), 250);
    if (!togglePopup) resetAvatarState();
  }, [togglePopup]);

  useEffect(() => {
    const state = history.location.state
    if (state && state.files) {
      setImageFile(state.files[0].file);
      setPreviewAvatarUrl(state.files[0].url);
      setTogglePopup(true);
    }
  }, [history.location.state]);

  const handleTogglePopup = (bool) => {
    if (isFading) return; // to avoid spam
    setTogglePopup(bool);
    window.history.replaceState(null, "New Title");
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
    const res = await fetch(`/api/avatar`, {
      method: "DELETE",
    });
    const data = await res.json();
    setIsLoading(false);
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
        {togglePopup ? (
          <PreviewAvatar
            type="profile"
            setIsLoading={setIsLoading}
            handleTogglePopup={handleTogglePopup}
            imageUrl={previewAvatarUrl}
            image={imageFile}
          />
        ) : null}

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

            <Avatar
              page="edit"
              user={user}
              handleAvatarClick={handleAvatarClick}
              style={{ fontSize: "45px" }}
            />

            <input
              type="file"
              ref={fileRef}
              onChange={addFile}
              accept="image/*"
              style={{ display: "none" }}
            />
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
          <Ripple.Div onClick={() => {
            if (!hasImageCapture()) return setToggleCameraAlert(true);
            handleNavigation("/camera")
          }}>
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
        // style={{ height: "calc(100% - 44px)" }} Use this when using DeviceInfo
      ></div>
      <UserMediaAlert toggleCameraAlert={toggleCameraAlert} setToggleCameraAlert={setToggleCameraAlert} />
    </>
  );
}

export default EditProfile;
