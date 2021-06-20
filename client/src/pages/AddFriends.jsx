import React, { useState } from "react";
import Header from "../components/Header";
import FindFriends from "../components/addFriends/FindFriends";
import SentRequests from "../components/addFriends/SentRequests";
import SwipeableViews from "react-swipeable-views";
import { IonPage, IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";

function AddFriends() {
  const [pageNum, setPageNum] = useState(0);
  const [toggleScroll, setToggleScroll] = useState(true);

  const [search, setSearch] = useState("");

  const handleFindUsers = async (e) => {
    // setSearch(e.target.value)
    const res = await fetch(`/api/friends?search${e.target.value}`);
    const users = await res.json();
    console.log(users);
  };

  return (
    <IonPage className="add-page page">
      <Header handleFindUsers={handleFindUsers} />
      <IonSegment swipeGesture="false">
        <IonSegmentButton
          className={
            pageNum === 0
              ? "segment-button-checked switch-btn"
              : "segment-button-after-checked switch-btn"
          }
          onClick={() => setPageNum(0)}
          value={0}
        >
          <IonLabel>Add Friends</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton
          className={
            pageNum === 1
              ? "segment-button-checked switch-btn"
              : "segment-button-after-checked switch-btn"
          }
          onClick={() => setPageNum(1)}
          value={1}
        >
          <IonLabel>Sent Requests</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      <SwipeableViews
        enableMouseEvents
        index={pageNum}
        hysteresis={0.5}
        onChangeIndex={() => (pageNum === 0 ? setPageNum(1) : setPageNum(0))}
        onSwitching={() => setToggleScroll(false)}
        onTransitionEnd={() => setToggleScroll(true)}
        style={{ height: "100%" }}
      >
        <FindFriends toggleScroll={toggleScroll} />
        <SentRequests />
      </SwipeableViews>
    </IonPage>
  );
}

export default AddFriends;
