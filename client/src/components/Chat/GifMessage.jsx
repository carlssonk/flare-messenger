import React, { useEffect } from "react";

function GifMessage({ message, SetAvatar, isMyMessage, messageClass }) {
  // useEffect(() => {
  //   console.log(SetAvatar);
  //   console.log(message.gif);
  //   console.log(!isMyMessage);
  //   console.log(message.showAvatar);
  // }, []);

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
