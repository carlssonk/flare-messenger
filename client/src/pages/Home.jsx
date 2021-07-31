import React, { useEffect, useContext, useState } from "react";
import { IonApp } from "@ionic/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../components/Header";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Ripple from "../components/Effects/Ripple";
import { NavContext } from "../context/NavContext";
import { useHistory } from "react-router-dom";

function Home() {
  const [chats, setChats] = useState([]);
  const { setNav } = useContext(NavContext);
  const history = useHistory();

  const handleNavigation = (to) => {
    if (to === "/") {
      setNav("backward");
    } else {
      setNav("forward");
    }
    // we need to give a small delay so our transition class appends on the DOM before we redirect
    setTimeout(() => history.push(to), 10);
  };

  useEffect(() => {
    getChats();
  }, []);

  const getChats = async () => {
    const res = await fetch("/api/chats");
    const data = await res.json();
    console.log(data);
    setChats(data.chats);
  };

  return (
    <IonApp className="home-page page">
      <Header />
      <div className="chat-list">
        {/* <Scroll
          style={{ height: "100%", width: "100%", position: "relative" }}
          dragElastic={0.2}
        > */}
        <ul>
          {chats &&
            chats.map((e) => {
              return (
                <Ripple.Li
                  key={e._id}
                  onClick={() => handleNavigation(`/chat/${e._id}`)}
                >
                  <div
                    className="img-box"
                    style={
                      e.users[0].avatar.path
                        ? null
                        : { backgroundColor: e.users[0].avatar.hexCode }
                    }
                  >
                    {e.users[0].avatar.path ? null : (
                      <div className="avatar-label">
                        {e.users[0].username.substring(0, 1)}
                      </div>
                    )}
                    <img
                      src={e.users[0].avatar.path}
                      alt=""
                      style={
                        e.users[0].avatar.path ? null : { display: "none" }
                      }
                    />
                  </div>
                  <div className="text-box">
                    <div className="friend">{e.users[0].name}</div>
                    <div className="message">{e.text}</div>
                  </div>
                  <div className="time-box">{e.createdAt}</div>
                </Ripple.Li>
              );
            })}

          <div className="bottom-space"></div>
        </ul>
        {/* </Scroll> */}
      </div>

      {/* <div className="bottom">HOasdasdME</div> */}
      <div className="footer-wrapper">
        <div className="footer">
          <Ripple.Div className="camera-box">
            {/* <div className="camera-box"> */}
            <FontAwesomeIcon icon={faCamera} />
            {/* </div> */}
          </Ripple.Div>
        </div>
        <div className="blur"></div>
      </div>
    </IonApp>
  );
}

export default Home;
