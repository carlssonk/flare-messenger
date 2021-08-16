import React from "react";

function GifMessage({ message, SetAvatar, isMyMessage, messageClass, time }) {
  const liStyle = {
    // marginBottom: message.showAvatar ? "10px" : null,
  };

  return (
    <li key={message._id} className={messageClass} style={{ ...liStyle }}>
      {!isMyMessage && message.showAvatar ? <SetAvatar /> : null}
      <div className="img-wrapper">
        <img
          src={message.gif.source}
          alt=""
          style={{ borderRadius: message.borderRadius }}
        />
        {message.showAvatar ? (
          <div className={isMyMessage ? "my-img-time" : "user-img-time"}>
            {time}
          </div>
        ) : null}
      </div>
    </li>
  );
}

export default GifMessage;
