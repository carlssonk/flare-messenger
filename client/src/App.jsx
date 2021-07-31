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
// import { SocketContext } from "./context/SocketContext";
import AddFriends from "./pages/AddFriends";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import NewChat from "./pages/NewChat";
import NewGroup from "./pages/NewGroup";
import Chat from "./pages/Chat";
import EditProfile from "./pages/EditProfile";
import DeviceInfo from "./components/DeviceInfo";
import EditName from "./pages/EditName";
import { useLocation, useHistory } from "react-router-dom";
import {
  initiateSocket,
  joinChat,
  leaveChat,
  sendMessage,
} from "./utils/socket";

function App() {
  const [user, setUser] = useState(null);
  const [nav, setNav] = useState("forward");
  const [isLoading, setIsLoading] = useState(true);
  const [lastLocation, setLastLocation] = useState("");
  const location = useLocation();
  const history = useHistory();

  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  const navValue = useMemo(() => ({ nav, setNav }), [nav, setNav]);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const res = await fetch(`/api/user`);
    const getUser = await res.json();
    setUser(getUser);
    setIsLoading(false);
  };

  useEffect(() => {
    setLastLocation(location.pathname);
    if (user) {
      const chatId = location.pathname.replace("/chat/", "");
      const lastChatId = lastLocation.replace("/chat/", "");
      if (user.chats.includes(chatId)) joinChat(chatId);
      else if (user.chats.includes(lastChatId)) leaveChat(lastChatId);
    }
  }, [user, location]);

  return (
    <NavContext.Provider value={navValue}>
      <UserContext.Provider value={userValue}>
        {/* <SocketContext.Provider value={soc}> */}
        <DeviceInfo />
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
                      path="/profile/edit/name"
                      component={EditName}
                    />
                    <PrivateRoute
                      user={user}
                      path="/profile/edit"
                      component={EditProfile}
                    />
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
        {/* </SocketContext.Provider> */}
      </UserContext.Provider>
    </NavContext.Provider>
  );
}

export default App;
