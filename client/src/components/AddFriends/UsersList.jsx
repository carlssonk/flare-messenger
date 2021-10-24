import React from "react";
import { IonButton } from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Avatar from "../Avatar";

function UsersList({ users, handleAddUser, friendsAndPending }) {
  const isDuplicate = (id) => {
    if (friendsAndPending.some((e) => e._id === id)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <ul className="users-list" style={users.length > 0 ? {opacity: "1"} : null}>
      {users.map((e) => {
        return (
          <React.Fragment key={e._id}>
            {isDuplicate(e._id) ? null : (
              <li className="list-item">
                <div className="section">
                  <Avatar
                    page="add-friends"
                    user={e}
                    style={{ width: "40px", height: "40px", fontSize: "18px" }}
                  />
                  <div className="name">{e.username}</div>
                </div>
                <div className="section">
                  <IonButton
                    className="accept-btn"
                    onClick={() => handleAddUser(e._id)}
                  >
                    Add
                    <FontAwesomeIcon icon={faUserPlus} />
                  </IonButton>
                </div>
              </li>
            )}
          </React.Fragment>
        );
      })}
    </ul>
  );
}

export default UsersList;
