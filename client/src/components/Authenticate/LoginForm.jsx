import React, { useContext, useState } from "react";
import Ripple from "../Effects/Ripple";
import { UserContext } from "../../context/UserContext";

import { NavContext } from "../../context/NavContext";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import SubmitTrigger from "./SubmitTrigger";

function LoginForm() {
  const { setUser } = useContext(UserContext);
  const { nav, setNav } = useContext(NavContext);

  const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
