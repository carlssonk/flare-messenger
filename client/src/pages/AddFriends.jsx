import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import FindFriends from "../components/addFriends/FindFriends";
import SentRequests from "../components/addFriends/SentRequests";
import SwipeableViews from "react-swipeable-views";
import UsersList from "../components/addFriends/UsersList";
import { IonPage, IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";
import { findUserAndRemove } from "../utils/friends";

function AddFriends() {
  const [pageNum, setPageNum] = useState(0);
  const [toggleScroll, setToggleScroll] = useState(true);

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendsAndPending, setFriendsAndPending] = useState([]); // use this to avoid rendering friends when searching

  useEffect(() => {
    getFriends();
  }, []);

  const handleFindUsers = async (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") return setUsers([]);
    const res = await fetch(`/api/friends?search=${e.target.value}`);
    const data = await res.json();
    setUsers(data.foundUsers);
  };

  const handleAddUser = async (id) => {
    const res = await fetch(`/api/friends/request?id=${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data.friends) handleYouAreNowFriends();
    handleUpdateArraysAdd(id);
  };

  const handleUpdateArraysAdd = (id) => {
    const usersCopy = [...users];
    const findIdx = usersCopy.findIndex((e) => e._id === id);
    // Add to sent requests array
    setSentRequests((sentRequests) => [...sentRequests, usersCopy[findIdx]]);
    // Add to friends and pending array
    setFriendsAndPending((friendsAndPending) => [
      ...friendsAndPending,
      usersCopy[findIdx],
    ]);
  };

  // Accept || Reject || Cancel
  const handleRequest = async (action, id) => {
    const res = await fetch(`/api/friends/handle?action=${action}&id=${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    await res.json();
    if (action === "accept") {
      removeUserFromArray("incomingRequests", id);
      handleYouAreNowFriends();
    }
    if (action === "reject") {
      removeUserFromArray("incomingRequests", id);
      removeFromFriendsAndPending(id);
    }
    if (action === "cancel") {
      removeUserFromArray("sentRequests", id);
      removeFromFriendsAndPending(id);
    }
  };

  const removeUserFromArray = (array, id) => {
    if (array === "incomingRequests") {
      const updatedArray = findUserAndRemove(incomingRequests, id);
      setIncomingRequests(updatedArray);
    }

    if (array === "sentRequests") {
      const updatedArray = findUserAndRemove(sentRequests, id);
      setSentRequests(updatedArray);
    }
  };

  const removeFromFriendsAndPending = (id) => {
    const updatedArrayB = findUserAndRemove(friendsAndPending, id);
    setFriendsAndPending(updatedArrayB);
  };

  const handleYouAreNowFriends = () => {
    alert("you are now friends!");
  };

  const getFriends = async () => {
    const res = await fetch(`/api/friends/friendsandpending`);
    const data = await res.json();
    setFriendsAndPending(data.sentIncomingAndFriends);
    setIncomingRequests(data.incoming);
    setSentRequests(data.sent);
  };

  return (
    <IonPage className="add-page page">
      <Header handleFindUsers={handleFindUsers} />
      {search.length > 0 ? (
        <UsersList
          users={users}
          friendsAndPending={friendsAndPending}
          handleAddUser={handleAddUser}
          handleRequest={handleRequest}
        />
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
              handleRequest={handleRequest}
            />
            <SentRequests
              sentRequests={sentRequests}
              handleRequest={handleRequest}
            />
          </SwipeableViews>
        </>
      )}
    </IonPage>
  );
}

export default AddFriends;
