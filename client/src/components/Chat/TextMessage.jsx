import React from "react";

function TextMessage({
  message,
  SetAvatar,
  SetMessageLoading,
  isMyMessage,
  messageClass,
  bubbleClass,
  onlyEmoji,
}) {
  return (
    <li
      key={message._id}
      className={messageClass}
      style={onlyEmoji ? { fontSize: "40px" } : null}
    >
      {!isMyMessage && message.showAvatar ? <SetAvatar /> : null}
      {message.stringTag ? (
        <div
          className={`${bubbleClass} ${
            message.isNewMessage ? "bubble-fade-in" : ""
          }`}
          style={{ borderRadius: message.borderRadius }}
          dangerouslySetInnerHTML={{ __html: `${message.stringTag}` }}
        ></div>
      ) : (
        <div
          className={`${bubbleClass} ${
            message.isNewMessage ? "bubble-fade-in" : ""
          }`}
          style={{ borderRadius: message.borderRadius }}
        >
          {message.text}
        </div>
      )}

      <SetMessageLoading />
    </li>
  );
}

export default TextMessage;
