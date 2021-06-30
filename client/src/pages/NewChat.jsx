import React, { useEffect, useState, useContext } from "react";
import { NavContext } from "../context/NavContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import Jeb_ from "../imgs/Jens-Bergensten.png";
import { useHistory } from "react-router-dom";
import Header from "../components/Header";
import Ripple from "../components/effects/Ripple";
import { Link } from "react-router-dom";

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
        {/* <div > */}
        <Ripple.Div
          className="new-group-box"
          onClick={() => handleNavigation("/new/group")}
        >
          <FontAwesomeIcon icon={faUserFriends} className="check-icon" />
          <div className="new-group-label">Create New Group</div>
        </Ripple.Div>
        {/* </div> */}

        <ul className="users-list">
          {friends.map((e) => {
            return (
              <Ripple.Li key={e._id}>
                <div>
                  <div className="img-box">
                    <img src={Jeb_} alt="" />
                  </div>
                  <div className="name">{e.username}</div>
                </div>
              </Ripple.Li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default NewChat;
