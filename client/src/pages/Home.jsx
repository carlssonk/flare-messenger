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
    setChats(data.chats);
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
