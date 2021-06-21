import React, { useEffect, useState, useMemo } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Authenticate from "./pages/Authenticate";
import Loading from "./components/Loading";
import "./style/style.min.css";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import { UserContext } from "./context/UserContext";
import { AnimatePresence } from "framer-motion";
import AddFriends from "./pages/AddFriends";
import { TransitionGroup, CSSTransition } from "react-transition-group";

function App() {
  const loc = useLocation();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [className, setClassName] = useState("forward");

  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const res = await fetch(`/api/user`);
    const user = await res.json();
    setUser(user);
    setIsLoading(false);
  };

  useEffect(() => {
    if (loc.pathname === "/") {
      setTimeout(() => setClassName("forward"), 200);
    } else {
      setTimeout(() => setClassName("backward"), 200);
    }
  }, [loc]);

  return (
    <UserContext.Provider value={userValue}>
      <AnimatePresence exitBeforeEnter>
        {!isLoading ? (
          <Route
            render={({ location }) => (
              <TransitionGroup>
                <CSSTransition
                  key={location.key}
                  timeout={400}
                  classNames={className}
                >
                  <Switch location={location} key={location.key}>
                    {user ? (
                      <Route exact path="/" component={Home} />
                    ) : (
                      <Route exact path="/" component={Authenticate} />
                    )}
                    <PrivateRoute
                      user={user}
                      path="/profile"
                      component={Profile}
                    />
                    <PrivateRoute
                      user={user}
                      path="/add"
                      component={AddFriends}
                    />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            )}
          />
        ) : (
          <Loading />
        )}
      </AnimatePresence>
    </UserContext.Provider>
  );
}

export default App;
