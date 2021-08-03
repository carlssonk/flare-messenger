import React, { useEffect, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Home/Footer";
import ChatList from "../components/Home/ChatList";

function Home() {
  const [chats, setChats] = useState([]);
  const [toggleEditChat, setToggleEditChat] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);

  useEffect(() => {
    getChats();
  }, []);

  const getChats = async () => {
    const res = await fetch("/api/chats");
    const data = await res.json();
    handleSortChat(data.chats);
  };

  const handleSortChat = (chat) => {
    const sortedChat = chat.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    // console.log(sortedChat);
    console.log(sortedChat);
    setChats(sortedChat);
  };

  // useEffect(() => {
  //   document.addEventListener(
  //     "contextmenu",
  //     function (e) {
  //       alert("You've tried to open context menu"); //here you draw your own menu
  //       e.preventDefault();
  //     },
  //     false
  //   );
  // }, []);

  const handleEditChat = (e, chatId, action) => {
    e.preventDefault();
    setToggleEditChat(true);

    console.log(action);

    if (action === "add") {
      setSelectedChats((selectedChats) => [...selectedChats, chatId]);
    }

    if (action === "remove") {
      const selectedChatsCopy = [...selectedChats];
      const updatedArray = selectedChatsCopy.filter((e) => e !== chatId);
      // console.log();
      console.log(updatedArray);
      setSelectedChats(updatedArray);
      // setSelectedChats((selectedChats) => [...selectedChats, chatId]);
    }
    console.log("EDIT CHAT " + chatId);
  };

  useEffect(() => {
    if (selectedChats.length === 0) setToggleEditChat(false);
  }, [selectedChats]);

  useEffect(() => {
    if (!toggleEditChat) setSelectedChats([]);
  }, [toggleEditChat]);

  return (
    <div className="home-page page">
      <Header
        toggleEditChat={toggleEditChat}
        setToggleEditChat={setToggleEditChat}
      />
      <ChatList
        chats={chats}
        handleEditChat={handleEditChat}
        selectedChats={selectedChats}
        toggleEditChat={toggleEditChat}
        setToggleEditChat={setToggleEditChat}
      />
      <Footer />
    </div>
  );
}

export default Home;
