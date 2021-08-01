import React, { useEffect, useState, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faPlus } from "@fortawesome/free-solid-svg-icons";
import { NavContext } from "../../context/NavContext";
import { useHistory } from "react-router-dom";
import Ripple from "../../components/Effects/Ripple";
import { IonLoading } from "@ionic/react";
import PreviewAvatar from "../PreviewAvatar";

const formRed = "#ff0042";

function CreateGroup({ togglePopup, handleTogglePopup }) {
  const { setNav } = useContext(NavContext);
  const history = useHistory();
  const fileRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState("");
  const [groupAvatar, setGroupAvatar] = useState("");
  const [togglePreview, setTogglePreview] = useState(false);
  const [toggleOptions, setToggleOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleRemoveAvatar, setToggleRemoveAvatar] = useState(false);
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

  const handleCreateChat = async (userId) => {
    if (name.length === 0) return setError("Choose a name for the group.");
    setError("");
    const res = await fetch(`/api/chats/new`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        isPrivate: true,
      }),
    });
    const data = await res.json();
    handleNavigation(`/chat/${data.chatId}`);
  };

  useEffect(() => {
    setIsFading(true);
    setTimeout(() => setIsFading(false), 250);
    if (!togglePreview) resetAvatarState();
  }, [togglePreview]);

  const handleTogglePreview = (bool) => {
    console.log(isFading);
    if (isFading) return; // to avoid spam
    setTogglePreview(bool);
  };

  const addFile = (e) => {
    if (e.target.files[0].type.indexOf("image/") > -1) {
      const file = e.target.files[0];
      console.log(file);
      const fileURL = window.URL.createObjectURL(file);
      setImageFile(file);
      setPreviewAvatarUrl(fileURL);
    }
    setTogglePreview(true);
  };

  const resetAvatarState = () => {
    console.log("RESET AVATAR STATE");
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

  return (
    <>
      <div className="popup-wrapper">
        <IonLoading isOpen={isLoading} message={"Updating..."} />
        {togglePreview ? (
          <PreviewAvatar
            type="group"
            setIsLoading={setIsLoading}
            handleTogglePopup={handleTogglePreview}
            imageUrl={previewAvatarUrl}
            image={imageFile}
          />
        ) : null}

        <div
          className={`popup-container ${
            togglePopup ? "popup-show" : "popup-hide"
          }`}
        >
          <div className="camera-box" onClick={() => handleAvatarClick()}>
            <FontAwesomeIcon icon={faCamera} />
            <div className="plus-icon-box">
              <FontAwesomeIcon className="plus-icon" icon={faPlus} />
            </div>
            <input
              type="file"
              ref={fileRef}
              onChange={addFile}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
          <div className="name-box">
            <input
              id="name"
              type="text"
              placeholder="GROUP NAME"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div style={{ color: formRed }}>{error}</div>
          <div className="create-group-box">
            <Ripple.Button
              className="create-group-btn"
              onClick={() => handleCreateChat()}
            >
              Create
            </Ripple.Button>
          </div>
        </div>
        <div
          className="avatar-options-popup"
          style={toggleOptions ? { transform: "translate3d(0, 0%, 0)" } : null}
          // style={{ transform: "translate3d(0, 0%, 0)" }}
        >
          <Ripple.Div>
            <div>Take Photo</div>
          </Ripple.Div>
          <Ripple.Div onClick={() => handleToggleChooseAvatar()}>
            <div>Choose From Gallery</div>
          </Ripple.Div>
          {groupAvatar.length > 0 ? (
            <Ripple.Div onClick={() => handleToggleRemoveAvatar()}>
              <div>Remove Image</div>
            </Ripple.Div>
          ) : null}
        </div>
      </div>
      <div
        onClick={() => setToggleOptions(false)}
        className={`click-catcher ${
          toggleOptions ? "show-fade-half" : "hide-fade-half"
        }`}
        style={{ zIndex: "20" }}
      ></div>
      <div
        onClick={() => handleTogglePopup(false)}
        className={`click-catcher ${
          togglePopup ? "show-fade-half" : "hide-fade-half"
        }`}
      ></div>
    </>
  );
}

export default CreateGroup;
