import React, { useEffect, useRef, useState } from "react";

import Draggable from "react-draggable";

function PreviewAvatar({ togglePopup, handleTogglePopup, imageUrl }) {
  const boxRef = useRef(null);
  const nodeRef = useRef(null);
  const imageRef = useRef(null);

  const [imageLoaded, setImageLoaded] = useState("");
  const [circleSize, setCircleSize] = useState();
  const [maxX, setMaxX] = useState(0);
  const [maxY, setMaxY] = useState(0);

  useEffect(() => {
    keepAspectRatio();
  }, [togglePopup]);

  const keepAspectRatio = () => {
    const WIDTH = boxRef.current.offsetWidth;
    const HEIGHT = boxRef.current.offsetHeight;
    if (WIDTH < HEIGHT) {
      setCircleSize(WIDTH);
    } else {
      setCircleSize(HEIGHT);
    }
  };

  useEffect(() => {
    if (imageLoaded) setMaxDrag();
  }, [circleSize, imageLoaded]);

  const setMaxDrag = () => {
    setMaxX((imageRef.current.offsetWidth - circleSize) / 2);
    setMaxY((imageRef.current.offsetHeight - circleSize) / 2);
  };

  const handleWindowResize = () => {
    keepAspectRatio();
    setMaxDrag();
  };

  window.onresize = handleWindowResize;

  return (
    <>
      <div className="popup-wrapper">
        <div
          className={`popup-container ${
            togglePopup ? "popup-show" : "popup-hide"
          }`}
        >
          <div className="popup-img-box" ref={boxRef}>
            <div
              className="popup-img-overlay"
              style={{
                maxWidth: `${circleSize}px`,
                minWidth: `${circleSize}px`,
                maxHeight: `${circleSize}px`,
                minHeight: `${circleSize}px`,
              }}
            ></div>
            <Draggable
              nodeRef={nodeRef}
              bounds={{
                left: -maxX,
                top: -maxY,
                right: maxX,
                bottom: maxY,
              }}
            >
              <div
                ref={nodeRef}
                className="image-wrapper-outer"
                style={
                  imageRef.current &&
                  imageRef.current.offsetWidth > imageRef.current.offsetHeight
                    ? {
                        height: "100%",
                      }
                    : {
                        width: "100%",
                      }
                }
              >
                <div
                  className="image-wrapper"
                  style={{ width: "100%", height: "100%" }}
                >
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt=""
                    onLoad={() => setImageLoaded(true)}
                    style={
                      imageRef.current &&
                      imageRef.current.offsetWidth >
                        imageRef.current.offsetHeight
                        ? {
                            minHeight: `${circleSize}px`,
                            maxHeight: `${circleSize}px`,
                          }
                        : {
                            minWidth: `${circleSize}px`,
                            maxWidth: `${circleSize}px`,
                          }
                    }
                  />
                </div>
              </div>
            </Draggable>
          </div>
        </div>
      </div>
      <div
        onClick={() => handleTogglePopup(false)}
        className={`click-catcher ${
          togglePopup ? "show-fade-half" : "hide-fade-half"
        }`}
      ></div>
    </>
  );
}

export default PreviewAvatar;
