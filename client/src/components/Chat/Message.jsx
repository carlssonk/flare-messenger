import React, { useEffect, useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import Avatar from "../Avatar";
import { UserContext } from "../../context/UserContext";

function Message({ message, isMyMessage, bubble }) {
  const { user } = useContext(UserContext);

  const messageClass = isMyMessage ? "my-message" : "user-message";
  const bubbleClass = isMyMessage ? "my-bubble" : "user-bubble";
  const [bubbleRadius, setBubbleRadius] = useState({});
  const [reRenderBool, setReRenderBool] = useState(false);

  const bubbleDown = isMyMessage
    ? { borderRadius: "20px 20px 4px 20px" }
    : { borderRadius: "20px 20px 20px 4px" };
  const bubbleUp = isMyMessage
    ? { borderRadius: "20px 4px 20px 20px" }
    : { borderRadius: "4px 20px 20px 20px" };
  const bubbleMid = isMyMessage
    ? { borderRadius: "20px 4px 4px 20px" }
    : { borderRadius: "4px 20px 20px 4px" };

  useEffect(() => {
    console.log(bubble);
  }, [bubble]);

  // const handleBubbleRadius = () => {
  //   const msgs = [...messages].reverse();
  //   const idx = msgs.findIndex((e) => e._id === message._id);

  //   const prevMessage = msgs[idx - 1];
  //   const nextMessage = msgs[idx + 1];

  //   if (!prevMessage && !nextMessage) return;

  //   if (!prevMessage)
  //     return nextMessage.showAvatar ? null : setBubbleRadius(bubbleDown);
  //   if (!nextMessage) {
  //     return prevMessage.showAvatar ? null : setBubbleRadius(bubbleUp);
  //   }

  //   if (message.showAvatar) {
  //     if (
  //       message.author._id === prevMessage.author._id &&
  //       !prevMessage.showAvatar
  //     )
  //       setBubbleRadius(bubbleUp);
  //   }

  //   if (!message.showAvatar) {
  //     if (
  //       message.author._id === prevMessage.author._id &&
  //       message.author._id === nextMessage.author._id
  //     ) {
  //       if (prevMessage.showAvatar) return setBubbleRadius(bubbleDown);
  //       return setBubbleRadius(bubbleMid);
  //     }

  //     if (message.author._id === nextMessage.author._id)
  //       return setBubbleRadius(bubbleDown);
  //   }
  // };

  return (
    <>
      {message.file ? (
        <li key={message._id} className={`${messageClass} file`} key={uuidv4()}>
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
          <div className="img-wrapper">
            <img src={message.file.path} alt="" style={{ ...bubble }} />
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
          <div className={bubbleClass} style={{ ...bubble }}>
            {message.text}
          </div>
        </li>
      )}
    </>
  );
}

export default Message;
