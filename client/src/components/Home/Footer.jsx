import React, { useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Ripple from "../Effects/Ripple";
import { NavContext } from "../../context/NavContext";
import { useHistory } from "react-router-dom";

function Footer() {
  const { setNav } = useContext(NavContext);
  const history = useHistory();

  const handleNavigation = (to) => {
    if (to === "/") {
      setNav("backward");
    } else {
      setNav("forward");
    }
    setTimeout(() => history.push(to), 10);
  };

  return (
    <div className="footer-wrapper">
      <div className="footer">
        <Ripple.Div
          className="camera-box"
          onClick={() => handleNavigation("/camera")}
        >
          <FontAwesomeIcon icon={faCamera} />
        </Ripple.Div>
      </div>
      <div className="blur"></div>
    </div>
  );
}

export default Footer;
