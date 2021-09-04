import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import FindFriends from "../components/AddFriends/FindFriends";
import SentRequests from "../components/AddFriends/SentRequests";
import UsersList from "../components/AddFriends/UsersList";
import { IonPage, IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";
import { findUserAndRemove } from "../utils/friends";
import Ripple from "../components/Effects/Ripple";

function AddFriends() {
  const [pageNum, setPageNum] = useState(0);

  // const [btn0, setBtn0] = useState(null);
  // const [btn1, setBtn1] = useState(null);
  const [sliderStyle, setSliderStyle] = useState([{}, {}]);

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendsAndPending, setFriendsAndPending] = useState([]); // use this to avoid rendering friends when searching

  useEffect(() => {
    getFriends();
    setPageBtns();
  }, []);

  const setPageBtns = () => {
    if (
      document.querySelector(`button[data-name="btn0"]`) &&
      document.querySelector(`button[data-name="btn1"]`)
    ) {
      const btn0 = document.querySelector(`button[data-name="btn0"]`);
      const btn1 = document.querySelector(`button[data-name="btn1"]`);

      let sliderStyle = [];
      sliderStyle[1] = {
        width: `${btn1.offsetWidth}px`,
        transform: `translate3d(${btn0.offsetWidth}px,0,0)`,
      };
      sliderStyle[0] = {
        width: `${btn0.offsetWidth}px`,
        transform: `translate3d(0,0,0)`,
      };

      setSliderStyle(sliderStyle);
    }
  };
  window.onresize = setPageBtns;

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
          <div className="select-page-container">
            <div>
              <Ripple.Button onClick={() => setPageNum(0)} dataName="btn0">
                Add
              </Ripple.Button>
              <Ripple.Button onClick={() => setPageNum(1)} dataName="btn1">
                Sent Requests
              </Ripple.Button>
              <div
                className="page-line-slider"
                style={pageNum ? { ...sliderStyle[1] } : { ...sliderStyle[0] }}
              ></div>
            </div>
          </div>

          <div
            className="content-wrapper"
            style={
              pageNum === 0
                ? { transform: "translate3d(-0%, 0, 0)" }
                : { transform: "translate3d(-50%, 0, 0)" }
            }
          >
            <FindFriends
              incomingRequests={incomingRequests}
              handleRequest={handleRequest}
            />
            <SentRequests
              sentRequests={sentRequests}
              handleRequest={handleRequest}
            />
          </div>

          {/* </SwipeableViews> */}
        </>
      )}
    </IonPage>
  );
}

export default AddFriends;
