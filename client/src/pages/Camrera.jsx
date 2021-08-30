import React, { useRef, useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavContext } from "../context/NavContext";
import { useLocation, useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import {
  faChevronLeft,
  faChevronRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Ripple from "../components/Effects/Ripple";

function Camrera() {
  const history = useHistory();

  const imageTag = useRef(null);
  const videoTagUse = useRef(null);
  const videoTagShow = useRef(null);
  // const videoTagUnderlay = useRef(null);
  const canvasTag = useRef(null);

  const [prevPath, setPrevPath] = useState(null);
  const [stream, setStream] = useState(null);
  const [stream2, setStream2] = useState(null);
  // const [stream2, setStream2] = useState(null);
  const [toggleVideo, setToggleVideo] = useState(true);
  const [blob, setBlob] = useState("");

  const { setNav } = useContext(NavContext);

  const handleNavigation = (to, goBack) => {
    setTimeout(() => {
      if (!stream || !stream2) return;
      stream.getVideoTracks()[0].stop();
      stream2.getVideoTracks()[0].stop();
    }, 400);

    if (!blob || goBack) {
      setNav("backward");
      setTimeout(() => history.push(to), 10);
      return;
    } else {
      setNav("forward");
    }

    const files = setFiles();

    setTimeout(
      () =>
        history.push({
          pathname: to,
          state: { ...history.location.state, files },
        }),
      10
    );
  };

  const setFiles = () => {
    const file = dataURLtoFile(blob, "img");
    const filesObjArr = {
      file,
      url: blob,
      id: uuidv4(),
    };

    if (history.location.state)
      return [...history.location.state.files, filesObjArr];
    return [filesObjArr];
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  useEffect(() => {
    getStream();
  }, []);

  useEffect(() => {
    if (history.location.state) setPrevPath(history.location.state.path);
  }, [history]);

  useEffect(() => {
    if (toggleVideo) imageTag.current.src = "";
  }, [toggleVideo]);

  function getUserMedia(options, successCallback, failureCallback) {
    var api =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    if (api) {
      return api.bind(navigator)(options, successCallback, failureCallback);
    }
  }

  // var theStream;

  function getStream() {
    if (
      !navigator.getUserMedia &&
      !navigator.webkitGetUserMedia &&
      !navigator.mozGetUserMedia &&
      !navigator.msGetUserMedia
    ) {
      alert("User Media API not supported.");
      return;
    }

    var constraints = {
      video: true,
    };

    // setGetUserMedia(videoTagUnderlay.current, constraints, true);
    setGetUserMedia(videoTagShow.current, constraints, true);
    setGetUserMedia(videoTagUse.current, constraints, false);
  }

  const setGetUserMedia = (element, constraints, bool) => {
    getUserMedia(
      constraints,
      function (stream) {
        var mediaControl = element;
        if ("srcObject" in mediaControl) {
          mediaControl.srcObject = stream;
        } else if (navigator.mozGetUserMedia) {
          mediaControl.mozSrcObject = stream;
        } else {
          mediaControl.src = (window.URL || window.webkitURL).createObjectURL(
            stream
          );
        }
        bool ? setStream2(stream) : setStream(stream);
      },
      function (err) {
        alert("Error: " + err);
      }
    );
  };

  function takePhoto() {
    if (!("ImageCapture" in window)) {
      alert("ImageCapture is not available");
      return;
    }

    if (!stream) return;

    const WIDTH = videoTagUse.current.clientWidth;
    const HEIGHT = videoTagUse.current.clientHeight;

    canvasTag.current.width = WIDTH;
    canvasTag.current.height = HEIGHT;

    console.log(canvasTag.current.width);

    canvasTag.current
      .getContext("2d")
      .drawImage(videoTagUse.current, 0, 0, WIDTH, HEIGHT);

    console.log(canvasTag.current);
    const dataURL = canvasTag.current.toDataURL();
    imageTag.current.src = dataURL;
    setBlob(dataURL);
    setToggleVideo(false);
  }

  return (
    <div className="page camera-page">
      <Ripple.Div
        onClick={() => {
          setBlob("");
          handleNavigation(prevPath || "/", true);
        }}
        className="go-back-btn"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </Ripple.Div>

      <div className="video-wrapper">
        <div className="video-container">
          <video
            ref={videoTagShow}
            autoPlay
            className="video-box-show"
            style={toggleVideo ? null : { visibility: "hidden" }}
          ></video>
          <video
            ref={videoTagUse}
            autoPlay
            className="video-box"
            style={{ visibility: "hidden" }}
          ></video>
          {/* <video
            ref={videoTagUnderlay}
            autoPlay
            className="video-box-underlay"
            style={toggleVideo ? null : { visibility: "hidden" }}
          ></video> */}
          <img ref={imageTag} src="" alt="" className="image-box" />
          <canvas ref={canvasTag} style={{ display: "none" }}></canvas>
        </div>
      </div>

      <div
        className="controller-box"
        style={toggleVideo ? { justifyContent: "center" } : null}
      >
        {!toggleVideo ? (
          <>
            <Ripple.Div
              onClick={() => {
                setBlob("");
                setToggleVideo(true);
              }}
              className="retake-photo-btn action-btn"
            >
              Retake
            </Ripple.Div>

            {history.location.state ? (
              <Ripple.Div
                onClick={() => handleNavigation(prevPath || "/")}
                className="send-photo-btn action-btn"
              >
                Use
                <FontAwesomeIcon icon={faChevronRight} />
              </Ripple.Div>
            ) : (
              <Ripple.Div
                onClick={() => handleNavigation("/send-photo")}
                className="send-photo-btn action-btn"
              >
                Send To
                <FontAwesomeIcon icon={faChevronRight} />
              </Ripple.Div>
            )}
          </>
        ) : null}

        {toggleVideo ? (
          <button
            onClick={() => takePhoto()}
            className="take-photo-btn"
          ></button>
        ) : null}
      </div>
    </div>
  );
}

export default Camrera;
