import React, { useContext, useState } from "react";
import Ripple from "../Effects/Ripple";
import { UserContext } from "../../context/UserContext";

import { NavContext } from "../../context/NavContext";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import SubmitTrigger from "./SubmitTrigger";

const DEMO_USERNAME = "demouser"
const DEMO_PASSWORD = "password123"

function LoginForm() {
  const { setUser } = useContext(UserContext);
  const { nav, setNav } = useContext(NavContext);

  const history = useHistory();

  const [username, setUsername] = useState(DEMO_USERNAME);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username.length === 0 || password.length === 0) return;
    startSubmit();
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
    if (user.error) return handleError(user);
    handleRedirect(user);
  };

  const startSubmit = () => {
    setIsSubmitting(true);
    setError("");
  };

  const handleError = (user) => {
    setError(user.error);
    setIsSubmitting(false);
  };

  const handleRedirect = (user) => {
    setNav({...nav, direction: 1});
    history.location.key = uuidv4(); // Change key to invoke animation
    console.log(user.chats);
    setUser(user);
  };
  return (
    <>
      <form onSubmit={handleLogin}>
        <input
          placeholder="Username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          defaultValue={DEMO_USERNAME}
          name="username"
          required
        />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          defaultValue={DEMO_PASSWORD}
          name="password"
          required
        />
        <div style={{ color: "red" }}>{error}</div>
        <SubmitTrigger
          page="login"
          isSubmitting={isSubmitting}
          username={username}
          password={password}
        />
      </form>
      <Ripple.Button
        disabled={
          isSubmitting || username.length === 0 || password.length === 0
        }
        onClick={handleLogin}
        className="login-btn"
      >
        LOG IN
      </Ripple.Button>
    </>
  );
}

export default LoginForm;
