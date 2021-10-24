import React, { useEffect, useState, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faPlus } from "@fortawesome/free-solid-svg-icons";
import { NavContext } from "../../context/NavContext";
import { UserContext } from "../../context/UserContext";
import { useHistory } from "react-router-dom";
import Ripple from "../../components/Effects/Ripple";
import { IonLoading } from "@ionic/react";
import PreviewAvatar from "../PreviewAvatar";
import Draggable from "react-draggable";
import { getImgSizeInfo } from "../../utils/previewAvatar";

import { hasImageCapture } from "../../utils/hasImageCapture"
import UserMediaAlert from "../UserMediaAlert";

const formRed = "#ff0042";

function CreateGroup({ handleTogglePopup, selectedFriends, setSelectedFriends, setSelectedFriendsList }) {
  const { setNav } = useContext(NavContext);
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();
  const fileRef = useRef(null);
  const nodeRef = useRef(null);
  const imageRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState("");
  const [togglePreview, setTogglePreview] = useState(false);
  const [toggleOptions, setToggleOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [toggleCameraAlert, setToggleCameraAlert] = useState(false);

  const [previewScale, setPreviewScale] = useState(0);
  const [previewX, setPreviewX] = useState(0);
  const [previewY, setPreviewY] = useState(0);

  const [imageTransform, setImageTransform] = useState({});

  const [togglePopupWait, setTogglePopupWait] = useState(true);

  const handleNavigation = (to) => {
    const direction = to === "/" ? 0 : 1;

    if (to === "/camera") {
      setNav({path: to, direction, state: { prevPath: history.location.pathname, selectedFriends }})
      return;
    }

    setNav({path: to, direction});
  };

  useEffect(() => {
    const state = history.location.state
    if (state && state.files) {
      setImageFile(state.files[0].file);
      setPreviewAvatarUrl(state.files[0].url);
      setSelectedFriends(state.selectedFriends);
      setSelectedFriendsList(state.selectedFriends);
      setTogglePreview(true);
    }
    // eslint-disable-next-line
  }, []);

  const handleCreateChat = async () => {
    if (name.length === 0) return setError("Choose a name for the group.");
    setError("");
    setIsLoading(true);

    const formData = new FormData();
    if (showImage) {
      formData.append("avatar", imageFile);
      formData.append("resize", JSON.stringify(imageTransform));
    }

    const users = selectedFriends.map((e) => e._id);
    formData.append("users", users);
    formData.append("name", name);

    const res = await fetch(`/api/chats/group`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setIsLoading(false);
    setUser({
      ...user,
      chats: [...user.chats, data.chatId],
    });
    handleNavigation(`/chat/${data.chatId}`);
  };

  const handleTogglePreview = (bool) => {
    setTogglePreview(bool);
    window.history.replaceState(null, "New Title");
  };

  const addFile = (e) => {
    if (e.target.files[0].type.indexOf("image/") > -1) {
      const file = e.target.files[0];
      const fileURL = window.URL.createObjectURL(file);
      setImageFile(file);
      setPreviewAvatarUrl(fileURL);
    }
    setTogglePreview(true);
  };

  const handleAvatarClick = () => {
    setToggleOptions(true);
  };

  const handleToggleChooseAvatar = () => {
    fileRef.current.click();
    setToggleOptions(false);
  };

  const handleToggleRemoveAvatar = () => {
    setShowImage(false);
    setToggleOptions(false);
    setImageFile(null);
    fileRef.current.value = "";
  };

  const getPreviewTransform = (circleSize, scale, x, y) => {
    setShowImage(true);

    const SIZE_INFO = getImgSizeInfo(imageRef.current);

    const addScaleY = imageRef.current.offsetHeight / SIZE_INFO.height;
    const addScaleX = imageRef.current.offsetWidth / SIZE_INFO.width;

    if (SIZE_INFO.width > SIZE_INFO.height) {
      setPreviewScale(scale * addScaleY);
    } else {
      setPreviewScale(scale * addScaleX);
    }

    const CAMERABOX_SIZE = 100;
    const reScale = CAMERABOX_SIZE / circleSize;
    setPreviewX(x * reScale);
    setPreviewY(y * reScale);
  };

  useEffect(() => {
    if (!togglePopupWait) setTimeout(() => handleTogglePopup(false), 250);
  }, [togglePopupWait, handleTogglePopup]);

  const toggleImageStyle = !showImage
    ? { visibility: "hidden", position: "absolute", width: "0", height: "0" }
    : null;

  return (
    <>
      <div className="popup-wrapper">
        <IonLoading isOpen={isLoading} message={"Creating group..."} />
        {togglePreview ? (
          <PreviewAvatar
            type="group"
            setIsLoading={setIsLoading}
            handleTogglePopup={handleTogglePreview}
            imageUrl={previewAvatarUrl}
            image={imageFile}
            getPreviewTransform={getPreviewTransform}
            setImageTransform={setImageTransform}
          />
        ) : null}

        <div
          className={`popup-container ${
            togglePopupWait ? "popup-show" : "popup-hide"
          }`}
        >
          <div
            className="camera-box"
            onClick={() => handleAvatarClick()}
            style={
              !showImage
                ? null
                : { overflow: "hidden", border: "none", display: "block" }
            }
          >
            <Draggable
              disabled={true}
              // defaultPosition={{ x: 0, y: 0 }}
              position={{ x: previewX, y: previewY }}
              nodeRef={nodeRef}
            >
              <div
                style={{
                  ...toggleImageStyle,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                <div
                  className="image-wrapper"
                  style={{
                    transform: `scale(${previewScale})`,
                    width: "100%",
                    height: "100%",
                    // transform: `scale3d(${previewScale},${previewScale},${previewScale})`,
                  }}
                >
                  <img src={previewAvatarUrl} ref={imageRef} alt="" />
                </div>
              </div>
            </Draggable>
            <div style={!showImage ? null : { display: "none" }}>
              <FontAwesomeIcon icon={faCamera} />
              <div className="plus-icon-box">
                <FontAwesomeIcon className="plus-icon" icon={faPlus} />
              </div>
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
              maxLength="30"
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
          {showImage ? (
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
        onClick={() => setTogglePopupWait(false)}
        className={`click-catcher ${
          togglePopupWait ? "show-fade-half" : "hide-fade-half"
        }`}
      ></div>
      <UserMediaAlert toggleCameraAlert={toggleCameraAlert} setToggleCameraAlert={setToggleCameraAlert} />
    </>
  );
}

export default CreateGroup;
