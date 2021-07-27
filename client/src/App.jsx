import React, { useEffect, useState, useMemo } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Authenticate from "./pages/Authenticate";
import Loading from "./components/Loading";
import "./style/style.min.css";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import { UserContext } from "./context/UserContext";
import { NavContext } from "./context/NavContext";
import AddFriends from "./pages/AddFriends";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import NewChat from "./pages/NewChat";
import NewGroup from "./pages/NewGroup";
import Chat from "./pages/Chat";

function App() {
  const [user, setUser] = useState(null);
  const [nav, setNav] = useState("forward");
  const [isLoading, setIsLoading] = useState(true);

  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  const navValue = useMemo(() => ({ nav, setNav }), [nav, setNav]);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const res = await fetch(`/api/user`);
    const user = await res.json();
    console.log(user);
    setUser(user);
    setIsLoading(false);
  };

  return (
    <NavContext.Provider value={navValue}>
      <UserContext.Provider value={userValue}>
        {!isLoading ? (
          <Route
            render={({ location }) => (
              <TransitionGroup>
                <CSSTransition
                  key={location.key}
                  timeout={400}
                  classNames={nav}
                  onEnter={() =>
                    document.documentElement.style.setProperty(
                      "--scrollbar-size",
                      "0px"
                    )
                  }
                  onExited={() =>
                    document.documentElement.style.setProperty(
                      "--scrollbar-size",
                      "10px"
                    )
                  }
                >
                  <Switch location={location} key={location.key}>
                    {!user ? (
                      <Route exact path="/" component={Authenticate} />
                    ) : null}
                    <PrivateRoute user={user} exact path="/" component={Home} />
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
                    <PrivateRoute
                      user={user}
                      path="/new/chat"
                      component={NewChat}
                    />
                    <PrivateRoute
                      user={user}
                      path="/new/group"
                      component={NewGroup}
                    />
                    <PrivateRoute
                      user={user}
                      path="/chat/:id"
                      component={Chat}
                    />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            )}
          />
        ) : (
          <Loading />
        )}
      </UserContext.Provider>
    </NavContext.Provider>
  );
}

export default App;
