import React, { useEffect, useState, useContext } from "react";
import { NavContext } from "../context/NavContext";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Ripple from "../components/Effects/Ripple";
import Avatar from "../components/Avatar";

function NewChat() {
  const [friends, setFriends] = useState([]);
  const { setNav } = useContext(NavContext);
  const { setUser, user } = useContext(UserContext);

  useEffect(() => {
    getFriends();
  }, []);

  const getFriends = async () => {
    const res = await fetch(`/api/friends/friends`);
    const data = await res.json();
    const friends = data.friends.map((obj) => {
      return {...obj, isVisible: true}
    })
    setFriends(friends);
  };

  const handleNavigation = (to) => {
    const direction = to === "/" ? 0 : 1;
    setNav({path: to, direction});
  };

  const handleCreateChat = async (userId) => {
    const res = await fetch(`/api/chats/new`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        isPrivate: true,
      }),
    });
    const data = await res.json();
    setUser({
      ...user,
      chats: [...user.chats, data.chatId],
    });
    handleNavigation(`/chat/${data.chatId}`);
  };

  const handleSearchUsers = (e) => {
    const query = e.target.value.toLowerCase();
    
    const friendsCopy = [...friends];
    const newFriends = friendsCopy.map((obj) => {
      if (obj.name && obj.name.toLowerCase().includes(query)) return {...obj, isVisible: true};
      if (obj.username && obj.username.toLowerCase().includes(query)) return {...obj, isVisible: true};
      return {...obj, isVisible: false}
    });

    setFriends(newFriends);
  };

  return (
    <div className="new-page page">
      <Header handleSearchUsers={handleSearchUsers} />
      <div className="scroll-wrapper">
        <Ripple.Div
          className="new-group-box"
          onClick={() => handleNavigation("/new/group")}
        >
          <FontAwesomeIcon icon={faUserFriends} className="check-icon" />
          <div className="new-group-label">Create New Group</div>
        </Ripple.Div>

        <ul className="users-list" style={friends.length > 0 ? {opacity: "1"} : null}>
          {friends.filter((obj) => obj.isVisible).map((e) => {
            return (
              <Ripple.Li key={e._id} onClick={() => handleCreateChat(e._id)}>
                <div className="section">
                  <Avatar
                    user={e}
                    style={{
                      width: "50px",
                      height: "50px",
                      fontSize: "22.5px",
                    }}
                  />
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
