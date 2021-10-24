import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import Avatar from "../Avatar";
import Ripple from "../Effects/Ripple"

function SentRequests({ sentRequests, handleRequest }) {
  return (
    <div className="page-section">

      {sentRequests && sentRequests.length === 0 ? (
        <div className="empty-requests-wrapper">
          <div className="main-label">Click <span> <FontAwesomeIcon icon={faSearch} /> </span> input to search for friends.</div>
        </div>
      ):null}

      <ul className="incoming__requests users-list" style={sentRequests && sentRequests.length > 0 ? {opacity: "1"} : null}>
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
