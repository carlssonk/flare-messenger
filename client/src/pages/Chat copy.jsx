import React, { useState, useRef, useEffect } from "react";
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
  faGrinSquintTears,
} from "@fortawesome/free-solid-svg-icons";
import Jeb_ from "../imgs/Jens-Bergensten.png";
import Ripple from "../components/effects/Ripple";

function Chat() {
  const spanRef = useRef();
  const inputRef = useRef();
  const [text, setText] = useState("");
  const [sub, setSub] = useState(0);
  const [count, setCount] = useState(0);
  const [currentRowCount, setCurrentRowCount] = useState(0);
  const [rowHistory, setRowHistory] = useState([]);
  const [rows, setRows] = useState(1);
  const [autoRow, setAutoRow] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO
  // When text breaks to new line we need to:
  // Edit rowHistory for that line
  // And set sub

  useEffect(() => {
    console.log(currentRowCount);
  }, [currentRowCount]);

  const handleInputChange = (e) => {
    if (isSubmitting) return;
    const string = e.target.value;
    setText(string);
    spanRef.current.innerText = string.substring(sub);

    addRowCount(string);
    setRows(string.split(/\r\n|\r|\n/).length + autoRow);

    if (endOfRowAndGoingForward(string)) {
      if (string[string.length - 1] === " ") return;
      console.log("FORWARD");
      handleAddLine(string);
    }

    if (beginningOfRowAndGoingBackward(string)) {
      console.log("BACK");
      handleRemoveLine(string);
    }

    if (string.length === 0) {
      resetInput();
    }
  };

  const endOfRowAndGoingForward = (string) => {
    console.log(spanRef.current.offsetWidth);
    console.log(inputRef.current.offsetWidth);
    return (
      string.length > text.length &&
      spanRef.current.offsetWidth >= inputRef.current.offsetWidth
    );
  };

  const beginningOfRowAndGoingBackward = (string) => {
    return string.length < text.length && sub === string.length;
  };

  const handleAddLine = (string) => {
    setRowHistory((rowHistory) => [...rowHistory, currentRowCount]); // set count for this row
    setSub((sub) => sub + currentRowCount); // set substring length
    setCurrentRowCount(1); // reset count

    setAutoRow((autoRow) => autoRow + 1);
    setRows(string.split(/\r\n|\r|\n/).length + autoRow + 1);
  };

  const handleRemoveLine = (string) => {
    setSub((sub) => sub - rowHistory[rowHistory.length - 1]);
    setCurrentRowCount(rowHistory[rowHistory.length - 1]);

    if (rowHistory.length > 1) {
      removeLastItemRowHistory();
    }

    setAutoRow((autoRow) => autoRow - 1);
    setRows(string.split(/\r\n|\r|\n/).length + autoRow - 1);
  };

  const addRowCount = (string) => {
    if (string.length > text.length) {
      if (string.length <= currentRowCount) return;
      // console.log(rowHistory);
      setCurrentRowCount((count) => count + 1);
    }
  };

  const removeLastItemRowHistory = () => {
    const arr = [...rowHistory];
    arr.splice(arr.length - 1, 1);
    setRowHistory(arr);
  };

  const calculateHeight = () => {
    let height = 40;

    if (rows === 2) height = 50;
    if (rows === 3) height = 70;
    if (rows === 4) height = 90;
    if (rows === 5) height = 110;
    if (rows >= 6) height = 130;

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
    spanRef.current.innerText = "";
    setText("");
    setCurrentRowCount(0);
    setRowHistory([]);
    setSub(0);
    setRows(1);
    setAutoRow(0);
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
        <Ripple.Div className="icon-outside">
          <FontAwesomeIcon icon={faCamera} />
        </Ripple.Div>
        <Ripple.Div className="icon-outside">
          <FontAwesomeIcon icon={faImages} />
        </Ripple.Div>
        <div
          className="input-box"
          style={{
            height: `${calculateHeight()}px`,
            marginRight: text.length > 0 ? "56px" : "",
            transition: rows === 1 && text.length <= 1 ? "100ms" : "0ms",
          }}
        >
          <Ripple.Div>
            <FontAwesomeIcon icon={faGrinSquintTears} />
          </Ripple.Div>
          <form>
            <textarea
              onKeyDown={(e) => listenSubmit(e)}
              onChange={(e) => handleInputChange(e)}
              value={text}
              type="text"
              placeholder="Enter Message"
              style={{ padding: rows > 1 ? "4px 0" : "10px 0" }}
              ref={inputRef}
            />
          </form>
          {text.length > 0 ? null : (
            <Ripple.Div>
              <FontAwesomeIcon icon={faMicrophone} />
            </Ripple.Div>
          )}
        </div>
        <Ripple.Div
          onClick={handleSubmit}
          className="send-btn"
          style={{ right: text.length > 0 ? "0" : "" }}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </Ripple.Div>
      </div>
      <span
        style={{ padding: rows > 1 ? "4px 0" : "10px 0" }}
        className="measure-text-length"
        ref={spanRef}
      ></span>
    </div>
  );
}

export default Chat;
