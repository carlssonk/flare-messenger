import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Ripple from "../Effects/Ripple";

function Footer() {
  return (
    <div className="footer-wrapper">
      <div className="footer">
        <Ripple.Div className="camera-box">
          <FontAwesomeIcon icon={faCamera} />
        </Ripple.Div>
      </div>
      <div className="blur"></div>
    </div>
  );
}

export default Footer;
