import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { passwordList } from "../../utils/commonPasswords";
import { NavContext } from "../../context/NavContext";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faEye } from "@fortawesome/free-regular-svg-icons";
import Ripple from "../Effects/Ripple";
import { v4 as uuidv4 } from "uuid";
import {
  validateUsername,
  validateEmail,
} from "../../utils/Authenticate/signup";
import SubmitTrigger from "./SubmitTrigger";
import SignupError from "./SignupError";

// Colors for form validation
const formGreen = "#00b627";

function SignupForm() {
  const { setNav } = useContext(NavContext);
  const history = useHistory();
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

      if (!validateUsername(username)) {
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

    const timer = setTimeout(() => handleUsernameError(username), 600);
    return () => clearTimeout(timer);
  }, [username]);

  // Client-Side Email Validation
  useEffect(() => {
    setEmailGood(false);
    setEmailError("");
    if (!email) return;

    const handleEmailError = () => {
      if (!validateEmail(email)) {
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
    handleRedirect(user);
  };

  const handleRedirect = (user) => {
    setNav({path: "/", direction: 1, state: null});
    history.location.key = uuidv4(); // Change key to invoke animation
    setUser(user);
  };

  return (
    <>
      <form onSubmit={handleSignup}>
        <div className="input-box">
          <SignupError error={usernameError} />
          <input
            autoComplete="off"
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
          <SignupError error={emailError} />
          <input
            autoComplete="off"
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
          <SignupError error={passwordError} />
          <input
            autoComplete="new-password"
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

        <SubmitTrigger
          page="signup"
          isSubmitting={isSubmitting}
          passwordGood={passwordGood}
          usernameGood={usernameGood}
          emailGood={emailGood}
        />
      </form>
      <Ripple.Button
        disabled={isSubmitting || !passwordGood || !usernameGood || !emailGood}
        onClick={handleSignup}
        className="login-btn"
      >
        SIGN UP
      </Ripple.Button>
    </>
  );
}

export default SignupForm;
