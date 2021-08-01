import React from "react";
import Ripple from "../Effects/Ripple";
import FlareIcon from "./FlareIcon";
import SignupForm from "./SignupForm";

function Signup({ changePage }) {
  return (
    <div className="page auth-page">
      <FlareIcon />
      <SignupForm />
      <Ripple.Button className="small-btn" onClick={() => changePage("login")}>
        ALREADY HAVE AN ACCOUNT?
      </Ripple.Button>
    </div>
  );
}

export default Signup;
