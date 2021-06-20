import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import FindFriends from "../components/addFriends/FindFriends";
import SentRequests from "../components/addFriends/SentRequests";
import SwipeableViews from "react-swipeable-views";
import UsersList from "../components/addFriends/UsersList";
import { IonPage, IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";

function AddFriends() {
  const [pageNum, setPageNum] = useState(0);
  const [toggleScroll, setToggleScroll] = useState(true);

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const handleFindUsers = async (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") return setUsers([]);
    const res = await fetch(`/api/friends?search=${e.target.value}`);
    const data = await res.json();
    setUsers(data.foundUsers);
  };

  const handleAddUser = async (id) => {
    console.log("add");
    const res = await fetch(`/api/friends/request?id=${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    await res.json();
    const usersCopy = [...users];
    const findIdx = usersCopy.findIndex((e) => e._id === id);
    if (findIdx >= 0) usersCopy.splice(findIdx, 1);
    setUsers(usersCopy);
  };

  const getIncomingRequests = async () => {
    const res = await fetch(`/api/friends/incoming`);
    const data = await res.json();
    setIncomingRequests(data.incoming);
  };
  const getSentRequests = async () => {
    const res = await fetch(`/api/friends/incoming`);
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    getIncomingRequests();
  }, []);

  return (
    <IonPage className="add-page page">
      <Header handleFindUsers={handleFindUsers} />
      {search.length > 0 ? (
        <UsersList users={users} handleAddUser={handleAddUser} />
      ) : (
        <>
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
            onChangeIndex={() =>
              pageNum === 0 ? setPageNum(1) : setPageNum(0)
            }
            onSwitching={() => setToggleScroll(false)}
            onTransitionEnd={() => setToggleScroll(true)}
            style={{ height: "100%" }}
          >
            <FindFriends
              toggleScroll={toggleScroll}
              incomingRequests={incomingRequests}
            />
            <SentRequests />
          </SwipeableViews>
        </>
      )}
    </IonPage>
  );
}

export default AddFriends;
