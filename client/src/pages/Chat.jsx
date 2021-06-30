import React, { useState } from "react";
import DeviceInfo from "../components/DeviceInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faPhoneAlt,
  faVideo,
  faEllipsisV,
  faCamera,
  faImages,
  faSmile,
  faPaperPlane,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import Jeb_ from "../imgs/Jens-Bergensten.png";
import Ripple from "../components/effects/Ripple";

function Chat() {
  const [text, setText] = useState("");
  const [rows, setRows] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    if (isSubmitting) return;
    setText(e.target.value);

    const string = e.target.value;
    setRows(string.split(/\r\n|\r|\n/).length);
  };

  const calculateHeight = () => {
    let height = 40;

    if (rows === 2) height = 50;
    if (rows === 3) height = 70;
    if (rows === 4) height = 90;
    if (rows === 5) height = 110;
    if (rows === 6) height = 130;
    if (rows === 7) height = 150;
    if (rows >= 8) height = 170;

    if (isSubmitting) height = 40;

    return height;
  };

  const listenSubmit = (e) => {
    if (e.keyCode == 13)
      if (!e.shiftKey) {
        handleSubmit();
      }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    resetInput();
    alert("SUBMIT");
    setTimeout(() => setIsSubmitting(false), 200);
  };

  const resetInput = () => {
    setText("");
    setRows(1);
  };

  return (
    <div className="chat-page page">
      <div className="header-wrapper">
        <div className="header">
          <DeviceInfo />
          <div className="top-bar">
            <div className="left-section">
              <Ripple.Div className="back-arrow">
                <FontAwesomeIcon icon={faChevronLeft} />
              </Ripple.Div>

              <div className="user-box">
                <div className="img-box-wrapper">
                  <div className="img-box">
                    <img src={Jeb_} alt="" />
                  </div>
                </div>

                <div className="text-box">
                  <div className="name">Jeb_</div>
                  <div className="status">Currently Active</div>
                </div>
              </div>
            </div>
            <div className="right-section">
              <Ripple.Div>
                <FontAwesomeIcon icon={faPhoneAlt} />
              </Ripple.Div>
              <Ripple.Div>
                <FontAwesomeIcon icon={faVideo} />
              </Ripple.Div>
              <Ripple.Div>
                <FontAwesomeIcon icon={faEllipsisV} />
              </Ripple.Div>
            </div>
          </div>
        </div>
        <div className="blur"></div>
      </div>
      <div className="message-container">
        <ul className="message-list"></ul>
      </div>
      <div className="controller-container">
        <Ripple.Div className="icon-left">
          <FontAwesomeIcon icon={faCamera} />
        </Ripple.Div>
        <Ripple.Div className="icon-left">
          <FontAwesomeIcon icon={faImages} />
        </Ripple.Div>
        <div
          className="input-box"
          style={{
            height: `${calculateHeight()}px`,
          }}
        >
          <Ripple.Div>
            <FontAwesomeIcon icon={faSmile} />
          </Ripple.Div>
          <form>
            <textarea
              onKeyDown={(e) => listenSubmit(e)}
              onChange={(e) => handleInputChange(e)}
              value={text}
              type="text"
              placeholder="Enter Message"
              style={{ padding: rows > 1 ? "4px 0" : "10px 0" }}
            />
          </form>
          {text.length > 0 ? (
            <Ripple.Div onClick={handleSubmit}>
              <FontAwesomeIcon icon={faPaperPlane} className="send-btn" />
            </Ripple.Div>
          ) : (
            <Ripple.Div>
              <FontAwesomeIcon icon={faMicrophone} />
            </Ripple.Div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
