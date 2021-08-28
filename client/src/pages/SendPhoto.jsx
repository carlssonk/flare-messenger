import React, { useState, useEffect, useContext } from "react";
import { faCheck, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChatList from "../components/Home/ChatList";

import Avatar from "../components/Avatar";
import Ripple from "../components/Effects/Ripple";
import { UserContext } from "../context/UserContext";
import { NavContext } from "../context/NavContext";
import Header from "../components/Header";
import { useHistory } from "react-router-dom";
import { IonLoading } from "@ionic/react";

function SendPhoto() {
  const [friends, setFriends] = useState([]);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const { user } = useContext(UserContext);
  const { setNav } = useContext(NavContext);

  const handleNavigation = (to) => {
    if (to === "/") {
      setNav("backward");
    } else {
      setNav("forward");
    }
    setTimeout(() => history.push(to), 10);
  };

  useEffect(() => {
    const getChats = async () => {
      const res = await fetch("/api/chats");
      const data = await res.json();
      handleSortChat(data.chats);
    };
    getChats();
    getFriends();
  }, []);

  const handleSortChat = (chat) => {
    const sortedChat = chat.sort(function (a, b) {
      return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
    });
    setChats(sortedChat);
    console.log(sortedChat);
  };

  const getFriends = async () => {
    const res = await fetch(`/api/friends/friends`);
    const data = await res.json();
    const friends = data.friends.map((obj) => {
      obj.isSelected = false;
      return obj;
    });
    console.log(friends);
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
    setIsLoading(true);
    const photo = history.location.state.files[0];
    let formData = new FormData();
    formData.append("photo", photo.file);
    formData.append("chats", selectedChats);
    await (
      await fetch(`/api/messages/photo`, {
        method: "POST",
        body: formData,
      })
    ).json();
    handleNavigation("/");
  };

  const [selectedChats, setSelectedChats] = useState([]);

  const handleSelectChatImg = (id) => {
    if (selectedChats.some((item) => item === id)) {
      const copySelectedChats = [...selectedChats];
      const newSelectedChats = copySelectedChats.filter((item) => item !== id);
      return setSelectedChats(newSelectedChats);
    }
    setSelectedChats((prev) => [...prev, id]);
  };

  useEffect(() => {
    console.log(selectedChats);
  }, [selectedChats]);

  return (
    <>
      <div className="page send-photo-page">
        <Header />
        <ChatList
          chats={chats}
          sendImage={true}
          handleSelectChatImg={handleSelectChatImg}
          selectedChats={selectedChats}
        />

        {selectedChats.length > 0 ? (
          <Ripple.Button className="send-btn" onClick={() => handleSendPhoto()}>
            Send <FontAwesomeIcon icon={faPaperPlane} />
          </Ripple.Button>
        ) : null}
      </div>
      <IonLoading isOpen={isLoading} message={"Sending..."} duration={500} />
    </>
  );
}

export default SendPhoto;
