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
}) {
  return (
    <li
      key={message._id}
      className={`${messageClass}`}
      style={showMessage ? null : { height: "0", position: "absolute" }}
    >
      {!isMyMessage && message.showAvatar ? <SetAvatar /> : null}
      <div className="img-wrapper" ref={fileRef}>
        <SetMessageLoading />
        <img
          src={message.file.path}
          alt=""
          style={{ borderRadius: message.borderRadius }}
          onLoad={() => handleInitMessage()}
        />
      </div>
    </li>
  );
}

export default FileMessage;
