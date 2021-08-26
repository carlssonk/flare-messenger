import React, { useState, useEffect, useContext } from "react";
import { faCheck, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Avatar from "../components/Avatar";
import Ripple from "../components/Effects/Ripple";
import { UserContext } from "../context/UserContext";
import Header from "../components/Header";
import { useHistory } from "react-router-dom";

function SendPhoto() {
  const [friends, setFriends] = useState([]);
  const [chats, setChats] = useState([]);
  const history = useHistory();
  const { user } = useContext(UserContext);

  useEffect(() => {
    // const getChats = async () => {
    //   const res = await fetch("/api/chats");
    //   const data = await res.json();
    //   handleSortChat(data.chats);
    // };
    // getChats();
    getFriends();
  }, []);

  const getFriends = async () => {
    const res = await fetch(`/api/friends/friends`);
    const data = await res.json();
    const friends = data.friends.map((obj) => {
      obj.isSelected = false;
      return obj;
    });
    setFriends(friends);
  };

  const handleSelectFriend = (id) => {
    const friendsCopy = [...friends];

    console.log(friendsCopy[0]._id);
    console.log(id);
    const newFriends = friendsCopy.map((e) => {
      if (e._id === id) e.isSelected = !e.isSelected;
      return e;
    });

    setFriends(newFriends);
    console.log(history.location.state.files);
  };

  const handleSendPhoto = async () => {
    const photo = history.location.state.files[0];
    let formData = new FormData();
    formData.append("photo", photo);
    console.log(user);
    console.log(friends);
    // await (
    //   await fetch(`/api/messages/photo`, {
    //     method: "POST",
    //     body: formData,
    //   })
    // ).json();
    console.log("REDIRECT TO CHAT LIST");
  };

  return (
    <div className="page send-photo-page">
      <Header />
      <div className="scroll-wrapper">
        <ul className="users-list">
          {friends.map((e) => {
            return (
              <Ripple.Li
                key={e._id}
                className={`mouse-active ${
                  e.isSelected ? "users-selected" : ""
                }`}
                onClick={() => handleSelectFriend(e._id)}
              >
                <div className="section">
                  <Avatar
                    user={e}
                    style={{
                      width: "50px",
                      height: "50px",
                      fontSize: "22.5px",
                    }}
                  />
                  <div
                    className="name"
                    style={e.isSelected ? { color: "#1bbbbb" } : null}
                  >
                    {e.username}
                  </div>
                </div>
                <div>
                  {e.isSelected ? (
                    <FontAwesomeIcon icon={faCheck} className="check-icon" />
                  ) : null}
                </div>
              </Ripple.Li>
            );
          })}
        </ul>
      </div>
      {friends.filter((e) => e.isSelected).length > 0 ? (
        <Ripple.Button className="send-btn" onClick={() => handleSendPhoto()}>
          Send <FontAwesomeIcon icon={faPaperPlane} />
        </Ripple.Button>
      ) : null}
    </div>
  );
}

export default SendPhoto;
