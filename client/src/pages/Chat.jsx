import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavContext } from "../context/NavContext";
import { UserContext } from "../context/UserContext";
import { SocketContext } from "../context/SocketContext";
import _Jeb from "../imgs/Jens-Bergensten.png";
import { v4 as uuidv4 } from "uuid";

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
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Ripple from "../components/Effects/Ripple";
import { useLocation, useHistory } from "react-router-dom";
import { IonAlert } from "@ionic/react";

import { sendMessage } from "../utils/socket";

import { Editor, EditorState, getDefaultKeyBinding } from "draft-js";
import "draft-js/dist/Draft.css";
import Avatar from "../components/Avatar";
import GroupAvatar from "../components/GroupAvatar";
import Message from "../components/Chat/Message";

const draftUtils = require("draftjs-utils");

function Chat() {
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

  const location = useLocation();
  const history = useHistory();

  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [nesMessages, setNewMessages] = useState([]);
  const [initMessages, setInitMessages] = useState([]);
  const [chat, setChat] = useState({});

  const inputRef = useRef(null);
  const editorWrapper = useRef(null);
  const editorContainer = useRef(null);
  const fileRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [maximumFilesAlert, setMaximumFilesAlert] = useState(false);

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
    console.log("WATTAFAK");
    socket.on("message", (message) => {
      if (message[0].author._id === user.id) return;

      setInitMessages((messages) => [...message, ...messages]);
    });
  }, [socket]);

  useEffect(() => {
    let lastId;
    let idArr = [];
    for (let i = 0; i < initMessages.length; i++) {
      if (initMessages[i].author._id === lastId) {
        const startDate = new Date(initMessages[i].createdAt).getTime();
        const endDate = new Date(initMessages[i - 1].createdAt).getTime();

        if ((endDate - startDate) / 1000 > 60) {
          idArr.push(initMessages[i]._id);
        }
      } else {
        idArr.push(initMessages[i]._id);
      }

      lastId = initMessages[i].author._id;
    }

    const newMsgs = initMessages.map((obj) => {
      if (idArr.includes(obj._id)) {
        return { ...obj, showAvatar: true };
      } else {
        return { ...obj, showAvatar: false };
      }
    });

    setMessages(newMsgs);
  }, [initMessages]);

  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);

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
    const text = editorState.getCurrentContent().getPlainText();
    const chatId = location.pathname.replace("/chat/", "");
    if (!user.chats.includes(chatId)) return;
    if (text.length === 0 && files.length === 0) return;
    if (messages.length === 0) enableChat();

    let formData = new FormData();

    if (files.length > 0) {
      const filesArr = files.map(({ file }) => {
        return file;
      });
      filesArr.forEach((file) => {
        formData.append("files", file);
      });
    }

    if (text.length > 0) {
      formData.append("text", text);
    }

    resetInput();

    submitUI(text);
    await fetch(`/api/messages/${chatId}`, {
      method: "POST",
      body: formData,
    });
    console.log("GOOO");
  };

  const submitUI = (text) => {
    const { avatar, username, id } = user;
    const author = { avatar, username, _id: id };

    const copyFiles = [...files];
    const newFiles = copyFiles.map(({ url, file }) => {
      return { path: url, originalname: file.name };
    });

    const message = {
      _id: uuidv4(),
      createdAt: new Date(),
      text,
      files: newFiles,
      showAvatar: true,
      author,
    };

    const spreadMessage = handleSpreadMessage(message);

    setInitMessages((messages) => [...spreadMessage, ...messages]);
  };

  const handleSpreadMessage = ({ files, author, createdAt, text, ...rest }) => {
    let newArray = [];
    if (text) newArray.push({ author, createdAt, text, ...rest });

    for (let file of files) {
      newArray.push({
        author,
        createdAt,
        file,
        _id: uuidv4(),
      });
    }
    return newArray;
  };

  const enableChat = async () => {
    const chatId = location.pathname.replace("/chat/", "");
    if (!user.chats.includes(chatId)) return;
    await fetch("/api/chats/enable", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId,
      }),
    });
  };

  const resetInput = () => {
    setEditorState(draftUtils.clearEditorContent(editorState));
    setFiles([]);
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
      if (!user.chats.includes(chatId)) return;
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();
      setInitMessages(data.messages.reverse());
      setFriends(data.friends);
      setChat(data.chat);
    };
    getChatData();
  }, [location.pathname, user]);

  const addFile = (e) => {
    if (!e.target.files[0]) return;
    if (e.target.files[0].type.indexOf("image/") > -1) {
      if (e.target.files.length > 10) return setMaximumFilesAlert(true);

      const filesArr = [...e.target.files];

      const filesObjArr = filesArr.map((file) => {
        return { file, url: window.URL.createObjectURL(file), id: uuidv4() };
      });

      setFiles((items) => [...items, ...filesObjArr]);
    }
  };

  const handleRemoveFile = (id) => {
    const filesCopy = [...files];
    const updatedArr = filesCopy.filter((e) => e.id !== id);

    setFiles(updatedArr);
  };

  const handleBubbleRadius = (message) => {
    const isMyMessage = message.author._id === user.id;

    const bubbleDown = isMyMessage
      ? { borderRadius: "20px 20px 4px 20px" }
      : { borderRadius: "20px 20px 20px 4px" };
    const bubbleUp = isMyMessage
      ? { borderRadius: "20px 4px 20px 20px" }
      : { borderRadius: "4px 20px 20px 20px" };
    const bubbleMid = isMyMessage
      ? { borderRadius: "20px 4px 4px 20px" }
      : { borderRadius: "4px 20px 20px 4px" };

    const msgs = [...messages].reverse();
    const idx = msgs.findIndex((e) => e._id === message._id);

    const prevMessage = msgs[idx - 1];
    const nextMessage = msgs[idx + 1];

    if (!prevMessage && !nextMessage) return;

    if (!prevMessage) return nextMessage.showAvatar ? null : bubbleDown;
    if (!nextMessage) {
      return prevMessage.showAvatar ? null : bubbleUp;
    }

    if (message.showAvatar) {
      if (
        message.author._id === prevMessage.author._id &&
        !prevMessage.showAvatar
      )
        return bubbleUp;
    }

    if (!message.showAvatar) {
      if (
        message.author._id === prevMessage.author._id &&
        message.author._id === nextMessage.author._id
      ) {
        if (prevMessage.showAvatar) return bubbleDown;
        return bubbleMid;
      }

      if (message.author._id === nextMessage.author._id) return bubbleDown;
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 10);
  }, [messages]);

  return (
    <div className="chat-page page">
      <div className="header-wrapper">
        <div className="header">
          <div className="top-bar">
            <div className="left-section">
              <Ripple.Div
                className="back-arrow"
                onClick={() => handleNavigation("/")}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </Ripple.Div>

              <div className="user-box">
                <div
                  className={`${
                    chat.isPrivate ? "img-box-wrapper" : "img-box-wrapper-group"
                  } `}
                >
                  {chat.isPrivate ? (
                    <Avatar user={friends[0]} style={{ fontSize: "16.2px" }} />
                  ) : (
                    <GroupAvatar
                      chat={chat}
                      style={{ fontSize: "16.2px" }}
                      scale={0.6}
                    />
                  )}
                </div>

                <div className="text-box">
                  {chat.isPrivate ? (
                    <div className="name">{friends[0] && friends[0].name}</div>
                  ) : (
                    <div className="name">{chat && chat.name}</div>
                  )}
                  {chat.isPrivate ? (
                    <div className="status">Currently Active</div>
                  ) : null}
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
        <ul className="message-list">
          <div ref={messagesEndRef} style={{ width: "0" }} />
          {messages &&
            messages.map((e) => {
              return (
                <Message
                  key={e._id}
                  messages={messages}
                  message={e}
                  isMyMessage={e.author._id === user.id}
                  bubble={handleBubbleRadius(e)}
                />
              );
            })}
        </ul>
      </div>
      {/* e.author._id === user.id ? */}
      <div className="controller-container">
        <Ripple.Div className="icon-outside">
          <FontAwesomeIcon icon={faCamera} />
        </Ripple.Div>
        <Ripple.Div
          className="icon-outside"
          onClick={() => fileRef.current.click()}
        >
          <FontAwesomeIcon icon={faImages} />
          <input
            type="file"
            ref={fileRef}
            onChange={addFile}
            accept="image/*"
            multiple
            style={{ display: "none" }}
          />
        </Ripple.Div>
        <div
          className="input-box"
          style={{
            // height: `${
            //   editorContainer.current && editorContainer.current.offsetHeight
            // }px`,
            minHeight: "40px",
            marginRight: text.length > 0 || files.length > 0 ? "56px" : "",
            transition: text.length <= 1 ? "100ms" : "0ms",
          }}
          ref={inputRef}
        >
          <Ripple.Div className="icon-inside">
            <FontAwesomeIcon icon={faGrinSquintTears} />
          </Ripple.Div>
          <div className="editor-wrapper" ref={editorWrapper}>
            <ul className="file-preview-list">
              {files &&
                files.map((e) => {
                  return (
                    <li className="preview-item-wrapper" key={e.id}>
                      <div className="preview-item">
                        <FontAwesomeIcon
                          icon={faTimes}
                          onClick={() => handleRemoveFile(e.id)}
                        />
                        <img src={e.url} alt="" />
                      </div>
                    </li>
                  );
                })}
            </ul>
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
          {text.length > 0 || files.length > 0 ? null : (
            <Ripple.Div className="icon-inside">
              <FontAwesomeIcon icon={faMicrophone} />
            </Ripple.Div>
          )}
        </div>
        <Ripple.Div
          onClick={handleSubmit}
          className="send-btn"
          style={{ right: text.length > 0 || files.length > 0 ? "0" : "" }}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </Ripple.Div>
      </div>
      <IonAlert
        isOpen={maximumFilesAlert}
        onDidDismiss={() => setMaximumFilesAlert(false)}
        cssClass="remove-avatar-alert"
        header={"The limit for attachments has been reached"}
        message={"Maxmimum number of attatchments is 10."}
        buttons={[{ text: "OK", handler: () => setMaximumFilesAlert(false) }]}
      />
    </div>
  );
}

export default Chat;
