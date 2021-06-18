import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Profile() {
  const { setUser } = useContext(UserContext);

  const handleLogout = async () => {
    await fetch(`/api/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    setUser(null);
  };

  return (
    <div>
      <button onClick={handleLogout}>LOG OUT</button>
    </div>
  );
}

export default Profile;
