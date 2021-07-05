import React, { useEffect, useRef, useState } from "react";

import Draggable from "react-draggable";

import { getImgSizeInfo } from "../../utils/previewAvatar";

import CheckifCircleIsOutsideBounds from "./CheckIfCircleIsOutsideBounds";

function PreviewAvatar({ togglePopup, handleTogglePopup, imageUrl }) {
  const boxRef = useRef(null);
  const nodeRef = useRef(null);
  const imageRef = useRef(null);
  const circleRef = useRef(null);
  const imageWrapperRef = useRef(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [circleSize, setCircleSize] = useState();
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

  const calculatePosition = () => {
    const SCALE =
      imageSize.naturalWidth < imageSize.naturalHeight
        ? imageSize.naturalWidth
        : imageSize.naturalHeight;

    const ZOOM = Math.round(SCALE / scaleValue);

    console.log("ZOOM " + ZOOM);

    const { top: circleTOP, left: circleLEFT } =
      circleRef.current.getBoundingClientRect();

    const { top: imageTOP, left: imageLEFT } =
      imageRef.current.getBoundingClientRect();

    const { top: imageNaturalTOP, left: imageNaturalLEFT } = getImgSizeInfo(
      imageRef.current
    );

    const SCALE_TO_NATURAL = imageSize.naturalHeight / imageSize.height;

    const FindX = Math.round(
      ((circleLEFT - (imageLEFT + imageNaturalLEFT * scaleValue)) *
        SCALE_TO_NATURAL) /
        scaleValue
    );
    const FindY = Math.round(
      ((circleTOP - (imageTOP + imageNaturalTOP * scaleValue)) *
        SCALE_TO_NATURAL) /
        scaleValue
    );

    return { ZOOM, FindX, FindY };
  };

  const handleWindowResize = () => {
    setWindowIsResizing((bool) => !bool);
    const imageInfo = getImgSizeInfo(imageRef.current);
    setImageSize({
      width: imageInfo.width,
      height: imageInfo.height,
      naturalWidth: imageInfo.naturalWidth,
      naturalHeight: imageInfo.naturalHeight,
    });
    console.log(calculatePosition());
  };
  window.onresize = handleWindowResize;

  // HOW TO SCALE IMAGE ACCORDINGLY USING CLOUDINARY API
  // https://res.cloudinary.com/plexeronthecloud/image/upload/ar_1,c_crop,w_${Zoom},x_${FindX},y_${FindY}/v1625506265/YelpCamp/boxes_mqd5wg.png

  return (
    <>
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
      <div className="popup-wrapper">
        <div
          className={`popup-container ${
            togglePopup ? "popup-show" : "popup-hide"
          }`}
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
                      onLoad={() => setImageLoaded(true)}
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
