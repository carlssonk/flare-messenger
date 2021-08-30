import React, { useEffect } from "react";
import Avatar from "../Avatar";
import MessageLoading from "./MessageLoading";

function TextMessage({
  message,
  // setAvatar,
  SetMessageLoading,
  isMyMessage,
  messageClass,
  bubbleClass,
  onlyEmoji,
  time,
  isVisible,
}) {
  const liStyle = {
    fontSize: onlyEmoji ? "40px" : null,
    visibility: !isVisible ? "hidden" : null,
  };

  return (
    <li key={message._id} className={messageClass} style={{ ...liStyle }}>
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
      {message.stringTag ? (
        <div
          className={`${bubbleClass} ${
            message.isNewMessage ? "bubble-fade-in" : ""
          }`}
          style={{ borderRadius: message.borderRadius }}
        >
          <span
            dangerouslySetInnerHTML={{ __html: `${message.stringTag}` }}
          ></span>
          {message.showAvatar ? (
            <div
              className={isMyMessage ? "my-bubble-time" : "user-bubble-time"}
            >
              {time}
            </div>
          ) : null}
        </div>
      ) : (
        <div
          className={`${bubbleClass} ${
            message.isNewMessage ? "bubble-fade-in" : ""
          }`}
          style={{ borderRadius: message.borderRadius }}
        >
          {message.text}
          {message.showAvatar ? (
            <div
              className={isMyMessage ? "my-bubble-time" : "user-bubble-time"}
            >
              {time}
            </div>
          ) : null}
        </div>
      )}

      <SetMessageLoading />
    </li>
  );
}

export default TextMessage;
