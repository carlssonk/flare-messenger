import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import { IonToast } from "@ionic/react";
import Ripple from "../components/Effects/Ripple";
import CreateGroup from "../components/NewGroup/CreateGroup";
import Avatar from "../components/Avatar";
import { useHistory } from "react-router-dom";

function NewGroup() {

  const history = useHistory();

  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedFriendsList, setSelectedFriendsList] = useState([]);
  const [isRemoving, setIsRemoving] = useState(false);
  const [togglePopup, setTogglePopup] = useState(false);
  const [showToast, setShowToast] = useState(false);

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

  const handleSelectFriend = (user) => {
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
    setTogglePopup(bool);
  };

  useEffect(() => {
    const state = history.location.state
    if (state && state.files) {
      setTogglePopup(true);
    }
  },[history.location.state])

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

  useEffect(() => {
    console.log(selectedFriends)
  }, [selectedFriends])

  return (
    <div className="new-page page">
      {togglePopup ? (
        <CreateGroup
          handleTogglePopup={handleTogglePopup}
          selectedFriends={selectedFriends}
          setSelectedFriends={setSelectedFriends}
          setSelectedFriendsList={setSelectedFriendsList}
        />
      ) : null}

      <Header handleSearchUsers={handleSearchUsers} />
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
                <Avatar
                  user={e}
                  style={{ width: "50px", height: "50px", fontSize: "22.5px" }}
                />
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
          {friends.filter((obj) => obj.isVisible).map((e) => {
            return (
              <Ripple.Li
                key={e._id}
                className={`mouse-active ${
                  isInArray(e._id) ? "users-selected" : ""
                }`}
                onClick={() => (isRemoving ? null : handleSelectFriend(e))}
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
