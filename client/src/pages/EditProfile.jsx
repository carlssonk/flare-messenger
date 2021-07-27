import React, { useContext } from "react";
import Ripple from "../components/Effects/Ripple";
import { NavContext } from "../context/NavContext";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import DeviceInfo from "../components/DeviceInfo";

function EditProfile() {
  const { setNav } = useContext(NavContext);
  const history = useHistory();

  const handleNavigation = (to) => {
    if (to === "/profile") {
      setNav("backward");
    } else {
      setNav("forward");
    }
    // we need to give a small delay so our transition class appends on the DOM before we redirect
    setTimeout(() => history.push(to), 10);
  };
  return (
    <div className="page edit-profile-page">
      <DeviceInfo />
      <div className="top-bar">
        <Ripple.Div
          className="back-arrow"
          onClick={() => handleNavigation("/profile")}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Ripple.Div>
      </div>
      <div>POGGERS</div>
    </div>
  );
}

export default EditProfile;
