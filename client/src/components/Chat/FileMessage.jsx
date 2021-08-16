import React from "react";

function FileMessage({
  message,
  showMessage,
  handleInitMessage,
  SetAvatar,
  SetMessageLoading,
  fileRef,
  isMyMessage,
  messageClass,
  time,
}) {
  const liStyle = {
    position: showMessage ? null : "absolute",
    height: showMessage ? null : "0",
    // marginBottom: message.showAvatar ? "10px" : null,
  };

  return (
    <li key={message._id} className={`${messageClass}`} style={{ ...liStyle }}>
      {!isMyMessage && message.showAvatar ? <SetAvatar /> : null}
      <div className="img-wrapper" ref={fileRef}>
        <SetMessageLoading />
        <img
          src={message.file.path}
          alt=""
          style={{ borderRadius: message.borderRadius }}
          onLoad={() => handleInitMessage()}
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

export default FileMessage;
