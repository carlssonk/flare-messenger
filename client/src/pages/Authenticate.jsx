import React, { useState, useContext } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import Login from "../components/Authenticate/Login";
import ProfileSetup from "../components/Authenticate/ProfileSetup";
import Signup from "../components/Authenticate/Signup";

import { NavContext } from "../context/NavContext";

function Authenticate() {
  const [page, setPage] = useState("login");
  const { nav, setNav } = useContext(NavContext);

  const changePage = (page) => {
    page === "signup" || page === "setup"
      ? setNav("forward")
      : setNav("backward");
    setTimeout(() => setPage(page), 10);
  };

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={page}
        timeout={400}
        classNames={nav}
        onEnter={() =>
          document.documentElement.style.setProperty("--overflow", "hidden")
        }
        onExited={() =>
          document.documentElement.style.setProperty("--overflow", "unset")
        }
      >
        <>
          {page === "signup" ? <Signup changePage={changePage} /> : null}
          {page === "login" ? <Login changePage={changePage} /> : null}
          {page === "setup" ? <ProfileSetup changePage={changePage} /> : null}
        </>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default Authenticate;
