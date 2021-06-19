import React from "react";
import { IonButton } from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import Jeb_ from "../../imgs/Jens-Bergensten.png";
import { Scroll } from "framer";

function FindFriends({ toggleScroll }) {
  return (
    <div className="incoming-requests-wrapper">
      <Scroll
        style={{ height: "100%", width: "100%", position: "relative" }}
        dragElastic={0.2}
        dragEnabled={toggleScroll}
      >
        <div className="incoming__label">Incoming Requests</div>

        <ul className="incoming__requests">
          <li>
            <div>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="name">Jens Bergensten</div>
            </div>
            <div>
              <IonButton className="accept-btn">
                Accept
                <FontAwesomeIcon icon={faUserPlus} />
              </IonButton>
              <FontAwesomeIcon icon={faTimes} className="reject-btn" />
            </div>
          </li>
          <li>
            <div>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="name">Jens Bergensten</div>
            </div>
            <div>
              <IonButton className="accept-btn">
                Accept
                <FontAwesomeIcon icon={faUserPlus} />
              </IonButton>
              <FontAwesomeIcon icon={faTimes} className="reject-btn" />
            </div>
          </li>
          <li>
            <div>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="name">Jens Bergensten</div>
            </div>
            <div>
              <IonButton className="accept-btn">
                Accept
                <FontAwesomeIcon icon={faUserPlus} />
              </IonButton>
              <FontAwesomeIcon icon={faTimes} className="reject-btn" />
            </div>
          </li>
          <li>
            <div>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="name">Jens Bergensten</div>
            </div>
            <div>
              <IonButton className="accept-btn">
                Accept
                <FontAwesomeIcon icon={faUserPlus} />
              </IonButton>
              <FontAwesomeIcon icon={faTimes} className="reject-btn" />
            </div>
          </li>
          <li>
            <div>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="name">Jens Bergensten</div>
            </div>
            <div>
              <IonButton className="accept-btn">
                Accept
                <FontAwesomeIcon icon={faUserPlus} />
              </IonButton>
              <FontAwesomeIcon icon={faTimes} className="reject-btn" />
            </div>
          </li>
          <li>
            <div>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="name">Jens Bergensten</div>
            </div>
            <div>
              <IonButton className="accept-btn">
                Accept
                <FontAwesomeIcon icon={faUserPlus} />
              </IonButton>
              <FontAwesomeIcon icon={faTimes} className="reject-btn" />
            </div>
          </li>
          <li>
            <div>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="name">Jens Bergensten</div>
            </div>
            <div>
              <IonButton className="accept-btn">
                Accept
                <FontAwesomeIcon icon={faUserPlus} />
              </IonButton>
              <FontAwesomeIcon icon={faTimes} className="reject-btn" />
            </div>
          </li>
          <li>
            <div>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="name">Jens Bergensten</div>
            </div>
            <div>
              <IonButton className="accept-btn">
                Accept
                <FontAwesomeIcon icon={faUserPlus} />
              </IonButton>
              <FontAwesomeIcon icon={faTimes} className="reject-btn" />
            </div>
          </li>
          <li>
            <div>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="name">Jens Bergensten</div>
            </div>
            <div>
              <IonButton className="accept-btn">
                Accept
                <FontAwesomeIcon icon={faUserPlus} />
              </IonButton>
              <FontAwesomeIcon icon={faTimes} className="reject-btn" />
            </div>
          </li>
          <li>
            <div>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="name">Jens Bergensten</div>
            </div>
            <div>
              <IonButton className="accept-btn">
                Accept
                <FontAwesomeIcon icon={faUserPlus} />
              </IonButton>
              <FontAwesomeIcon icon={faTimes} className="reject-btn" />
            </div>
          </li>
          <li>
            <div>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="name">Jens Bergensten</div>
            </div>
            <div>
              <IonButton className="accept-btn">
                Accept
                <FontAwesomeIcon icon={faUserPlus} />
              </IonButton>
              <FontAwesomeIcon icon={faTimes} className="reject-btn" />
            </div>
          </li>
          <li>
            <div>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="name">Jens Bergensten</div>
            </div>
            <div>
              <IonButton className="accept-btn">
                Accept
                <FontAwesomeIcon icon={faUserPlus} />
              </IonButton>
              <FontAwesomeIcon icon={faTimes} className="reject-btn" />
            </div>
          </li>
          <li>
            <div>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="name">Jens Bergensten</div>
            </div>
            <div>
              <IonButton className="accept-btn">
                Accept
                <FontAwesomeIcon icon={faUserPlus} />
              </IonButton>
              <FontAwesomeIcon icon={faTimes} className="reject-btn" />
            </div>
          </li>
          <li>
            <div>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="name">Jens Bergensten</div>
            </div>
            <div>
              <IonButton className="accept-btn">
                Accept
                <FontAwesomeIcon icon={faUserPlus} />
              </IonButton>
              <FontAwesomeIcon icon={faTimes} className="reject-btn" />
            </div>
          </li>
          <li>
            <div>
              <div className="img-box">
                <img src={Jeb_} alt="" />
              </div>
              <div className="name">Jens Bergensten</div>
            </div>
            <div>
              <IonButton className="accept-btn">
                Accept
                <FontAwesomeIcon icon={faUserPlus} />
              </IonButton>
              <FontAwesomeIcon icon={faTimes} className="reject-btn" />
            </div>
          </li>
        </ul>
      </Scroll>
    </div>
  );
}

export default FindFriends;
