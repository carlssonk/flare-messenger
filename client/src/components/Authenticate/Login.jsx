import React from "react";
import Ripple from "../Effects/Ripple";
import FlareIcon from "./FlareIcon";
import LoginForm from "./LoginForm";

function Login({ changePage }) {
  return (
    <div className="page auth-page">
      <FlareIcon />
      <div style={{color: "#999999", margin: "10px 0"}}>
        <div><strong>NOTE:</strong></div>
        <div>This is a demo version;</div>
        <div>Log in with the demo user for the best experience;</div>
        <br />
        <div><strong>Username: </strong>demouser</div>
        <div><strong>Password: </strong>password123</div>
      </div>
      <div className="bottom-wrapper">
        <LoginForm />
        <Ripple.Button onClick={() => changePage("signup")}>
          CREATE NEW ACCOUNT
        </Ripple.Button>
      </div>
    </div>
  );
}

export default Login;
