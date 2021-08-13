import React, { useEffect, useState, useRef, useContext } from "react";
import { categories } from "../../utils/gifCategories";
import { useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faArrowLeft,
  faLessThan,
} from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import Ripple from "../Effects/Ripple";
import { UserContext } from "../../context/UserContext";

const FlareKey = "PLHRTZN7D20S";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function Gif({ setInitMessages }) {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const imgRef = useRef(null);
  const gifContainer = useRef(null);
  const topRef = useRef(null);

  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [columns, setColumns] = useState(0);
  const [columnsCount, setColumnsCount] = useState(0);
  const [gifsOrder, setGifsOrder] = useState([]);
  const [freeze, setFreeze] = useState(false);

  // const [gifLoadedCount, setGifLoadedCount] = useState([]);
  const [gifsHasLoaded, setGifsHasLoaded] = useState(false);
  const [showGifs, setShowGifs] = useState(false);
  // const gifLoaded

  // useEffect(() => {
  //   console.log(gifLoadedCount);
  // }, []);

  // const handleSetGifLoaded = () => {
  //   const copy = [...gifLoadedCount];
  //   copy.push(true);
  //   setGifLoadedCount(copy);
  // };

  useEffect(() => {
    if (gifs.length === 0) return;
    handleSetGifsOrder();
  }, [gifs]);

  const handleSetColumnsCount = () => {
    let columnsCount = Math.floor(getWindowDimensions().width / 200);
    if (columnsCount < 2) columnsCount = 2;
    if (columnsCount > 6) columnsCount = 6;
    return columnsCount;
  };

  const handleSetGifsOrder = () => {
    const columnsCount = handleSetColumnsCount();
    setColumnsCount(columnsCount);
    const columnsArray = createArrayFromNum(columnsCount);
    setColumns(columnsArray);

    const gifsCopy = [...gifs];
    let array = [];
    for (let i = 0; i < columnsCount; i++) {
      let subArr = [];
      for (let j = columnsArray[i]; j < gifsCopy.length; j += columnsCount) {
        subArr.push(gifsCopy[j]);
      }
      array.push(subArr);
    }

    setGifsOrder(array);
  };

  const createArrayFromNum = (num) => {
    let arr = [];
    for (let i = 0; i < num; i++) arr.push(i);
    return arr;
  };

  // useEffect(() => {
  //   if (gifs.length === 0) return;
  //   if (gifLoadedCount === gifs.length) setGifsHasLoaded(true);
  // }, [gifLoadedCount]);

  useEffect(() => {
    if (query.length === 0) {
      setGifs([]);
      gifContainer.current && gifContainer.current.scrollTo(0, 0);
      return;
    }

    const timer = setTimeout(() => setFreeze(false), 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!freeze) setShowGifs(false);
    if (!freeze && query.length > 0) handleQueryGifs(query);
  }, [freeze]);

  const handleChangeQuery = (query) => {
    setQuery(query);
    setFreeze(true);
  };

  const handleQueryGifs = async (query) => {
    setQuery(query);
    const res = await fetch(
      `https://g.tenor.com/v1/search?q=${query}&key=${FlareKey}&media_filter=minimal&limit=50`
    );
    const data = await res.json();
    setGifs(data.results);
    console.log(data.results);
    setShowGifs(true);
  };

  const handleWindowResize = () => {
    const columnsCount = handleSetColumnsCount();
    if (columnsCount !== columns) handleSetGifsOrder();
  };
  window.onresize = handleWindowResize;

  const handleSendGif = async (url, source) => {
    const chatId = location.pathname.replace("/chat/", "");
    if (!user.chats.includes(chatId)) return;
    const myMessage = submitUI(url, source);
    await fetch(`/api/messages/${chatId}?type=gif`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, source }),
    });
  };

  const submitUI = (url, source) => {
    const { avatar, username, id } = user;
    const author = { avatar, username, _id: id };

    const message = {
      _id: uuidv4(),
      createdAt: new Date(),
      gif: { url, source },
      files: [],
      showAvatar: true,
      isLoading: false,
      isNewMessage: true,
      author,
    };

    setInitMessages((messages) => [message, ...messages]);
    return message;
  };

  function testImage(url, timeout = 5000) {
    return new Promise(function (resolve, reject) {
      var timer,
        img = new Image();
      img.onerror = img.onabort = function () {
        clearTimeout(timer);
        reject("error");
      };
      img.onload = function () {
        clearTimeout(timer);
        resolve("success");
      };
      timer = setTimeout(function () {
        // reset .src to invalid URL so it stops previous
        // loading, but doens't trigger new load
        img.src = "//!!!!/noexist.jpg";
        reject("timeout");
      }, timeout);
      img.src = url;
    });
  }

  return (
    <div className="gif-container">
      <div className="input-wrapper">
        {query.length === 0 ? null : (
          <Ripple.Div
            style={{
              width: "40px",
              height: "40px",
              display: "grid",
              placeItems: "center",
              color: "white",
              borderRadius: "100%",
              marginLeft: "14px",
            }}
            onClick={() => setQuery("")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Ripple.Div>
        )}

        <div
          className="search-box"
          style={{ background: "unset", height: "56px" }}
        >
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            className="search"
            placeholder="Search GiF"
            style={{ background: "#2f2f2f" }}
            defaultValue={query}
            onChange={(e) => handleChangeQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="__gif-wrapper__" style={{ overflowY: "auto" }}>
        <ul
          ref={gifContainer}
          className={gifs.length > 0 ? "query-gifs" : ""}
          style={!showGifs && gifs.length > 0 ? { visibility: "hidden" } : null}
        >
          {gifs && gifs.length > 0
            ? gifsOrder &&
              gifsOrder.map((gifs) => {
                return (
                  <div key={uuidv4()} className="column">
                    {gifs.map((gif) => {
                      return (
                        <li key={gif.id}>
                          <img
                            src={gif.media[0].tinygif.url}
                            alt=""
                            className="gif-img"
                            onClick={() =>
                              handleSendGif(gif.url, gif.media[0].tinygif.url)
                            }
                            // ref={imgRef}
                            // onLoad={() => handleSetGifLoaded()}
                            // onLoad={() =>
                            //   setGifLoadedCount((count) => count + 1)
                            // }
                          />
                        </li>
                      );
                    })}
                  </div>
                );
              })
            : categories.map((gif) => {
                return (
                  <li key={uuidv4()}>
                    <div
                      onClick={() => handleQueryGifs(gif.query)}
                      className="overlay"
                    >
                      {gif.query}
                    </div>
                    <img src={gif.url} alt="" />
                  </li>
                );
              })}
        </ul>
      </div>
    </div>
  );
}

export default Gif;
