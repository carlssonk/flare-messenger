import React, { useEffect, useState, useRef } from "react";
import FileMessage from "./FileMessage";
import GifMessage from "./GifMessage";
import MessageLoading from "./MessageLoading";
import TextMessage from "./TextMessage";
import { months } from "../../utils/message";

const onlyEmojiExp =
  /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/g;

function Message({
  message,
  isMyMessage,
  setImagesHasLoaded,
  scrollToBottom,
  initPage,
  isVisible,
}) {
  const fileRef = useRef();

  const messageClass = isMyMessage ? "my-message" : "user-message";
  const bubbleClass = isMyMessage ? "my-bubble" : "user-bubble";
  const [showMessage, setShowMessage] = useState(false);
  const [onlyEmoji, setOnlyEmoji] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const SetMessageLoading = () => {
    let name = "";
    if (message.text) name = "dots";

    return message.isLoading ? (
      <MessageLoading
        style={{ borderRadius: message.borderRadius }}
        name={name}
      />
    ) : null;
  };

  const handleInitMessage = () => {
    setImagesHasLoaded((count) => count + 1);
    setShowMessage(true);

    initPage && scrollToBottom();

    message.isNewMessage && fileRef.current.classList.add("bubble-fade-in");
  };

  useEffect(() => {
    const handleDate = () => {
      if (!message.newDay) return;
      const createdAt = new Date(message.createdAt);
      const day = ("0" + createdAt.getDate()).slice(-2);
      const month = months[createdAt.getMonth()];
      const year = createdAt.getFullYear();
      setDate(`${day} ${month} ${year}`);
    };

    const handleTime = () => {
      if (!message.showAvatar) return;
      const createdAt = new Date(message.createdAt);
      const minutes = ("0" + createdAt.getMinutes()).slice(-2);
      const hours = ("0" + createdAt.getHours()).slice(-2);
      setTime(`${hours}:${minutes}`);
    };

    const handleEmoji = () => {
      if (!message.text) return;
      const rawText = message.text;
      const text = message.text.replace(/\s/g, "");
      if (onlyEmojiExp.test(rawText) || onlyEmojiExp.test(text))
        setOnlyEmoji(true);
    };
    handleEmoji();
    handleTime();
    handleDate();
  }, [message.createdAt, message.newDay, message.showAvatar, message.text]);

  return (
    <>
      {message.file ? (
        <FileMessage
          message={message}
          showMessage={showMessage}
          handleInitMessage={handleInitMessage}
          // SetAvatar={SetAvatar}
          SetMessageLoading={SetMessageLoading}
          fileRef={fileRef}
          isMyMessage={isMyMessage}
          messageClass={messageClass}
          time={time}
          isVisible={isVisible}
        />
      ) : null}
      {message.text ? (
        <TextMessage
          message={message}
          // setAvatar={setAvatar}
          SetMessageLoading={SetMessageLoading}
          isMyMessage={isMyMessage}
          messageClass={messageClass}
          bubbleClass={bubbleClass}
          onlyEmoji={onlyEmoji}
          time={time}
          isVisible={isVisible}
        />
      ) : null}
      {message.gif ? (
        <GifMessage
          message={message}
          // SetAvatar={SetAvatar}
          isMyMessage={isMyMessage}
          messageClass={messageClass}
          time={time}
          isVisible={isVisible}
        />
      ) : null}
      {message.newDay ? (
        <div
          className="new-day-message"
          style={!isVisible ? { visibility: "hidden" } : null}
        >
          <span>{date}</span>
        </div>
      ) : null}
    </>
  );
}

export default Message;
