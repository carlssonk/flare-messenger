import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { IonPage, IonButton } from "@ionic/react";
import FlareIcon from "../flare-icon.svg";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory } from "react-router-dom";

function Login({ changePage }) {
  const { setUser } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextPage, setNextPage] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username.length === 0 || password.length === 0) return;
    setIsSubmitting(true);
    setError("");
    const res = await fetch(`/api/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const user = await res.json();
    setIsSubmitting(false);
    if (user.error) return setError(user.error);
    handleSwitchPage(user);
  };

  const handleSwitchPage = (user) => {
    setNextPage(true);
    changePage("home"); // execute exit method from framer-motion
    setTimeout(() => {
      setUser(user);
    }, 100);
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.7,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { ease: "easeInOut", duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { ease: "easeInOut", duration: 0.2 },
      scale: nextPage ? 2 : 0.7,
    },
  };

  return (
    <>
      <motion.div
        style={{ width: "100%", height: "100%" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <IonPage className="auth-wrapper">
          <img src={FlareIcon} className="flare-icon" alt="logo" />
          <form onSubmit={handleLogin}>
            <input
              placeholder="Username"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              name="username"
              required
            />
            <input
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              required
            />
            <div style={{ color: "red" }}>{error}</div>
            <button
              disabled={
                isSubmitting || username.length === 0 || password.length === 0
              }
              type="submit"
              style={{ display: "none" }}
            ></button>
          </form>
          <IonButton
            disabled={
              isSubmitting || username.length === 0 || password.length === 0
            }
            onClick={handleLogin}
            className="login-btn"
          >
            LOG IN
          </IonButton>
          <IonButton onClick={() => changePage("signup")}>
            CREATE NEW ACCOUNT
          </IonButton>
          <IonButton className="small-btn">FORGOT PASSWORD</IonButton>
        </IonPage>
      </motion.div>
    </>
  );
}

export default Login;
