import React, { useEffect, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Home/Footer";
import ChatList from "../components/Home/ChatList";

function Home() {
  const [chats, setChats] = useState([]);

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
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    // console.log(sortedChat);
    setChats(sortedChat);
  };

  return (
    <div className="home-page page">
      <Header />
      <ChatList chats={chats} />
      <Footer />
    </div>
  );
}

export default Home;
