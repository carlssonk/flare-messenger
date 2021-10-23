import React, { useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Ripple from "../Effects/Ripple";
import { NavContext } from "../../context/NavContext";

function Footer() {
  const { setNav } = useContext(NavContext);

  const handleNavigation = (to) => {
    const direction = to === "/" ? 0 : 1;
    setNav({path: to, direction});
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
