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

function App() {
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const res = await fetch(`/api/user`);
    const user = await res.json();
    setUser(user);
    console.log(user);
    setIsLoading(false);
  };

  return (
    <UserContext.Provider value={value}>
      {/* <Router> */}
      <AnimatePresence exitBeforeEnter>
        {!isLoading ? (
          <Switch location={location} key={location.key}>
            {user ? (
              <Route exact path="/" component={Home} />
            ) : (
              <Route exact path="/" component={Authenticate} />
            )}
            <PrivateRoute user={user} path="/profile" component={Profile} />
          </Switch>
        ) : (
          <Loading />
        )}
      </AnimatePresence>
      {/* </Router> */}
    </UserContext.Provider>
  );
}

export default App;
