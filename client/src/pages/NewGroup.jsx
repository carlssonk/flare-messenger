import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Jeb_ from "../imgs/Jens-Bergensten.png";
import Header from "../components/Header";

function NewGroup() {
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  useEffect(() => {
    getFriends();
  }, []);

  const getFriends = async () => {
    const res = await fetch(`/api/friends/friends`);
    const data = await res.json();
    setFriends(data.friends);
  };

  const handleSelectFriend = (username, id) => {
    if (selectedFriends.some((e) => e.id === id)) {
      const selectedFriendsCopy = [...selectedFriends];
      const updatedArray = selectedFriendsCopy.filter((e) => e.id !== id);
      setSelectedFriends(updatedArray);
    } else {
      setSelectedFriends((selectedFriends) => [
        ...selectedFriends,
        { username, id },
      ]);
    }
  };

  const isInArray = (id) => {
    if (selectedFriends.some((e) => e.id === id)) {
      return true;
    }
    return false;
  };

  return (
    <div className="new-page page">
      <Header />
      <div className="scroll-wrapper">
        <ul className="users-list">
          {friends.map((e) => {
            return (
              <li
                key={e._id}
                className={`mouse-active ${
                  isInArray(e._id) ? "users-selected" : null
                }`}
                onClick={() => handleSelectFriend(e.username, e._id)}
              >
                <div>
                  <div className="img-box">
                    <img src={Jeb_} alt="" />
                  </div>
                  <div className="name">{e.username}</div>
                </div>
                <div>
                  {isInArray(e._id) ? (
                    <FontAwesomeIcon icon={faCheck} className="check-icon" />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="create-chat-box">
        <button className="create-chat-btn">Create Group</button>
        <div className="padding"></div>
      </div>
    </div>
  );
}

export default NewGroup;
