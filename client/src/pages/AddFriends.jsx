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
  const [friendsAndPending, setFriendsAndPending] = useState([]); // use this to avoid rendering friends when searching

  useEffect(() => {
    getFriends();
  }, []);

  const handleFindUsers = async (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") return setUsers([]);
    const res = await fetch(`/api/friends?search=${e.target.value}`);
    const data = await res.json();
    console.log(data.foundUsers);
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
    await res.json();
    removeUserFromArray("users", id);
  };

  // Accept || Reject || Cancel
  const handleRequest = async (action, id) => {
    console.log(action);
    console.log(id);
    const res = await fetch(`/api/friends/handle?action=${action}&id=${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    await res.json();
    if (action === "accept" || action === "reject") {
      removeUserFromArray("incomingRequests", id, action);
    }
    if (action === "cancel") {
      removeUserFromArray("sentRequests", id, action);
    }
  };

  const removeUserFromArray = (array, id, action) => {
    if (array === "users") {
      const usersCopy = [...users];
      const findIdx = usersCopy.findIndex((e) => e._id === id);

      // Add user to sentRequests array and all friends array
      console.log(usersCopy[findIdx]);
      setSentRequests((sentRequests) => [...sentRequests, usersCopy[findIdx]]);
      setFriendsAndPending((friendsAndPending) => [
        ...friendsAndPending,
        usersCopy[findIdx],
      ]);

      if (findIdx >= 0) usersCopy.splice(findIdx, 1);
      setUsers(usersCopy);
    }
    if (array === "incomingRequests") {
      const incomingCopy = [...incomingRequests];
      const findIdx = incomingCopy.findIndex((e) => e._id === id);
      if (findIdx >= 0) incomingCopy.splice(findIdx, 1);
      setIncomingRequests(incomingCopy);

      console.log(action);
      if (action !== "reject") return;
      const pendingCopy = [...friendsAndPending];
      const findIdx2 = pendingCopy.findIndex((e) => e._id === id);
      if (findIdx2 >= 0) pendingCopy.splice(findIdx2, 1);
      setFriendsAndPending(pendingCopy);
    }

    if (array === "sentRequests") {
      const sentCopy = [...sentRequests];
      const findIdx = sentCopy.findIndex((e) => e._id === id);
      if (findIdx >= 0) sentCopy.splice(findIdx, 1);
      setSentRequests(sentCopy);

      const pendingCopy = [...friendsAndPending];
      const findIdx2 = pendingCopy.findIndex((e) => e._id === id);
      if (findIdx2 >= 0) pendingCopy.splice(findIdx2, 1);
      setFriendsAndPending(pendingCopy);
    }
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
