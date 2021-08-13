import React, { useEffect, useState, useRef } from "react";
import Avatar from "../Avatar";
import MessageLoading from "./MessageLoading";

const onlyEmojiExp =
  /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/g;
const emojiExp =
  /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

function Message({
  message,
  isMyMessage,
  setImagesHasLoaded,
  scrollToBottom,
  initPage,
}) {
  const fileRef = useRef();

  const messageClass = isMyMessage ? "my-message" : "user-message";
  const bubbleClass = isMyMessage ? "my-bubble" : "user-bubble";
  const [showMessage, setShowMessage] = useState(false);
  const [onlyEmoji, setOnlyEmoji] = useState(false);
  // const [isUrl, setIsUrl] = useState(false);
  // const [isImgUrl, setImgIsUrl] = useState(false);
  // const [message, setMessage] = useState({});

  // useEffect(() => {
  //   function checkURL(url) {
  //     return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  //   }

  //   var wrapURLs = function (text, new_window) {
  //     const URL_REGEX =
  //       /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;
  //     if (URL_REGEX.exec(text) === null) return false;

  //     console.log(checkURL(text));

  //     var target = new_window === true || new_window == null ? "_blank" : "";
  //     return text.replace(URL_REGEX, function (url) {
  //       var protocol_pattern = /^(?:(?:https?|ftp):\/\/)/i;
  //       var href = protocol_pattern.test(url) ? url : "http://" + url;
  //       return '<a href="' + href + '" target="' + target + '">' + url + "</a>";
  //     });
  //   };

  //   const url = wrapURLs(msg.text);
  //   if (url) {
  //     setMessage({ ...msg, text: url });
  //     setIsUrl(true);
  //   } else {
  //     setMessage(msg);
  //   }
  // }, [msg]);

  const handleInitMessage = () => {
    setImagesHasLoaded((count) => count + 1);
    setShowMessage(true);

    initPage && scrollToBottom();

    message.isNewMessage && fileRef.current.classList.add("bubble-fade-in");
  };

  useEffect(() => {
    console.log(message);
    // if (!message.text) return;
    if (!message.text) return;
    const rawText = message.text;
    const text = message.text.replace(/\s/g, "");
    if (onlyEmojiExp.test(rawText) || onlyEmojiExp.test(text))
      setOnlyEmoji(true);
  }, []);

  return (
    <>
      {message.file ? (
        <li
          key={message._id}
          className={`${messageClass}`}
          style={showMessage ? null : { height: "0", position: "absolute" }}
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
          <div className={`img-wrapper`} ref={fileRef}>
            {message.isLoading ? (
              <MessageLoading style={{ borderRadius: message.borderRadius }} />
            ) : null}
            <img
              src={message.file.path}
              alt=""
              style={{ borderRadius: message.borderRadius }}
              onLoad={() => handleInitMessage()}
            />
          </div>
        </li>
      ) : null}
      {message.text ? (
        <li
          key={message._id}
          className={messageClass}
          style={onlyEmoji ? { fontSize: "40px" } : null}
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
          {message.hasUrl ? (
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

          {message.isLoading ? (
            <MessageLoading
              style={{ borderRadius: message.borderRadius }}
              name="dots"
            />
          ) : null}
        </li>
      ) : null}
      {message.gif ? (
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
          <div className={`img-wrapper`}>
            <img
              src={message.gif.source}
              alt=""
              style={{ borderRadius: message.borderRadius }}
            />
          </div>
        </li>
      ) : null}
    </>
  );
}

export default Message;
