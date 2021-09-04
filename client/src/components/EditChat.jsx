import React, { useState, useEffect } from "react";

import { chatColors } from "../utils/chat";
import { v4 as uuidv4 } from "uuid";
import Ripple from "./Effects/Ripple";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faArchive,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import { IonAlert } from "@ionic/react";

function EditChat({
  page,
  selectedChats,
  setToggleEditChat,
  chats,
  setChats,
  toggleEditChat,
  setShowPopover,
  setChatStatus,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removeThumbtack, setRemoveThumbtack] = useState(false);
  const [toggleTrashChat, setToggleTrashChat] = useState(false);
  const [toggleColors, setToggleColors] = useState(false);

  useEffect(() => {
    if (!selectedChats) return;
    console.log(selectedChats);
    if (
      selectedChats.length > 0 &&
      selectedChats.every((e) => e.status === 1)
    ) {
      console.log("REMOVE THUMBTACK");
      setRemoveThumbtack(true);
    } else {
      setRemoveThumbtack(false);
    }
  }, [selectedChats]);

  const editChatStatus = async (status) => {
    console.log(selectedChats[0]);
    console.log(page);

    console.log(status);
    if (isSubmitting) return;
    setIsSubmitting(true);

    setShowPopover && setShowPopover(false);
    setChatStatus && setChatStatus(status);

    const res = await fetch("/api/chats/status", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chats: selectedChats, status }),
    });
    const data = await res.json();
    setIsSubmitting(false);

    if (page === "chat") return;
    setToggleEditChat(false);
    handleUpdateChats(data.chats, data.status);
  };

  const handleUpdateChats = (dataChats, status) => {
    const chatsCopy = [...chats];
    const chatsUpdate = chatsCopy.map((e) => {
      if (dataChats.some((item) => item._id === e._id)) {
        return { ...e, status };
      }
      return e;
    });
    setChats(chatsUpdate);
  };

  const handleSetColor = (c) => {
    console.log(c.name);
    console.log(c.colors);
    document.documentElement.style.setProperty(
      "--bubble-gradient",
      `linear-gradient(to bottom, ${c.colors}`
    );
    const arr = c.colors.split(",");
    document.documentElement.style.setProperty("--top-color", arr[0]);
    document.documentElement.style.setProperty("--bottom-color", arr[1]);
  };

  return (
    <>
      {page === "archived" ||
      (page === "chat" && selectedChats[0].status === 2) ? null : (
        <Ripple.Div onClick={() => editChatStatus(removeThumbtack ? 0 : 1)}>
          <span
            className="stroke"
            style={removeThumbtack ? { display: "block" } : null}
          ></span>
          <FontAwesomeIcon icon={faThumbtack} />
          <span>
            {page === "chat"
              ? removeThumbtack
                ? "Unpin Chat"
                : "Pin Chat"
              : null}
          </span>
        </Ripple.Div>
      )}

      <Ripple.Div
        {...(page !== "archived" && {
          onClick: () => editChatStatus(2),
        })}
        {...(page === "chat" &&
          selectedChats[0].status === 2 && {
            onClick: () => editChatStatus(0),
          })}
        {...(page === "archived" && {
          onClick: () => editChatStatus(0),
        })}
        className="archived-icon"
        style={toggleEditChat ? { opacity: "1", visibility: "visible" } : null}
      >
        <FontAwesomeIcon icon={faArchive} />
        <span>
          {page === "chat"
            ? selectedChats[0].status === 2
              ? "Unarchive Chat"
              : "Archive Chat"
            : null}
        </span>
      </Ripple.Div>
      <Ripple.Div
        onClick={() => setToggleTrashChat(true)}
        className="archived-icon"
        style={toggleEditChat ? { opacity: "1", visibility: "visible" } : null}
      >
        <FontAwesomeIcon icon={faTrash} />
        <span>{page === "chat" ? "Trash Chat" : null}</span>
      </Ripple.Div>
      {page === "chat" ? (
        <div className="chat-color-container">
          <hr className="edit-chat-hr" />
          <Ripple.Div
            className="chat-color-btn"
            onClick={() => setToggleColors((bool) => !bool)}
          >
            <div className="color-box current"></div>
            <span>Chat color</span>
          </Ripple.Div>
          <hr className="edit-chat-hr" />
          <ul
            style={toggleColors ? { maxHeight: "300px" } : { maxHeight: "0px" }}
          >
            {chatColors.map((c) => {
              return (
                <Ripple.Div
                  key={uuidv4()}
                  className="chat-color-btn"
                  dataName={c.name}
                  onClick={(e) => handleSetColor(c)}
                >
                  <div
                    className="color-box"
                    style={{
                      background: `linear-gradient(to bottom, ${c.colors}`,
                    }}
                  ></div>
                  <span>{c.name}</span>
                </Ripple.Div>
              );
            })}
          </ul>
        </div>
      ) : null}
      <IonAlert
        isOpen={toggleTrashChat}
        onDidDismiss={() => setToggleTrashChat(false)}
        cssClass="remove-avatar-alert"
        header={"Do you want to remove the chat?"}
        message={"This is permanent and cannot be undone"}
        buttons={[
          "Cancel",
          { text: "Remove", handler: () => editChatStatus(3) },
        ]}
      />
    </>
  );
}

export default EditChat;
