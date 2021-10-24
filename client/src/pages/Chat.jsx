import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavContext } from "../context/NavContext";
import { UserContext } from "../context/UserContext";
import { SocketContext } from "../context/SocketContext";
import { v4 as uuidv4 } from "uuid";

import {
  faChevronLeft,
  faEllipsisV,
  faCamera,
  faImages,
  faPaperPlane,
  faGrinSquintTears,
  faTimes,
  faKeyboard,
  faChevronRight,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import Ripple from "../components/Effects/Ripple";
import { useLocation, useHistory } from "react-router-dom";
import { IonAlert, IonSpinner, IonPopover } from "@ionic/react";
import { isMobile } from "../utils/isMobile";

import {
  Editor,
  EditorState,
  getDefaultKeyBinding,
  Modifier,
  CompositeDecorator,
} from "draft-js";
import "draft-js/dist/Draft.css";
import Avatar from "../components/Avatar";
import GroupAvatar from "../components/GroupAvatar";
import Message from "../components/Chat/Message";
import Utils from "../components/Chat/Utils";
import LinkSpan from "../components/Chat/LinkSpan";

import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import Gif from "../components/Chat/Gif";
import {
  contentStateEmoji,
  enableChat,
  handleSpreadMessage,
  createMessageUI,
  listenSubmit,
  handleAddBubble,
  handleShowAvatar,
  linkStrategy,
  isInputEmpty,
} from "../utils/chat";

import InfiniteScroll from "react-infinite-scroll-component";
import VisibilitySensor from "react-visibility-sensor";
import EditChat from "../components/EditChat";
import UserMediaAlert from "../components/UserMediaAlert";
import { hasImageCapture } from "../utils/hasImageCapture";

const draftUtils = require("draftjs-utils");

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
  const [showChat, setShowChat] = useState(false);
  const [chat, setChat] = useState({});
  const [chatStatus, setChatStatus] = useState(0);
  const [chatColor, setChatColor] = useState({
    name: "endless-river",
    colors: "#1bbbbb, #0575e6",
  });
  const [toggleUserDetail, setToggleUserDetail] = useState(false);
  const [simpleController, setSimpleController] = useState(false);
  const [switchEmojiGif, setSwitchEmojiGif] = useState(
    isMobile() ? "gif" : "emoji"
  );
  const [isMyMessage, setIsMyMessage] = useState(false);

  const [toggleEmoji, setToggleEmoji] = useState(false);

  const [initPage, setInitPage] = useState(false);

  const [messagesCount, setMessagesCount] = useState(0);
  const [currentLimit, setCurrentLimit] = useState(40);
  const [showPopover, setShowPopover] = useState(false);
  const [toggleCameraAlert, setToggleCameraAlert] = useState(false);

  const inputRef = useRef(null);
  const editorWrapper = useRef(null);
  const editorContainer = useRef(null);
  const fileRef = useRef(null);
  const messageContainer = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);
  const userDetailRefs = useRef([]);

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

    if (to === "/camera") {
      if (files.length >= 10) return setMaximumFilesAlert(true);
      setNav({path: to, state: { prevPath: history.location.pathname, files, text }})
      return;
    }
    
    setNav({path: to, direction: 0});
  };

  useEffect(() => {
    setTimeout(() => setInitPage(true), 400);
  }, []);

  useEffect(() => {
    if (chatColor) {
      handleSetColor(chatColor);
    } else {
      handleSetColor({ name: "endless-river", colors: "#1bbbbb, #0575e6" });
    }
  }, [chatColor]);

  const handleSetColor = (c) => {
    document.documentElement.style.setProperty(
      "--bubble-gradient",
      `linear-gradient(to bottom, ${c.colors}`
    );
    const arr = c.colors.split(",");
    document.documentElement.style.setProperty("--top-color", arr[0]);
    document.documentElement.style.setProperty("--bottom-color", arr[1]);
  };

  useEffect(() => {
    if (history.location.state) {
      setFiles(history.location.state.files);
    }
  }, [history]);

  useEffect(() => {
    if (imagesCount === 0) return;
    if (imagesCount === imagesHasLoaded) {
      setTimeout(() => setShowChat(true), 50)
    }
  }, [imagesHasLoaded, imagesCount]);

  // Socket
  useEffect(() => {
    socket.on("message", (message) => {
      if (message[0].author._id === user.id) return;

      setInitMessages((messages) => [...message, ...messages]);
    });
  }, [socket, user.id]);

  useEffect(() => {
    if (initMessages.length === 0) return;
    const avatarMsgs = handleShowAvatar(initMessages);
    const addDayMsgs = handleAddDay(avatarMsgs);
    const bubbledMsgs = handleAddBubble(addDayMsgs, user);
    setMessages(bubbledMsgs);
  }, [initMessages, user]);

  const handleAddDay = (msgs) => {
    const datesAreOnSameDay = (first, second) =>
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate();

    let lastDate = new Date(msgs[msgs.length - 1].createdAt);

    for (let i = msgs.length - 1; i >= 0; i--) {
      const currentDate = new Date(msgs[i].createdAt);

      if (!datesAreOnSameDay(currentDate, lastDate)) {
        msgs[i].newDay = true;
        lastDate = new Date(msgs[i].createdAt);
      }
    }
    msgs[msgs.length - 1].newDay = true;

    return msgs;
  };

  const keyBindning = (e) => {
    if (listenSubmit(e)) return handleSubmit();

    return getDefaultKeyBinding(e);
  };

  const handleSubmit = async (gif = null) => {
    domEditor && domEditor.focus();
    const chatId = location.pathname.replace("/chat/", "");
    if (!user.chats.includes(chatId)) return;
    if (!gif && text.replace(/\s/g, "").length === 0 && files.length === 0)
      return;
    if (messages.length === 0) enableChat(location, user);

    let formData = new FormData();

    if (!gif) {
      const filesArr = files.map(({ file }) => {
        return file;
      });
      filesArr.forEach((file) => {
        formData.append("files", file);
      });
    }
    !gif && formData.append("text", text);
    !gif && resetInput();
    formData.append("gif", JSON.stringify(gif));

    setToggleEmoji(false);
    const myMessage = submitUI(gif);
    await fetch(`/api/messages/${chatId}`, {
      method: "POST",
      body: formData,
    });
    window.history.replaceState(null, "New Title");
    handleMessageLoading(myMessage);
  };

  const handleMessageLoading = (message) => {
    const updateMessage = message.map((obj) => {
      return { ...obj, isLoading: false };
    });
    const copyMessages = [...messages];
    const newMessages = [...updateMessage, ...copyMessages];
    setInitMessages(newMessages);
  };

  const submitUI = (gif) => {
    setIsMyMessage(true);
    const message = createMessageUI(user, text, files, gif);

    const spreadMessage = handleSpreadMessage(message);

    setInitMessages((messages) => [...spreadMessage, ...messages]);

    return spreadMessage;
  };

  const addFile = (e) => {
    if (!e.target.files[0]) return;
    if (e.target.files[0].type.indexOf("image/") > -1) {
      if (e.target.files.length > 10 || files.length > 10)
        return setMaximumFilesAlert(true);

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

    window.history.replaceState(null, "New Title");
  };

  const handleAddEmoji = (emoji) => {
    const newContentState = contentStateEmoji(emoji, editorState, Modifier);
    const newEditorState = EditorState.push(editorState, newContentState);
    setEditorState(newEditorState);
  };

  // Init data
  useEffect(() => {
    const getChatData = async () => {
      const chatId = location.pathname.replace("/chat/", "");
      if (!user.chats.includes(chatId)) return;
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();
      setInitMessages(data.messages.reverse());
      handleSetFriends(data.friends);
      setChat(data.chat);
      setChatStatus(data.chatSettings.status);
      data.chatSettings.color && setChatColor(data.chatSettings.color);
      setMessagesCount(data.messagesCount);
      const filesCount = data.messages.filter((e) => e.file).length;
      setImagesCount(filesCount);
      if (filesCount === 0) setShowChat(true);
    };
    getChatData();
  }, [location.pathname, user]);

  const handleSetFriends = (friends) => {
    friends = friends.map(({ ...rest }) => {
      return { ...rest, showDetails: false };
    });

    setFriends(friends);
  };

  const handleShowUserDetails = (id, i) => {
    let elPos;
    let docPos;
    let detailStyle = {};
    if (id) {
      elPos = userDetailRefs.current[i].getBoundingClientRect();
      docPos = document.documentElement.getBoundingClientRect();
      if (elPos.right >= docPos.right) detailStyle = { right: 0 };
    }

    const friendsCopy = [...friends];
    const newFriends = friendsCopy.map((e) => {
      if (e._id === id) {
        return { ...e, showDetails: !e.showDetails, detailStyle };
      }
      return { ...e, showDetails: false, detailStyle };
    });

    if (newFriends.some((e) => e.showDetails)) {
      setToggleUserDetail(true);
    } else setToggleUserDetail(false);

    setFriends(newFriends);
  };

  useEffect(() => {
    if (chatStatus === 3) handleNavigation("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatStatus]);

  // Scroll To Bottom
  useEffect(() => {
    if (!initPage) return;
    setTimeout(() => scrollToBottom(), 10);
    // eslint-disable-next-line
  }, [showChat, initPage, messages]);

  // // Focus Input
  // useEffect(() => {
  //   if (!initPage) return;
  //   domEditor.focus();
  // }, [toggleEmoji, initPage]);

  const resetInput = () => {
    setEditorState(draftUtils.clearEditorContent(editorState));
    setFiles([]);
  };

  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    if (Math.abs(scrollRef.current.lastScrollTop) > 300 && !isMyMessage) return;
    setIsMyMessage(false);
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Set simple controller
  useEffect(() => {
    if (text.length === 0 && isMobile()) {
      if (text.length === 0) {
        setEditorState(
          EditorState.createEmpty(
            new CompositeDecorator([
              {
                strategy: linkStrategy,
                component: LinkSpan,
              },
            ])
          )
        );
      }
    }

    if (text.replace(/\s/g, "").length === 0) return setSimpleController(false);
    if (simpleController) return;

    // domEditor && domEditor.focus();

    const textBlocks = editorState.getCurrentContent().getBlockMap()._list
      ._tail.array;

    for (let i = 0; i < textBlocks.length; i++) {
      const key = textBlocks[i][1].getKey();
      const node = document.querySelector(`span[data-offset-key="${key}-0-0"]`);
      if (!node) return;
      const parentNode = node.parentElement;
      if (node && node.offsetWidth > parentNode.offsetWidth / 2)
        setSimpleController(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const handleLoadMoreMessages = async () => {
    const chatId = location.pathname.replace("/chat/", "");
    if (!user.chats.includes(chatId)) return;

    const limit = currentLimit + 30;
    const skip = 0;
    const res = await fetch(
      `/api/messages/load/${chatId}?skip=${skip}&limit=${limit}`
    );
    const data = await res.json();
    setCurrentLimit(limit);
    setInitMessages(data.messages.reverse());
  };

  return (
    <div className="chat-page page">
      <Utils
        container={messageContainer}
        toggleEmoji={toggleEmoji}
        editorState={editorState}
        setEditorHeight={setEditorHeight}
        setEditorMaxWidth={setEditorMaxWidth}
        editorContainer={editorContainer}
        editorWrapper={editorWrapper}
      />
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

              <div className="user-box" style={showChat ? {opacity: "1"} : null}>
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
                    <div className="status">{friends[0].lastActiveTime}</div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="right-section">
              <Ripple.Div onClick={() => setShowPopover(true)}>
                <FontAwesomeIcon icon={faEllipsisV} />
              </Ripple.Div>
            </div>
            <IonPopover
              cssClass="settings-popover"
              isOpen={showPopover}
              onDidDismiss={() => setShowPopover(false)}
            >
              <div className="popover-container">
                <EditChat
                  page="chat"
                  selectedChats={[
                    {
                      _id: location.pathname.replace("/chat/", ""),
                      status: chatStatus,
                    },
                  ]}
                  toggleEditChat={true}
                  setShowPopover={setShowPopover}
                  setChatStatus={setChatStatus}
                  chatColor={chatColor}
                  setChatColor={setChatColor}
                />
              </div>
            </IonPopover>
          </div>
        </div>
        <div className="blur"></div>
      </div>
      {!chat.isPrivate ? (
        <>
          <div className="users-container" style={showChat ? {opacity: "1"} : null}>
            <ul className="users-list" style={showChat ? {opacity: "1"} : null}>
              {friends &&
                friends.map((e, i) => {
                  return (
                    <React.Fragment key={e._id}>
                      <div className="list-item">
                        <Ripple.Div
                          className="name"
                          onClick={() => handleShowUserDetails(e._id, i)}
                        >
                          <span>{e.name}</span>
                        </Ripple.Div>
                        <div
                          ref={(el) => (userDetailRefs.current[i] = el)}
                          className="user-detail-container"
                          style={
                            e.showDetails
                              ? { ...e.detailStyle }
                              : { visibility: "hidden" }
                          }
                        >
                          <div className="user-detail-inner">
                            <Avatar
                              user={e}
                              style={{
                                fontSize: "16.2px",
                                width: "36px",
                                height: "36px",
                              }}
                            />
                            <span>{e.name}</span>
                            <span>{e.lastActiveTime}</span>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
            </ul>
          </div>
          <div
            onClick={() => handleShowUserDetails(null)}
            className="user-detail-click-catcher"
            style={toggleUserDetail ? null : { display: "none" }}
          ></div>
        </>
      ) : null}

      <div
        className="message-container"
        ref={messageContainer}
        style={showChat ? {opacity: "1"} : null}
      >
        {messages && messages.length === 0 ? (
          <div style={{color: "#a1a1a1", position: "fixed", inset: "0", zIndex: "0", display: "grid", placeItems: "center"}}>It's empty here ( ͡° ͜ʖ ͡°)</div>
        ):null}
        <InfiniteScroll
          ref={scrollRef}
          className="message-list"
          dataLength={messages.length} //This is important field to render the next data
          next={handleLoadMoreMessages}
          inverse={true}
          height={"100%"}
          scrollThreshold={"100px"}
          hasMore={messages.length >= messagesCount ? false : true}
          loader={
            <div className="load-messages-spinner">
              <span>
                <IonSpinner name="lines" />
              </span>
            </div>
          }
        >
          <div ref={messagesEndRef} style={{ width: "0" }} />
          {messages &&
            messages.map((e) => {
              return (
                <VisibilitySensor
                  key={e._id}
                  offset={{ bottom: -300, top: -300 }}
                >
                  {({ isVisible }) => (
                    <Message
                      isVisible={isVisible}
                      messages={messages}
                      message={e}
                      isMyMessage={e.author._id === user.id}
                      setImagesHasLoaded={setImagesHasLoaded}
                      scrollToBottom={scrollToBottom}
                      initPage={initPage}
                    />
                  )}
                </VisibilitySensor>
              );
            })}
        </InfiniteScroll>
      </div>

      <div className="controller-container">
        <div
          className="icon-outside-wrapper"
          style={simpleController ? { left: "-36px" } : null}
        >
          <Ripple.Div
            className="icon-outside"
            onClick={() => {
              if (!hasImageCapture()) return setToggleCameraAlert(true);
              handleNavigation("/camera")
            }}
          >
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
              onClick={() => {
                if (files.length >= 10) return setMaximumFilesAlert(true);
                fileRef.current.click();
              }}
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
            minHeight: "40px",
            marginRight: isInputEmpty(text, files) ? "56px" : "",
            marginLeft: simpleController ? "40px" : "",
          }}
          ref={inputRef}
        >
          <Ripple.Div
            className="icon-inside"
            onClick={() => setToggleEmoji((bool) => !bool)}
          >
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
              onClick={() => isMobile() && setToggleEmoji(false)}
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
          {/* {isInputEmpty(text, files) ? null : (
            <Ripple.Div className="icon-inside">
              <FontAwesomeIcon icon={faMicrophone} />
            </Ripple.Div>
          )} */}
        </div>
        <Ripple.Div
          onClick={() => handleSubmit()}
          className="send-btn"
          style={{
            right: isInputEmpty(text, files) ? "0" : "",
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </Ripple.Div>
      </div>
      {toggleEmoji ? (
        <div
          className="emoji-wrapper"
          style={{
            maxHeight: `${document.documentElement.offsetHeight / 2}px`,
          }}
        >
          {switchEmojiGif === "emoji" ? (
            isMobile() ? null : (
              <Picker
                set="apple"
                title="Pick your emoji…"
                emoji="point_up"
                theme="auto"
                style={{ width: "100%", height: "100%" }}
                color={chatColor.colors.split(",")[1]}
                onSelect={handleAddEmoji}
              />
            )
          ) : (
            <Gif
              setInitMessages={setInitMessages}
              handleSubmit={handleSubmit}
            />
          )}

          <div className="emoji-gif-box">
            {isMobile() ? null : (
              <Ripple.Button
                className={switchEmojiGif === "emoji" ? "selected" : ""}
                onClick={() => setSwitchEmojiGif("emoji")}
              >
                <FontAwesomeIcon icon={faSmile} />
              </Ripple.Button>
            )}

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
        cssClass="popup-alert"
        header={"The limit for attachments has been reached"}
        message={"Maxmimum number of attatchments is 10."}
        buttons={[{ text: "OK", handler: () => setMaximumFilesAlert(false) }]}
      />
      <UserMediaAlert toggleCameraAlert={toggleCameraAlert} setToggleCameraAlert={setToggleCameraAlert} />
    </div>
  );
}

export default Chat;
