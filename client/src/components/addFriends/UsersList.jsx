import React from "react";
import { IonButton } from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import Jeb_ from "../../imgs/Jens-Bergensten.png";

function UsersList({ users, handleAddUser }) {
  return (
    <ul className="users-list">
      {users.map((e) => {
        return (
          <li key={e._id}>
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
        );
      })}
    </ul>
  );
}

export default UsersList;
