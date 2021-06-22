import React, { useEffect, useState, useContext } from "react";
import { NavContext } from "../context/NavContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import Jeb_ from "../imgs/Jens-Bergensten.png";
import { useHistory } from "react-router-dom";
import Header from "../components/Header";

function NewChat() {
  const [friends, setFriends] = useState([]);
  const history = useHistory();
  const { setNav } = useContext(NavContext);

  useEffect(() => {
    getFriends();
  }, []);

  const getFriends = async () => {
    const res = await fetch(`/api/friends/friends`);
    const data = await res.json();
    setFriends(data.friends);
  };

  const handleNavigation = (to) => {
    if (to === "/") {
      setNav("backward");
    } else {
      setNav("forward");
    }
    // we need to give a small delay so our transition class appends on the DOM before we redirect
    setTimeout(() => history.push(to), 10);
  };

  return (
    <div className="new-page page">
      <Header />
      <div className="scroll-wrapper">
        <div onClick={() => handleNavigation("/new/group")}>
          <div className="new-group-box mouse-active">
            <FontAwesomeIcon icon={faUserFriends} className="check-icon" />
            <div className="new-group-label">Create New Group</div>
          </div>
        </div>

        <ul className="users-list">
          {friends.map((e) => {
            return (
              <li key={e._id} className="mouse-active">
                <div>
                  <div className="img-box">
                    <img src={Jeb_} alt="" />
                  </div>
                  <div className="name">{e.username}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default NewChat;
