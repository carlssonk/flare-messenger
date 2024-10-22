import React, { useEffect, useRef, useState, useContext } from "react";

import Draggable from "react-draggable";

import { getImgSizeInfo, calculatePosition } from "../utils/previewAvatar";

import CheckifCircleIsOutsideBounds from "./Profile/CheckIfCircleIsOutsideBounds";

import { UserContext } from "../context/UserContext";

import Ripple from "./Effects/Ripple";

function PreviewAvatar({
  type,
  handleTogglePopup,
  imageUrl,
  image,
  setIsLoading,
  getPreviewTransform,
  setImageTransform,
}) {
  const boxRef = useRef(null);
  const nodeRef = useRef(null);
  const imageRef = useRef(null);
  const circleRef = useRef(null);
  const imageWrapperRef = useRef(null);

  const { setUser, user } = useContext(UserContext);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [circleSize, setCircleSize] = useState(0);
  const [maxX, setMaxX] = useState(0);
  const [maxY, setMaxY] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [windowIsResizing, setWindowIsResizing] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const [isOutsideBounds, setIsOutsideBounds] = useState(false);
  const [outsideBounds, setOutsideBounds] = useState({ y: 0, x: 0 });
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  const [inputValue, setInputValue] = useState(0);
  const [scaleValue, setScaleValue] = useState(0);

  const [togglePopupWait, setTogglePopupWait] = useState(true);

  useEffect(() => {
    if (imageLoaded) {
      const imageInfo = getImgSizeInfo(imageRef.current);
      setImageSize({
        width: imageInfo.width,
        height: imageInfo.height,
        naturalWidth: imageInfo.naturalWidth,
        naturalHeight: imageInfo.naturalHeight,
      });
    }
  }, [imageLoaded]);

  useEffect(() => {
    setScaleValue(inputValue / 100 + 1);
  }, [inputValue]);

  useEffect(() => {
    const setMaxDrag = () => {
      const WIDTH = imageSize.width * scaleValue;
      const HEIGHT = imageSize.height * scaleValue;

      setMaxX((WIDTH - circleSize) / 2);
      setMaxY((HEIGHT - circleSize) / 2);
    };
    if (imageLoaded) setMaxDrag();
  }, [scaleValue, circleSize, imageLoaded, imageSize]);

  useEffect(() => {
    const getCircleSize = () => {
      const WIDTH = imageSize.width;
      const HEIGHT = imageSize.height;
      if (WIDTH < HEIGHT) {
        setCircleSize(WIDTH);
      } else {
        setCircleSize(HEIGHT);
      }
    };
    if (imageSize.width > 0) getCircleSize();
  }, [imageSize]);

  const dragHandler = (e) => {
    setInputValue(e.target.value);
  };

  const handleDrag = (_, data) => {
    setLastY(data.lastY);
    setLastX(data.lastX);
  };

  useEffect(() => {
    setIsHolding(true);
    const timeout = setTimeout(() => setIsHolding(false), 250);
    return () => clearTimeout(timeout);
  }, [windowIsResizing]);

  const handleWindowResize = () => {
    if (imageRef.current === null) return;
    setWindowIsResizing((bool) => !bool);
    const imageInfo = getImgSizeInfo(imageRef.current);
    setImageSize({
      width: imageInfo.width,
      height: imageInfo.height,
      naturalWidth: imageInfo.naturalWidth,
      naturalHeight: imageInfo.naturalHeight,
    });
  };
  window.onresize = handleWindowResize;

  // HOW TO SCALE IMAGE ACCORDINGLY USING CLOUDINARY API
  // https://res.cloudinary.com/plexeronthecloud/image/upload/ar_1,c_crop,w_${Zoom},x_${FindX},y_${FindY}/v1625506265/YelpCamp/boxes_mqd5wg.png

  const handleSubmitProfile = async (e) => {
    console.log('HELLO')
    e.preventDefault();
    setIsLoading(true);
    setTogglePopupWait(false);
    if (imageUrl.length === 0) return;

    const formData = new FormData();
    console.log(image)
    formData.append("avatar", image);
    formData.append(
      "resize",
      JSON.stringify(
        calculatePosition(imageSize, circleRef, imageRef, scaleValue)
      )
    );

    console.log(formData)
    const res = await fetch(`/api/avatar`, {
      method: "POST",
      body: formData,
    });
    console.log(res)
    const avatar = await res.json();

    setIsLoading(false);
    window.history.replaceState(null, "New Title");
    setUser({
      ...user,
      avatar: {
        path: avatar.path,
      },
    });
  };

  const handleSubmitGroup = async (e) => {
    e.preventDefault();
    setTogglePopupWait(false);
    getPreviewTransform(circleSize, scaleValue, lastX, lastY);
    setImageTransform(
      calculatePosition(imageSize, circleRef, imageRef, scaleValue)
    );
  };

  useEffect(() => {
    if (!togglePopupWait) setTimeout(() => handleTogglePopup(false), 250);
  }, [togglePopupWait, handleTogglePopup]);

  return (
    <>
      {imageLoaded ? (
        <CheckifCircleIsOutsideBounds
          imageSize={imageSize}
          scaleValue={scaleValue}
          circleRef={circleRef}
          imageRef={imageRef}
          maxY={maxY}
          maxX={maxX}
          setOutsideBounds={setOutsideBounds}
          setIsOutsideBounds={setIsOutsideBounds}
          lastX={lastX}
          lastY={lastY}
        />
      ) : null}

      <div className="popup-wrapper" style={{ zIndex: "16" }}>
        <div
          className={`popup-container ${
            togglePopupWait ? "popup-show" : "popup-hide"
          }`}
          style={imageLoaded ? null : { pointerEvents: "none" }}
        >
          <div className="popup-img-box-wrapper">
            <div className="popup-img-box" ref={boxRef}>
              <div
                ref={circleRef}
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
                defaultPosition={{ x: 0, y: 0 }}
                position={
                  isOutsideBounds && isHolding
                    ? { y: outsideBounds.y, x: outsideBounds.x }
                    : null
                }
                onDrag={handleDrag}
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
                    style={{
                      width: "100%",
                      height: "100%",
                      transform: `scale3d(${scaleValue},${scaleValue},${scaleValue})`,
                    }}
                    ref={imageWrapperRef}
                  >
                    <img
                      ref={imageRef}
                      src={imageUrl}
                      alt=""
                      style={imageLoaded ? { opacity: "1" } : null}
                      onLoad={() => setTimeout(() => setImageLoaded(true), 50)}
                    />
                  </div>
                </div>
              </Draggable>
            </div>
          </div>

          <div className="track-wrapper">
            <input
              min={0}
              max={200}
              onChange={dragHandler}
              onMouseDown={() => setIsHolding(true)}
              onTouchStart={() => setIsHolding(true)}
              onMouseUp={() => {
                setIsHolding(false);
                setIsOutsideBounds(false);
              }}
              onTouchEnd={() => {
                setIsHolding(false);
                setIsOutsideBounds(false);
              }}
              type="range"
            />

            <div className="track-box">
              <div className="inner-track-box">
                <div
                  style={{
                    transform: `translate3d(-${(200 - inputValue) / 2}%, 0, 0)`,
                  }}
                  className="animate-track-fill"
                ></div>
                <div
                  style={{
                    transform: `translate3d(-${
                      (200 - inputValue) / 2
                    }%, -50%, 0)`,
                  }}
                  className="animate-track"
                >
                  <div className="circle"></div>
                </div>

                <div className="fill-track"></div>
              </div>
            </div>
          </div>
          <Ripple.Button
            className="submit-btn"
            onClick={
              type === "profile" ? handleSubmitProfile : handleSubmitGroup
            }
          >
            SUBMIT
          </Ripple.Button>
        </div>
      </div>

      <div
        onClick={() => setTogglePopupWait(false)}
        className={`click-catcher ${
          togglePopupWait ? "show-fade-half" : "hide-fade-half"
        }`}
        style={{ zIndex: "15" }}
      ></div>
    </>
  );
}

export default PreviewAvatar;
