import React, { useEffect, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Home/Footer";
import ChatList from "../components/Home/ChatList";

function Home() {
  const [chats, setChats] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [toggleEditChat, setToggleEditChat] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);
  const [hasIncomingRequests, setHasIncomingRequests] = useState(false);

  useEffect(() => {
    const getChats = async () => {
      const res = await fetch("/api/chats");
      const data = await res.json();
      handleSortChat(data.chats);
      setHasIncomingRequests(data.hasIncomingRequests);
    };
    getChats();
  }, []);

  const handleSortChat = (chat) => {
    console.log(chat);
    const sortedChat = chat.sort(function (a, b) {
      return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
    });
    setChats(sortedChat);
    setAllChats(sortedChat);
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

  const handleSearchChats = (e) => {
    const query = e.target.value.toLowerCase();

    if (query.length === 0) return setChats(allChats);

    const chatsCopy = [...allChats];
    const newChats = chatsCopy.filter((obj) => {
      if (obj.name && obj.name.toLowerCase().includes(query)) return obj;
      if (obj.users[0].name.toLowerCase().includes(query)) return obj;
      if (obj.users[0].username.toLowerCase().includes(query)) return obj;
    });

    setChats(newChats);
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
        chats={chats}
        setChats={setChats}
        toggleEditChat={toggleEditChat}
        setToggleEditChat={setToggleEditChat}
        selectedChats={selectedChats}
        handleSearchChats={handleSearchChats}
        hasIncomingRequests={hasIncomingRequests}
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
