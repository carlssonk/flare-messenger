import React from "react";

function SubmitTrigger({
  page,
  isSubmitting,
  username,
  password,
  passwordGood,
  usernameGood,
  emailGood,
}) {
  return page === "login" ? (
    <button
      disabled={isSubmitting || username.length === 0 || password.length === 0}
      type="submit"
      style={{ display: "none" }}
    ></button>
  ) : (
    <button
      disabled={isSubmitting || !passwordGood || !usernameGood || !emailGood}
      type="submit"
      style={{ display: "none" }}
    ></button>
  );
}

export default SubmitTrigger;
