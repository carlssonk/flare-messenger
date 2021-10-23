import React, { useContext, useState } from "react";
import Ripple from "../components/Effects/Ripple";
import { NavContext } from "../context/NavContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/UserContext";

import { IonLoading } from "@ionic/react";

function EditName() {
  const { setNav } = useContext(NavContext);
  const { setUser, user } = useContext(UserContext);

  const [name, setName] = useState(user.name);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (to) => {
    const direction = to === "/profile/edit" ? 0 : 1;
    setNav({path: to, direction})
  };

  const handleSaveName = async () => {
    if (name.length === 0) return;
    setIsLoading(true);
    const res = await fetch("/api/user/name", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setUser({
      ...user,
      name: data.name,
    });
    handleNavigation("/profile/edit");
  };

  return (
    <div className="page edit-name-page">
      <IonLoading isOpen={isLoading} message={"Updating..."} />
      <div className="top-bar">
        <Ripple.Div
          className="back-arrow"
          onClick={() => handleNavigation("/profile/edit")}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Ripple.Div>
      </div>
      <div className="main-content">
        <p>
          This is how you appear on Flare, so choose a name that your friends
          recognize.
        </p>
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Name"
          defaultValue={user.name}
          maxLength="20"
        />
      </div>

      <Ripple.Button className="save-btn" onClick={() => handleSaveName()}>
        Save
      </Ripple.Button>
    </div>
  );
}

export default EditName;
