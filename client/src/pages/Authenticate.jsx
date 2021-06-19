import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";

import Login from "../components/Login";
import Signup from "../components/Signup";

function Authenticate() {
  const [page, setPage] = useState("login");

  const changePage = (page) => {
    setPage(page);
  };

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        {page === "login" ? <Login key="1" changePage={changePage} /> : null}
        {page === "signup" ? <Signup key="2" changePage={changePage} /> : null}
      </AnimatePresence>
    </>
  );
}

export default Authenticate;
