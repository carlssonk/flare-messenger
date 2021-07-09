import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Jeb_ from "../../imgs/Jens-Bergensten.png";

function SentRequests({ sentRequests, handleRequest }) {
  return (
    <div>
      <ul className="incoming__requests users-list">
        {sentRequests &&
          sentRequests.map((e) => {
            return (
              <li key={e._id}>
                <div>
                  <div className="img-box">
                    <img src={Jeb_} alt="" />
                  </div>
                  <div className="name">{e.username}</div>
                </div>
                <button onClick={() => handleRequest("cancel", e._id)}>
                  <FontAwesomeIcon icon={faTimes} className="cross-btn" />
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default SentRequests;
