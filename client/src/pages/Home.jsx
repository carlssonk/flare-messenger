import React, { useEffect } from "react";
import { IonApp } from "@ionic/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Jeb_ from "../imgs/Jens-Bergensten.png";
import Header from "../components/Header";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Ripple from "../components/Effects/Ripple";
// import { Scroll } from "framer";

function Home() {
  // const [chatList, setChatList] = useState([]);

  useEffect(() => {
    getChats();
  }, []);

  const getChats = async () => {
    const res = await fetch("/api/chats");
    const data = await res.json();
    console.log(data);
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
          <Ripple.Li>
            <div className="img-box">
              <img src={Jeb_} alt="" />
            </div>
            <div className="text-box">
              <div className="friend">Jens Bergensten</div>
              <div className="message">The business plan looking goo...</div>
            </div>
            <div className="time-box">9:40 AM</div>
          </Ripple.Li>
          <Ripple.Li>
            <div className="img-box">
              <img src={Jeb_} alt="" />
            </div>
            <div className="text-box">
              <div className="friend">Jens Bergensten</div>
              <div className="message">The business plan looking goo...</div>
            </div>
            <div className="time-box">9:40 AM</div>
          </Ripple.Li>
          <li>
            <div className="img-box">
              <img src={Jeb_} alt="" />
            </div>
            <div className="text-box">
              <div className="friend">Jens Bergensten</div>
              <div className="message">The business plan looking goo...</div>
            </div>
            <div className="time-box">9:40 AM</div>
          </li>
          <li>
            <div className="img-box">
              <img src={Jeb_} alt="" />
            </div>
            <div className="text-box">
              <div className="friend">Jens Bergensten</div>
              <div className="message">The business plan looking goo...</div>
            </div>
            <div className="time-box">9:40 AM</div>
          </li>
          <li>
            <div className="img-box">
              <img src={Jeb_} alt="" />
            </div>
            <div className="text-box">
              <div className="friend">Jens Bergensten</div>
              <div className="message">The business plan looking goo...</div>
            </div>
            <div className="time-box">9:40 AM</div>
          </li>
          <li>
            <div className="img-box">
              <img src={Jeb_} alt="" />
            </div>
            <div className="text-box">
              <div className="friend">Jens Bergensten</div>
              <div className="message">The business plan looking goo...</div>
            </div>
            <div className="time-box">9:40 AM</div>
          </li>
          <li>
            <div className="img-box">
              <img src={Jeb_} alt="" />
            </div>
            <div className="text-box">
              <div className="friend">Jens Bergensten</div>
              <div className="message">The business plan looking goo...</div>
            </div>
            <div className="time-box">9:40 AM</div>
          </li>
          <li>
            <div className="img-box">
              <img src={Jeb_} alt="" />
            </div>
            <div className="text-box">
              <div className="friend">Jens Bergensten</div>
              <div className="message">The business plan looking goo...</div>
            </div>
            <div className="time-box">9:40 AM</div>
          </li>
          <li>
            <div className="img-box">
              <img src={Jeb_} alt="" />
            </div>
            <div className="text-box">
              <div className="friend">Jens Bergensten</div>
              <div className="message">The business plan looking goo...</div>
            </div>
            <div className="time-box">9:40 AM</div>
          </li>
          <li>
            <div className="img-box">
              <img src={Jeb_} alt="" />
            </div>
            <div className="text-box">
              <div className="friend">Jens Bergensten</div>
              <div className="message">The business plan looking goo...</div>
            </div>
            <div className="time-box">9:40 AM</div>
          </li>
          <li>
            <div className="img-box">
              <img src={Jeb_} alt="" />
            </div>
            <div className="text-box">
              <div className="friend">Jens Bergensten</div>
              <div className="message">The business plan looking goo...</div>
            </div>
            <div className="time-box">9:40 AM</div>
          </li>
          <li>
            <div className="img-box">
              <img src={Jeb_} alt="" />
            </div>
            <div className="text-box">
              <div className="friend">Jens Bergensten</div>
              <div className="message">The business plan looking goo...</div>
            </div>
            <div className="time-box">9:40 AM</div>
          </li>
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
