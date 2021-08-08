import React, { useEffect, useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import Avatar from "../Avatar";
import { UserContext } from "../../context/UserContext";
import MessageLoading from "./MessageLoading";

function Message({ message, isMyMessage, bubble }) {
  const messageClass = isMyMessage ? "my-message" : "user-message";
  const bubbleClass = isMyMessage ? "my-bubble" : "user-bubble";
  const [showMessage, setShowMessage] = useState(false);

  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   // console.log(message.isLoading);
  //   if (message.isLoading) setIsLoading(true);
  // }, []);

  useEffect(() => {
    console.log("show message");
  }, [showMessage]);

  return (
    <>
      {message.file ? (
        <li
          key={message._id}
          className={`${messageClass}`}
          style={showMessage ? null : { display: "none" }}
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
          <div
            className={`${showMessage ? "img-wrapper" : null} ${
              message.isNewMessage ? "bubble-fade-in" : null
            }`}
          >
            {message.isLoading ? (
              <MessageLoading style={{ ...bubble }} />
            ) : null}
            <img
              src={message.file.path}
              alt=""
              style={{ ...bubble }}
              onLoad={() => setShowMessage(true)}
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
              message.isNewMessage ? "bubble-fade-in" : null
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
