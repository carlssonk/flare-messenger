import React, { useContext, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Ripple from "../Effects/Ripple";
import { NavContext } from "../../context/NavContext";
import { hasImageCapture } from "../../utils/hasImageCapture"
import UserMediaAlert from "../UserMediaAlert";


function Footer() {
  const { setNav } = useContext(NavContext);

  const [toggleCameraAlert, setToggleCameraAlert] = useState(false);

  const handleNavigation = (to) => {
    const direction = to === "/" ? 0 : 1;
    setNav({path: to, direction});
  };

  return (
    <div className="footer-wrapper">
      <div className="footer">
        <Ripple.Div
          className="camera-box"
          onClick={() => {
            if (!hasImageCapture()) return setToggleCameraAlert(true);
            handleNavigation("/camera")
          }}
        >
          <FontAwesomeIcon icon={faCamera} />
        </Ripple.Div>
      </div>
      <div className="blur"></div>
      <UserMediaAlert toggleCameraAlert={toggleCameraAlert} setToggleCameraAlert={setToggleCameraAlert} />
    </div>
  );
}

export default Footer;
