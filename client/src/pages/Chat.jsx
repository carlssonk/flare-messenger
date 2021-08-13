import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavContext } from "../context/NavContext";
import { UserContext } from "../context/UserContext";
import { SocketContext } from "../context/SocketContext";
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
  faKeyboard,
  faChevronRight,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import Ripple from "../components/Effects/Ripple";
import { useLocation, useHistory } from "react-router-dom";
import { IonAlert } from "@ionic/react";

import {
  Editor,
  EditorState,
  getDefaultKeyBinding,
  ContentState,
  RichUtils,
  Modifier,
  SelectionState,
  CompositeDecorator,
} from "draft-js";
import "draft-js/dist/Draft.css";
import Avatar from "../components/Avatar";
import GroupAvatar from "../components/GroupAvatar";
import Message from "../components/Chat/Message";
import Options from "../components/Chat/Options";
import LinkSpan from "../components/Chat/LinkSpan";

import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import Gif from "../components/Chat/Gif";

const draftUtils = require("draftjs-utils");

const bubbleDown = (isMyMessage) => {
  return isMyMessage
    ? { borderRadius: "30px 30px 4px 30px" }
    : { borderRadius: "30px 30px 30px 4px" };
};

const bubbleUp = (isMyMessage) => {
  return isMyMessage
    ? { borderRadius: "30px 4px 30px 30px" }
    : { borderRadius: "4px 30px 30px 30px" };
};

const bubbleMid = (isMyMessage) => {
  return isMyMessage
    ? { borderRadius: "30px 4px 4px 30px" }
    : { borderRadius: "4px 30px 30px 4px" };
};

const isInputEmpty = (text, files) => {
  return text.replace(/\s/g, "").length > 0 || files.length > 0 ? true : false;
};

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;

function linkStrategy(contentBlock, callback, contentState) {
  findWithRegex(URL_REGEX, contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const wrapURLs = function (text, new_window) {
  const target = new_window === true || new_window == null ? "_blank" : "";
  return text.replace(URL_REGEX, function (url) {
    const protocol_pattern = /^(?:(?:https?|ftp):\/\/)/i;
    const href = protocol_pattern.test(url) ? url : "http://" + url;
    return '<a href="' + href + '" target="' + target + '">' + url + "</a>";
  });
};

function Chat() {
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

  const location = useLocation();
  const history = useHistory();

  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [initMessages, setInitMessages] = useState([]);
  const [imagesHasLoaded, setImagesHasLoaded] = useState(0);
  const [imagesCount, setImagesCount] = useState(0);
  const [showChat, setShowChat] = useState(0);
  const [chat, setChat] = useState({});
  const [simpleController, setSimpleController] = useState(false);
  const [switchEmojiGif, setSwitchEmojiGif] = useState("emoji");

  const [toggleEmoji, setToggleEmoji] = useState(false);

  const [initPage, setInitPage] = useState(false);

  const inputRef = useRef(null);
  const editorWrapper = useRef(null);
  const editorContainer = useRef(null);
  const fileRef = useRef(null);
  const messageContainer = useRef(null);

  let domEditor = useRef(null);
  const setDomEditorRef = (ref) => (domEditor = ref);

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
    EditorState.createEmpty(
      new CompositeDecorator([
        {
          strategy: linkStrategy,
          component: LinkSpan,
        },
      ])
    )
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
    setTimeout(() => setInitPage(true), 400);
  }, []);

  useEffect(() => {
    if (imagesCount === 0) return;
    if (imagesCount === imagesHasLoaded) setShowChat(true);
  }, [imagesHasLoaded, imagesCount]);

  useEffect(() => {
    socket.on("message", (message) => {
      if (message[0].author._id === user.id) return;

      setInitMessages((messages) => [...message, ...messages]);
    });
  }, [socket, user.id]);

  useEffect(() => {
    console.log(initMessages.length);
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
    console.log(newMsgs.length);

    let bubbleArray = [];
    for (let message of newMsgs) {
      const res = handleBubbleRadius(message, newMsgs);
      bubbleArray.push(res);
    }
    const bubbledMsgs = newMsgs.map((obj, idx) => {
      return { ...obj, ...bubbleArray[idx] };
    });

    console.log(bubbledMsgs.length);
    setMessages(bubbledMsgs);
  }, [initMessages]);

  const handleBubbleRadius = (message, messages) => {
    if (!message) return;
    const isMy = message.author._id === user.id;

    const msgs = [...messages].reverse();
    const idx = msgs.findIndex((e) => e._id === message._id);

    const prevMessage = msgs[idx - 1];
    const nextMessage = msgs[idx + 1];
    const currentId = message.author._id;

    if (!prevMessage && !nextMessage) return;

    if (prevMessage && message.showAvatar) {
      // Handle LAST message of block
      if (currentId === prevMessage.author._id && !prevMessage.showAvatar)
        return bubbleUp(isMy);
    }

    // Handle TOP & MIDDLE messages of block
    if (prevMessage && nextMessage && !message.showAvatar) {
      if (
        currentId === prevMessage.author._id &&
        currentId === nextMessage.author._id
      ) {
        if (prevMessage.showAvatar) return bubbleDown(isMy);
        return bubbleMid(isMy);
      }

      if (currentId === nextMessage.author._id) return bubbleDown(isMy);
    }

    // Handle FIRST message
    if (nextMessage && message._id === msgs[0]._id) {
      if (currentId === nextMessage.author._id && !nextMessage.showAvatar) {
        return bubbleDown(isMy);
      }
    }
  };

  useEffect(() => {
    if (text.replace(/\s/g, "").length === 0) return setSimpleController(false);
    if (simpleController) return;

    domEditor.focus();

    const textBlocks = editorState.getCurrentContent().getBlockMap()._list
      ._tail.array;

    for (let i = 0; i < textBlocks.length; i++) {
      const key = textBlocks[i][1].getKey();
      const node = document.querySelector(`span[data-offset-key="${key}-0-0"]`);
      const parentNode = node.parentElement;
      if (node && node.offsetWidth > parentNode.offsetWidth / 2)
        setSimpleController(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    // if (editorHeight < 240) {
    setEditorHeight(
      editorContainer.current && editorContainer.current.offsetHeight
    );
    // }
    setEditorMaxWidth(
      editorWrapper.current && editorWrapper.current.offsetWidth
    );

    // if (draftUtils.getAllBlocks(editorState).size >= 8) return;
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
    const chatId = location.pathname.replace("/chat/", "");
    if (!user.chats.includes(chatId)) return;
    if (text.replace(/\s/g, "").length === 0 && files.length === 0) return;
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

    const myMessage = submitUI(text);
    await fetch(`/api/messages/${chatId}`, {
      method: "POST",
      body: formData,
    });
    // const data = await res.json();
    handleMessageLoading(myMessage);
  };

  const handleMessageLoading = (message) => {
    const updateMessage = message.map((obj) => {
      return { ...obj, isLoading: false };
    });
    const copyMessages = [...messages];
    const newMessages = [...updateMessage, ...copyMessages];
    setInitMessages(newMessages);
    // setMessages(newMessages);
  };

  const submitUI = () => {
    const { avatar, username, id } = user;
    const author = { avatar, username, _id: id };

    const copyFiles = [...files];
    const newFiles = copyFiles.map(({ url, file }) => {
      return { path: url, originalname: file.name };
    });

    let hasUrl = false;
    let stringTag = "";
    if (URL_REGEX.exec(text) !== null) {
      stringTag = wrapURLs(text);
      hasUrl = true;
    }

    const message = {
      _id: uuidv4(),
      createdAt: new Date(),
      text,
      stringTag,
      hasUrl,
      files: newFiles,
      showAvatar: true,
      isLoading: true,
      isNewMessage: true,
      author,
    };

    const spreadMessage = handleSpreadMessage(message);

    setInitMessages((messages) => [...spreadMessage, ...messages]);
    return spreadMessage;
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
        isLoading: true,
        isNewMessage: true,
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
      console.log(data.messages.length);
      setInitMessages(data.messages.reverse());
      setFriends(data.friends);
      setChat(data.chat);

      const filesCount = data.messages.filter((e) => e.file).length;
      setImagesCount(filesCount);
      if (filesCount === 0) setShowChat(true);
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

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!initPage) return;
    setTimeout(() => {
      scrollToBottom();
    }, 10);
  }, [messages, showChat, initPage]);

  const handleAddEmoji = (emoji) => {
    let contentState = editorState.getCurrentContent();
    let targetRange = editorState.getSelection();
    let newContentState = Modifier.insertText(
      contentState,
      targetRange,
      emoji.native
    );

    let newEditorState = EditorState.push(editorState, newContentState);

    setEditorState(newEditorState);
  };

  useEffect(() => {
    if (!initPage) return;
    domEditor.focus();
  }, [toggleEmoji, initPage]);

  return (
    <div className="chat-page page">
      {/* <div style={{ position: "relative" }}> */}
      <Options container={messageContainer} toggleEmoji={toggleEmoji} />
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
      <div
        className="message-container"
        ref={messageContainer}
        style={showChat ? null : { visibility: "hidden" }}
      >
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
                  // bubble={handleBubbleRadius(e)}
                  setImagesHasLoaded={setImagesHasLoaded}
                  scrollToBottom={scrollToBottom}
                  initPage={initPage}
                />
              );
            })}
        </ul>
      </div>
      {/* e.author._id === user.id ? */}

      <div className="controller-container">
        <div
          className="icon-outside-wrapper"
          style={simpleController ? { left: "-36px" } : null}
        >
          <Ripple.Div className="icon-outside">
            <FontAwesomeIcon icon={faCamera} />
          </Ripple.Div>
          {simpleController ? (
            <Ripple.Div
              className="icon-outside"
              onClick={() => setSimpleController(false)}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </Ripple.Div>
          ) : (
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
          )}
        </div>

        <div
          className="input-box"
          style={{
            // height: `${
            //   editorContainer.current && editorContainer.current.offsetHeight
            // }px`,
            minHeight: "40px",
            marginRight: isInputEmpty(text, files) ? "56px" : "",
            marginLeft: simpleController ? "40px" : "",
            // transition: text.replace(/\s/g, "").length <= 1 ? "100ms" : "0ms",
          }}
          ref={inputRef}
        >
          <Ripple.Div
            className="icon-inside"
            onClick={() => setToggleEmoji((bool) => !bool)}
          >
            {/* <FontAwesomeIcon icon={faGrinSquintTears} /> */}
            {toggleEmoji ? (
              <FontAwesomeIcon icon={faKeyboard} />
            ) : (
              <FontAwesomeIcon icon={faGrinSquintTears} />
            )}
          </Ripple.Div>
          <div
            className="editor-wrapper"
            ref={editorWrapper}
            style={{ maxHeight: "240px" }}
          >
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
                ref={setDomEditorRef}
              />
            </div>
          </div>
          {isInputEmpty(text, files) ? null : (
            <Ripple.Div className="icon-inside">
              <FontAwesomeIcon icon={faMicrophone} />
            </Ripple.Div>
          )}
        </div>
        <Ripple.Div
          onClick={handleSubmit}
          className="send-btn"
          style={{
            right: isInputEmpty(text, files) ? "0" : "",
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </Ripple.Div>
      </div>
      {toggleEmoji ? (
        <div className="emoji-wrapper">
          {switchEmojiGif === "emoji" ? (
            <Picker
              set="apple"
              title="Pick your emoji…"
              emoji="point_up"
              theme="auto"
              style={{ width: "100%", height: "100%" }}
              color="#0575e6"
              onSelect={handleAddEmoji}
            />
          ) : (
            <Gif setInitMessages={setInitMessages} />
          )}

          <div className="emoji-gif-box">
            <Ripple.Button
              className={switchEmojiGif === "emoji" ? "selected" : ""}
              onClick={() => setSwitchEmojiGif("emoji")}
            >
              <FontAwesomeIcon icon={faSmile} />
            </Ripple.Button>
            <Ripple.Button
              className={switchEmojiGif === "gif" ? "selected" : ""}
              onClick={() => setSwitchEmojiGif("gif")}
            >
              GIF
            </Ripple.Button>
          </div>
        </div>
      ) : null}

      <IonAlert
        isOpen={maximumFilesAlert}
        onDidDismiss={() => setMaximumFilesAlert(false)}
        cssClass="remove-avatar-alert"
        header={"The limit for attachments has been reached"}
        message={"Maxmimum number of attatchments is 10."}
        buttons={[{ text: "OK", handler: () => setMaximumFilesAlert(false) }]}
      />
      {/* </div> */}
    </div>
  );
}

export default Chat;
