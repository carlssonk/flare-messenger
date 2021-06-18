import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { IonPage, IonButton } from "@ionic/react";
import FlareIcon from "../flare-icon.svg";
import { passwordList } from "../utils/commonPasswords";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faEye } from "@fortawesome/free-regular-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

// Colors for form validation
const formRed = "#ff0042";
const formGreen = "#00b627";

function Signup({ changePage }) {
  const { setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailGood, setEmailGood] = useState(false);

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameGood, setUsernameGood] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordGood, setPasswordGood] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextPage, setNextPage] = useState(false);
  // Client-Side Username validation
  useEffect(() => {
    setUsernameGood(false);
    setUsernameError("");
    if (!username) return;

    const handleUsernameError = () => {
      if (username.length < 3) {
        setUsernameError("Username must be at least 3 characters long.");
        setUsernameGood(false);
        return;
      }
      if (username.length > 20) {
        setUsernameError("Username cannot exceed 20 characters.");
        setUsernameGood(false);
        return;
      }

      if (!validateUsername()) {
        setUsernameError(
          "Username can only contain letters, numbers and underscores."
        );
        setUsernameGood(false);
      } else {
        checkUsernameAvailability();
        setUsernameError("");
      }
    };

    const checkUsernameAvailability = async () => {
      setUsernameError("");
      const res = await fetch(`/api/user/available?username=${username}`);
      const data = await res.json();
      if (data.foundUsername) return setUsernameError("Username is taken.");
      setUsernameGood(true);
    };

    const validateUsername = () => {
      // /w covers alphabet, numbers & underscore
      const re = /^\w+$/;
      return re.test(username);
    };

    const timer = setTimeout(() => handleUsernameError(username), 600);
    return () => clearTimeout(timer);
  }, [username]);

  // Client-Side Email Validation
  useEffect(() => {
    setEmailGood(false);
    setEmailError("");
    if (!email) return;

    const handleEmailError = () => {
      if (!validateEmail()) {
        setEmailError("Enter a valid email adress.");
        setEmailGood(false);
      } else {
        checkEmailAvailability();
        setEmailError("");
      }
    };

    const checkEmailAvailability = async () => {
      setEmailError("");
      const res = await fetch(`/api/user/available?email=${email}`);
      const data = await res.json();
      if (data.foundEmail) return setEmailError("Email adress already in use.");
      setEmailGood(true);
    };

    const validateEmail = () => {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };

    const timer = setTimeout(() => handleEmailError(email), 600);
    return () => clearTimeout(timer);
  }, [email]);

  // Client-Side Password validation
  useEffect(() => {
    setPasswordGood(false);
    setPasswordError("");
    if (!password) return;

    const handlePasswordError = () => {
      if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters long.");
        setPasswordGood(false);
        return;
      }

      if (password.length > 128) {
        setPasswordError("Password cannot exceed 128 characters.");
        setPasswordGood(false);
        return;
      }

      if (passwordList.includes(password)) {
        setPasswordError("Choose a stronger password.");
        setPasswordGood(false);
      } else {
        setPasswordError("");
        setPasswordGood(true);
      }
    };

    const timer = setTimeout(() => handlePasswordError(password), 600);
    return () => clearTimeout(timer);
  }, [password]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!passwordGood || !usernameGood || !emailGood) return;
    setIsSubmitting(true);
    const res = await fetch(`/api/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password,
      }),
    });
    const user = await res.json();
    setIsSubmitting(false);
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
      y: "100vh",
    },
    visible: {
      y: "0",
      transition: {
        duration: 0.3,
        type: "spring",
        damping: 25,
        stiffness: 250,
      },
    },
    exit: {
      y: nextPage ? "0" : "100vh",
      transition: { ease: "easeInOut", duration: 0.2 },
      scale: nextPage ? 2 : 0.7,
      opacity: 0,
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
          <form onSubmit={handleSignup}>
            <div className="input-box">
              <div
                style={{
                  color: formRed,
                  // height: usernameError ? "14px" : "0",
                }}
              >
                {usernameError}
              </div>
              <input
                className={
                  usernameGood
                    ? "input-good"
                    : usernameError.length > 0
                    ? "input-error"
                    : null
                }
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Username"
                minLength="3"
                maxLength="20"
                required
              />
              {usernameGood ? (
                <FontAwesomeIcon icon={faCheckCircle} color={formGreen} />
              ) : null}
            </div>

            <div className="input-box">
              <div
                style={{
                  color: formRed,
                  // height: emailError ? "14px" : "0",
                }}
              >
                {emailError}
              </div>
              <input
                className={
                  emailGood
                    ? "input-good"
                    : emailError.length > 0
                    ? "input-error"
                    : null
                }
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                maxLength="320"
                required
              />
              {emailGood ? (
                <FontAwesomeIcon icon={faCheckCircle} color={formGreen} />
              ) : null}
            </div>

            <div className="input-box">
              <div
                style={{
                  color: formRed,
                  // height: passwordError ? "14px" : "0",
                }}
              >
                {passwordError}
              </div>
              <input
                className={
                  passwordGood
                    ? "input-good"
                    : passwordError.length > 0
                    ? "input-error"
                    : null
                }
                onChange={(e) => setPassword(e.target.value)}
                type={togglePassword ? "text" : "password"}
                placeholder="Password"
                minLength="6"
                maxLength="128"
                required
              />

              <FontAwesomeIcon
                onClick={() =>
                  setTogglePassword((togglePassword) => !togglePassword)
                }
                className={togglePassword ? "eye-select" : "eye"}
                style={passwordGood ? { right: "26px" } : ""}
                icon={faEye}
              />

              {passwordGood ? (
                <FontAwesomeIcon icon={faCheckCircle} color={formGreen} />
              ) : null}
            </div>

            <button
              disabled={
                isSubmitting || !passwordGood || !usernameGood || !emailGood
              }
              type="submit"
              style={{ display: "none" }}
            ></button>
          </form>
          <IonButton
            disabled={
              isSubmitting || !passwordGood || !usernameGood || !emailGood
            }
            onClick={handleSignup}
            className="login-btn"
          >
            SIGN UP
          </IonButton>
          <IonButton className="small-btn" onClick={() => changePage("login")}>
            ALREADY HAVE AN ACCOUNT?
          </IonButton>
        </IonPage>
      </motion.div>
    </>
  );
}

export default Signup;
