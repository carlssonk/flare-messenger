import React, { useState, useContext } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import Login from "../components/Login";
import Signup from "../components/Signup";

import { NavContext } from "../context/NavContext";

function Authenticate() {
  const [page, setPage] = useState("login");
  const { nav, setNav } = useContext(NavContext);

  const changePage = (page) => {
    page === "signup" ? setNav("forward") : setNav("backward");
    setTimeout(() => setPage(page), 10);
  };

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={page}
        timeout={400}
        classNames={nav}
        onEnter={() =>
          document.documentElement.style.setProperty("--scrollbar-size", "0px")
        }
        onExited={() =>
          document.documentElement.style.setProperty("--scrollbar-size", "10px")
        }
      >
        <>
          {page === "signup" ? <Signup changePage={changePage} /> : null}
          {page === "login" ? <Login changePage={changePage} /> : null}
        </>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default Authenticate;
