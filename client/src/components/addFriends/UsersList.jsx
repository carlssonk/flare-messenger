import React from "react";
import { IonButton } from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Jeb_ from "../../imgs/Jens-Bergensten.png";

function UsersList({ users, handleAddUser, friendsAndPending }) {
  const isDuplicate = (id) => {
    if (friendsAndPending.some((e) => e._id === id)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <ul className="users-list">
      {users.map((e) => {
        return (
          <React.Fragment key={e._id}>
            {isDuplicate(e._id) ? null : (
              <li>
                <div>
                  <div className="img-box">
                    <img src={Jeb_} alt="" />
                  </div>
                  <div className="name">{e.username}</div>
                </div>
                <div>
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
