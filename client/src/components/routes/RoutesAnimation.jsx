import React, { useContext } from 'react'
import { Route } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { NavContext } from "../../context/NavContext";
import Routes from './Routes';


function RoutesAnimation({ user }) {
  const { nav } = useContext(NavContext)
  return (
    <Route
      render={({ location }) => (
        <TransitionGroup>
          <CSSTransition
            key={location.key}
            timeout={400}
            classNames={nav.direction ? "forward" : "backward"}
            onEnter={() => {
              document.documentElement.style.setProperty(
                "--overflow",
                "hidden"
              );
            }}
            onExited={() => {
              document.documentElement.style.setProperty(
                "--overflow",
                "unset"
              );
            }}
          >
            <Routes location={location} user={user}></Routes>
          </CSSTransition>
        </TransitionGroup>
      )}
    />
  )}

export default RoutesAnimation
