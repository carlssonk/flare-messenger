import React, { useState, useRef } from "react";
import Avatar from "../Avatar";
import MessageLoading from "./MessageLoading";

function Message({
  message,
  isMyMessage,
  bubble,
  setImagesHasLoaded,
  scrollToBottom,
}) {
  const fileRef = useRef();

  const messageClass = isMyMessage ? "my-message" : "user-message";
  const bubbleClass = isMyMessage ? "my-bubble" : "user-bubble";
  const [showMessage, setShowMessage] = useState(false);

  // useEffect(() => {
  //   console.log(showMessage);
  // }, [showMessage]);

  const handleInitMessage = () => {
    setImagesHasLoaded((count) => count + 1);
    //
    setShowMessage(true);
    scrollToBottom();

    message.isNewMessage && fileRef.current.classList.add("bubble-fade-in");
  };

  return (
    <>
      {message.file ? (
        <li
          key={message._id}
          className={`${messageClass}`}
          style={showMessage ? null : { height: "0", position: "absolute" }}
        >
          {!isMyMessage && message.showAvatar ? (
            <Avatar
              style={{
                width: "30px",
                minWidth: "30px",
                height: "30px",
                fontSize: "18px",
                position: "absolute",
                left: "0",
              }}
              user={message.author}
            />
          ) : null}
          <div className={`img-wrapper`} ref={fileRef}>
            {message.isLoading ? (
              <MessageLoading style={{ ...bubble }} />
            ) : null}
            <img
              src={message.file.path}
              alt=""
              style={{ ...bubble }}
              onLoad={() => handleInitMessage()}
            />
          </div>
        </li>
      ) : (
        <li key={message._id} className={messageClass}>
          {!isMyMessage && message.showAvatar ? (
            <Avatar
              style={{
                width: "30px",
                minWidth: "30px",
                height: "30px",
                fontSize: "18px",
                position: "absolute",
                left: "0",
              }}
              user={message.author}
            />
          ) : null}
          <div
            className={`${bubbleClass} ${
              message.isNewMessage ? "bubble-fade-in" : ""
            }`}
            style={{ ...bubble }}
          >
            {message.text}
          </div>
          {message.isLoading ? (
            <MessageLoading style={{ ...bubble }} name="dots" />
          ) : null}
        </li>
      )}
    </>
  );
}

export default Message;
