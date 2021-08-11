import React, { useEffect, useState, useRef } from "react";
import { categories } from "../../utils/gifCategories";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

const FlareKey = "PLHRTZN7D20S";

function Gif() {
  const imgRef = useRef(null);
  const [gifs, setGifs] = useState([]);
  // useEffect(() => {
  //   const getInitialGifData = async () => {
  //     for (let i = 0; i < categories.length; i++) {
  //       const res = await fetch(
  //         `https://g.tenor.com/v1/search?q=${categories[i].query}&key=${FlareKey}&media_filter=minimal&limit=1`
  //       );
  //       const data = await res.json();
  //       categories[i].url = data.results[0].media[0].tinygif.url;
  //     }
  //     console.log(categories);
  //   };

  //   getInitialGifData();
  // }, []);

  const handleQueryGifs = async (query) => {
    const res = await fetch(
      `https://g.tenor.com/v1/search?q=${query}&key=${FlareKey}&media_filter=minimal`
    );
    const data = await res.json();
    setGifs(data.results);
    console.log(data.results);
  };

  return (
    <div className="gif-container">
      <div className="input-wrapper">
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
          />
        </div>
      </div>

      <div
        className="__gif-wrapper__"
        style={gifs.length === 0 ? { overflowY: "auto" } : null}
      >
        <ul className={gifs.length > 0 ? "query-gifs" : ""}>
          {gifs && gifs.length > 0
            ? gifs.map((gif) => {
                return (
                  <li key={gif.id}>
                    <img src={gif.media[0].tinygif.url} alt="" ref={imgRef} />
                  </li>
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
