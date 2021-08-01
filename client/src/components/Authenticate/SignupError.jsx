import React from "react";

const formRed = "#ff0042";

function SignupError({ error }) {
  return (
    <div
      style={{
        color: formRed,
      }}
    >
      {error}
    </div>
  );
}

export default SignupError;
