import React from "react";
import Ripple from "../Effects/Ripple";
import FlareIcon from "./FlareIcon";
import LoginForm from "./LoginForm";

function Login({ changePage }) {
  return (
    <div className="page auth-page">
      <FlareIcon />
      <LoginForm />
      <Ripple.Button onClick={() => changePage("signup")}>
        CREATE NEW ACCOUNT
      </Ripple.Button>
      <Ripple.Button className="small-btn">FORGOT PASSWORD</Ripple.Button>
    </div>
  );
}

export default Login;
