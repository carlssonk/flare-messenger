import React from "react";

function GifMessage({ message, SetAvatar, isMyMessage, messageClass }) {
  return (
    <li key={message._id} className={messageClass}>
      {!isMyMessage && message.showAvatar ? <SetAvatar /> : null}
      <div className="img-wrapper">
        <img
          src={message.gif.source}
          alt=""
          style={{ borderRadius: message.borderRadius }}
        />
      </div>
    </li>
  );
}

export default GifMessage;
