import React from "react";
import RippleButton from "../components/effects/RippleButton";
import { IonRippleEffect, IonApp } from "@ionic/react";
import Ripple from "react-ripples";
// import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Jeb_ from "../imgs/Jens-Bergensten.png";
import Header from "../components/Header";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
// import { Scroll } from "framer";

function Home() {
  // const containerVariants = {
  //   hidden: {
  //     opacity: 0,
  //     scale: 0.7,
  //   },
  //   visible: {
  //     opacity: 1,
  //     scale: 1,
  //     transition: { ease: "easeInOut", duration: 0.2 },
  //   },
  //   exit: {
  //     opacity: 0,
  //     transition: { ease: "easeInOut", duration: 0.2 },
  //     scale: 0.7,
  //   },
  // };

  return (
    <IonApp className="home-page page">
      <Header />
      <div className="chat-list">
        {/* <Scroll
          style={{ height: "100%", width: "100%", position: "relative" }}
          dragElastic={0.2}
        > */}
        <ul>
          {/* <li> */}
          <RippleButton>
            <div className="img-box">
              <img src={Jeb_} alt="" />
            </div>
            <div className="text-box">
              <div className="friend">Jens Bergensten</div>
              <div className="message">The business plan looking goo...</div>
            </div>
            <div className="time-box">9:40 AM</div>
          </RippleButton>
          {/* </li> */}
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
          <RippleButton scale={1} className="camera-box">
            {/* <div className="camera-box"> */}
            <FontAwesomeIcon icon={faCamera} />
            {/* </div> */}
          </RippleButton>
        </div>
        <div className="blur"></div>
      </div>
    </IonApp>
  );
}

export default Home;
{
  /* <FontAwesomeIcon icon={faCamera} /> */
}
