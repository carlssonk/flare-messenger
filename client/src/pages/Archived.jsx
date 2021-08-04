import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ChatList from "../components/Home/ChatList";

function Archived() {
  const [chats, setChats] = useState([]);
  const [toggleEditChat, setToggleEditChat] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);

  useEffect(() => {
    const getChats = async () => {
      const res = await fetch("/api/chats");
      const data = await res.json();
      handleSortChat(data.chats);
    };
    getChats();
  }, []);

  const handleSortChat = (chat) => {
    const sortedChat = chat.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setChats(sortedChat);
  };

  const handleEditChat = (e, chat, action) => {
    e.preventDefault();
    setToggleEditChat(true);

    if (action === "add") {
      setSelectedChats((selectedChats) => [...selectedChats, chat]);
    }

    if (action === "remove") {
      const selectedChatsCopy = [...selectedChats];
      const updatedArray = selectedChatsCopy.filter((e) => e._id !== chat._id);
      setSelectedChats(updatedArray);
    }
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
        page="archived"
        chats={chats}
        setChats={setChats}
        toggleEditChat={toggleEditChat}
        setToggleEditChat={setToggleEditChat}
        selectedChats={selectedChats}
      />

      <ChatList
        chats={chats}
        page="archived"
        handleEditChat={handleEditChat}
        selectedChats={selectedChats}
        toggleEditChat={toggleEditChat}
        setToggleEditChat={setToggleEditChat}
      />
    </div>
  );
}

export default Archived;
