import React from "react";
import Ripple from "../Effects/Ripple";
import FlareIcon from "./FlareIcon";
import LoginForm from "./LoginForm";

function Login({ changePage }) {
  return (
    <div className="page auth-page">
      <FlareIcon />
      <div style={{color: "white"}}>
        <div><strong>NOTE:</strong></div>
        <div>This is a demo version;</div>
        <div>Log in with the demo user for best the experience;</div>
        <br />
        <div><strong>Username: </strong>demouser</div>
        <div><strong>Password: </strong>password123</div>
      </div>
      <LoginForm />
      <Ripple.Button onClick={() => changePage("signup")}>
        CREATE NEW ACCOUNT
      </Ripple.Button>
      <Ripple.Button className="small-btn">FORGOT PASSWORD</Ripple.Button>
    </div>
  );
}

export default Login;
