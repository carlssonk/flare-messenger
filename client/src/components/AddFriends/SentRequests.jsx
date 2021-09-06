import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Avatar from "../Avatar";
import Ripple from "../Effects/Ripple"

function SentRequests({ sentRequests, handleRequest }) {
  return (
    <div className="page-section">
      <ul className="incoming__requests users-list">
        {sentRequests &&
          sentRequests.map((e) => {
            return (
              <li key={e._id}>
                <div className="section">
                  <Avatar
                    page="add-friends"
                    user={e}
                    style={{ width: "40px", height: "40px", fontSize: "18px" }}
                  />
                  <div className="name">{e.username}</div>
                </div>
                <Ripple.Button onClick={() => handleRequest("cancel", e._id)} className="cancel-request-btn">
                  <FontAwesomeIcon icon={faTimes} className="cross-btn" />
                </Ripple.Button>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default SentRequests;
