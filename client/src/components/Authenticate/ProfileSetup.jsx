import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faPlus } from "@fortawesome/free-solid-svg-icons";

function ProfileSetup() {
  // const [imageFile, setImageFile] = useState(null);
  // const [togglePopup, setTogglePopup] = useState(false);

  // const addFile = (e) => {
  //   if (e.target.files[0].type.indexOf("image/") > -1) {
  //     const file = e.target.files[0];
  //     const fileURL = window.URL.createObjectURL(file);
  //     setImageFile(file);
  //     setPreviewAvatarUrl(fileURL);
  //   }
  //   setTogglePopup(true);
  // };

  return (
    <div className="page setup-page">
      {/* <PreviewAvatar
        togglePopup={togglePopup}
        handleTogglePopup={handleTogglePopup}
        imageUrl={previewAvatarUrl}
        image={imageFile}
      /> */}
      <div>
        <h4>Setup Profile</h4>
      </div>
      <div className="main-content">
        <div className="section top">
          <div className="upload-camera-box">
            <FontAwesomeIcon icon={faCamera} />
            <div className="plus-icon-box">
              <FontAwesomeIcon className="plus-icon" icon={faPlus} />
            </div>
          </div>
          <label className="label camera-label">Upload Avatar</label>
        </div>
        <div className="section">
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Display Name (e.g. John Smith)"
          />
        </div>
      </div>
      <div className="bottom-bar">
        <button className="skip-btn">Skip</button>
        <button className="next-btn" disabled>
          Next
        </button>
      </div>
    </div>
  );
}

export default ProfileSetup;
