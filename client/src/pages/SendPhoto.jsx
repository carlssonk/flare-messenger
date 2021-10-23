import React, { useState, useEffect, useContext } from "react";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChatList from "../components/Home/ChatList";
import Ripple from "../components/Effects/Ripple";
import { NavContext } from "../context/NavContext";
import Header from "../components/Header";
import { useHistory } from "react-router-dom";
import { IonLoading } from "@ionic/react";

function SendPhoto() {
  // const [friends, setFriends] = useState([]);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  // const { user } = useContext(UserContext);
  const { setNav } = useContext(NavContext);

  const handleNavigation = (to) => {
    const direction = to === "/" ? 0 : 1;
    setNav({path: to, direction});
  };

  useEffect(() => {
    const getChats = async () => {
      const res = await fetch("/api/chats");
      const data = await res.json();
      handleSortChat(data.chats);
    };
    getChats();
    // getFriends();
  }, []);

  const handleSortChat = (chat) => {
    const sortedChat = chat.sort(function (a, b) {
      return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
    });
    setChats(sortedChat);
  };

  // const getFriends = async () => {
  //   const res = await fetch(`/api/friends/friends`);
  //   const data = await res.json();
  //   const friends = data.friends.map((obj) => {
  //     obj.isSelected = false;
  //     return obj;
  //   });
  //   setFriends(friends);
  // };

  // const handleSelectFriend = (id) => {
  //   const friendsCopy = [...friends];
  //   const newFriends = friendsCopy.map((e) => {
  //     if (e._id === id) e.isSelected = !e.isSelected;
  //     return e;
  //   });

  //   setFriends(newFriends);
  // };

  const handleSendPhoto = async () => {
    setIsLoading(true);
    const photo = history.location.state.files[0];
    console.log(photo)
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

    setTimeout(() => {
      setIsLoading(false);
    }, 500)
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
      <IonLoading isOpen={isLoading} message={"Sending..."} />
    </>
  );
}

export default SendPhoto;
