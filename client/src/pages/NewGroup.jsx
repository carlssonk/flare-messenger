import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import { IonToast } from "@ionic/react";
import Ripple from "../components/Effects/Ripple";
import CreateGroup from "../components/NewGroup/CreateGroup";
import Avatar from "../components/Avatar";

function NewGroup() {
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedFriendsList, setSelectedFriendsList] = useState([]);
  const [isRemoving, setIsRemoving] = useState(false);
  const [togglePopup, setTogglePopup] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    getFriends();
  }, []);

  useEffect(() => {
    setIsFading(true);
    setTimeout(() => setIsFading(false), 250);
  }, [togglePopup]);

  const getFriends = async () => {
    const res = await fetch(`/api/friends/friends`);
    const data = await res.json();
    setFriends(data.friends);
  };

  const handleSelectFriend = (user) => {
    console.log(user);
    if (selectedFriends.some((e) => e._id === user._id)) {
      setIsRemoving(true);
      const selectedFriendsCopy = [...selectedFriends];
      const updatedArray = selectedFriendsCopy.filter(
        (e) => e._id !== user._id
      );

      setSelectedFriends(updatedArray);
      setTimeout(() => {
        setSelectedFriendsList(updatedArray);
        setIsRemoving(false);
      }, 250);
    } else {
      setSelectedFriends((selectedFriends) => [...selectedFriends, user]);
      setSelectedFriendsList((selectedFriendsList) => [
        ...selectedFriendsList,
        user,
      ]);
    }
  };

  const isInArray = (id) => {
    if (selectedFriends.some((e) => e._id === id)) {
      return true;
    }
    return false;
  };

  const handleTogglePopup = (bool) => {
    if (isFading) return; // to avoid spam
    setTogglePopup(bool);
  };

  // const handleCreateChat = async (userId) => {
  //   const res = await fetch(`/api/chats/new`, {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       userId,
  //       isPrivate: true,
  //     }),
  //   });
  //   const data = await res.json();
  //   handleNavigation(`/chat/${data.chatId}`);
  // };

  return (
    <div className="new-page page">
      <CreateGroup
        togglePopup={togglePopup}
        handleTogglePopup={handleTogglePopup}
      />
      <Header />
      <ul
        className={`selected-friends-list ${
          selectedFriends.length > 0 ? "list-active" : ""
        }`}
      >
        {selectedFriendsList.map((e) => {
          return (
            <li
              key={e._id}
              className={`${isInArray(e._id) ? "" : "remove-user"}`}
            >
              <div className="img-wrapper">
                <Avatar user={e} style={{ width: "50px", height: "50px" }} />
                <div
                  className="remove-btn"
                  onClick={() => handleSelectFriend(e)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </div>
              </div>

              <div className="name">{e.username}</div>
            </li>
          );
        })}
      </ul>
      <div className="scroll-wrapper">
        <ul className="users-list">
          {friends.map((e) => {
            return (
              <Ripple.Li
                key={e._id}
                className={`mouse-active ${
                  isInArray(e._id) ? "users-selected" : ""
                }`}
                onClick={() => (isRemoving ? null : handleSelectFriend(e))}
              >
                <div className="section">
                  <Avatar user={e} style={{ width: "50px", height: "50px" }} />
                  {/* <div className="img-box">
                    <img src={Jeb_} alt="" />
                  </div> */}
                  <div className="name">{e.username}</div>
                </div>
                <div>
                  {isInArray(e._id) ? (
                    <FontAwesomeIcon icon={faCheck} className="check-icon" />
                  ) : null}
                </div>
              </Ripple.Li>
            );
          })}
        </ul>
      </div>
      <div
        style={{
          bottom: "100px !important",
          paddingBottom: "100px !important",
          marginBottom: "100px !important",
        }}
      >
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Select at least 1 friend."
          position="top"
          duration={750}
          mode="ios"
        />
      </div>
      <div
        className="create-group-box"
        onClick={() =>
          selectedFriends.length <= 0
            ? setShowToast(true)
            : handleTogglePopup(true)
        }
      >
        <Ripple.Button className="create-group-btn">Create Group</Ripple.Button>
        <div className="padding"></div>
      </div>
    </div>
  );
}

export default NewGroup;
