import React, { useState, useEffect } from "react";

function GifMessage({
  message,
  SetAvatar,
  isMyMessage,
  messageClass,
  time,
  isVisible,
}) {
  const liStyle = {
    // marginBottom: message.showAvatar ? "10px" : null,
  };

  const [isLoaded, setIsLoaded] = useState(false);

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  useEffect(() => {
    const img = document.createElement("img");
    img.src = message.gif.source;

    const poll = setInterval(function () {
      if (img.naturalWidth) {
        clearInterval(poll);
        const NATURAL_WIDTH = img.naturalWidth;
        const NATURAL_HEIGHT = img.naturalHeight;
        handleInitialDimensions(NATURAL_WIDTH, NATURAL_HEIGHT);
      }
    }, 10);
  }, []);

  const handleInitialDimensions = (width, height) => {
    const windowWidth = document.documentElement.offsetWidth;

    if (width >= height) {
      if (width > 300) {
        const scale = 300 / width;
        setWidth(300);
        setHeight(height * scale);
        return;
      }
    } else {
      if (height > 300) {
        const scale = 300 / height;
        setHeight(300);
        setWidth(width * scale);
        return;
      }
    }

    setWidth(width);
    setHeight(height);
  };

  return (
    <li
      key={message._id}
      className={messageClass}
      style={!isVisible ? { minHeight: height, width } : null}
    >
      <div style={!isVisible ? { display: "none" } : null}>
        {!isMyMessage && message.showAvatar ? <SetAvatar /> : null}
        <div className="img-wrapper">
          <img
            src={message.gif.source}
            alt=""
            style={{ borderRadius: message.borderRadius }}
            onLoad={() => {
              setTimeout(() => setIsLoaded(true), 500);
            }}
          />
          {message.showAvatar ? (
            <div className={isMyMessage ? "my-img-time" : "user-img-time"}>
              {time}
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export default GifMessage;
