import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import DeviceInfo from "../components/DeviceInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavContext } from "../context/NavContext";
import {
  faChevronLeft,
  faPhoneAlt,
  faVideo,
  faEllipsisV,
  faCamera,
  faImages,
  faPaperPlane,
  faMicrophone,
  faGrinSquintTears,
} from "@fortawesome/free-solid-svg-icons";
import Jeb_ from "../imgs/Jens-Bergensten.png";
import Ripple from "../components/effects/Ripple";
import { useLocation, useHistory } from "react-router-dom";

import { Editor, EditorState, getDefaultKeyBinding } from "draft-js";
import "draft-js/dist/Draft.css";

const draftUtils = require("draftjs-utils");

function Chat() {
  const location = useLocation();
  const history = useHistory();

  const [friends, setFriends] = useState([]);

  const inputRef = useRef(null);
  const editorWrapper = useRef(null);
  const editorContainer = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep this state even if its not used, we use the value from the state but not the state itself,
  // because the value itself is more responsive than the state.
  const [editorHeight, setEditorHeight] = useState(0);
  const [editorMaxWidth, setEditorMaxWidth] = useState(0);
  useMemo(
    () => ({ editorHeight, setEditorHeight }),
    [editorHeight, setEditorHeight]
  );

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const text = editorState.getCurrentContent().getPlainText();

  const { setNav } = useContext(NavContext);

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
    setEditorHeight(
      editorContainer.current && editorContainer.current.offsetHeight
    );
    setEditorMaxWidth(
      editorWrapper.current && editorWrapper.current.offsetWidth
    );
  }, [editorState]);

  const keyBindning = (e) => {
    if (listenSubmit(e)) return handleSubmit();
    return getDefaultKeyBinding(e);
  };

  const listenSubmit = (e) => {
    if (e.keyCode === 13)
      if (!e.shiftKey) {
        return true;
      }
    return false;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (editorState.getCurrentContent().getPlainText().length === 0) return;
    resetInput();

    // const res = await fetch(`/api/sendmessagfe`, {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     username,
    //     password,
    //   }),
    // });
    // const user = await res.json();

    setTimeout(() => setIsSubmitting(false), 200);
  };

  const resetInput = () => {
    setEditorState(draftUtils.clearEditorContent(editorState));
  };

  const reportWindowSize = () => {
    setEditorMaxWidth(
      editorWrapper.current && editorWrapper.current.offsetWidth
    );
  };
  window.onresize = reportWindowSize;

  useEffect(() => {
    const getChatData = async () => {
      const chatId = location.pathname.replace("/chat/", "");
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();
      // console.log(data);
      setFriends(data.friends);
    };
    getChatData();
  }, [location]);

  return (
    <div className="chat-page page">
      <div className="header-wrapper">
        <div className="header">
          <DeviceInfo />
          <div className="top-bar">
            <div className="left-section">
              <Ripple.Div
                className="back-arrow"
                onClick={() => handleNavigation("/")}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </Ripple.Div>

              <div className="user-box">
                <div className="img-box-wrapper">
                  <div className="img-box">
                    <img src={Jeb_} alt="" />
                  </div>
                </div>

                <div className="text-box">
                  <div className="name">
                    {friends[0] && friends[0].username}
                  </div>
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
            height: `${
              editorContainer.current && editorContainer.current.offsetHeight
            }px`,
            minHeight: "40px",
            marginRight: text.length > 0 ? "56px" : "",
            transition: text.length <= 1 ? "100ms" : "0ms",
          }}
          ref={inputRef}
        >
          <Ripple.Div className="icon-inside">
            <FontAwesomeIcon icon={faGrinSquintTears} />
          </Ripple.Div>
          <div className="editor-wrapper" ref={editorWrapper}>
            <div
              className="editor-container"
              style={{
                maxWidth: `${editorMaxWidth}px`,
              }}
              ref={editorContainer}
            >
              <Editor
                editorState={editorState}
                onChange={setEditorState}
                placeholder="Enter Message"
                keyBindingFn={keyBindning}
              />
            </div>
          </div>
          {text.length > 0 ? null : (
            <Ripple.Div className="icon-inside">
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
    </div>
  );
}

export default Chat;
