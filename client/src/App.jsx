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
import EditProfile from "./pages/EditProfile";
import DeviceInfo from "./components/DeviceInfo";
import EditName from "./pages/EditName";
import { useLocation } from "react-router-dom";
import { joinChat, leaveChat } from "./utils/socket";
import { SocketContext } from "./context/SocketContext";
import io from "socket.io-client";
import Archived from "./pages/Archived";

function App() {
  const location = useLocation();

  const [nav, setNav] = useState("forward");
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketIsActive, setSocketIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastLocation, setLastLocation] = useState("");

  const navValue = useMemo(() => ({ nav, setNav }), [nav, setNav]);
  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  const socketValue = useMemo(
    () => ({ socket, setSocket }),
    [socket, setSocket]
  );

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const res = await fetch(`/api/user`);
    const getUser = await res.json();
    console.log(getUser.chats);
    setUser(getUser);
    setIsLoading(false);
  };

  // add & remove socket
  useEffect(() => {
    if (!socketIsActive && user) {
      setSocket(io("http://localhost:3000"));
      setSocketIsActive(true);
    }
    if (socketIsActive && !user) {
      socket.disconnect();
      setSocket(null);
      setSocketIsActive(false);
    }
  }, [user, socket, socketIsActive]);

  // join & leave room
  useEffect(() => {
    setLastLocation(location.pathname);
    if (user && socket) {
      const chatId = location.pathname.replace("/chat/", "");
      const lastChatId = lastLocation.replace("/chat/", "");
      if (user.chats.includes(chatId)) joinChat(socket, chatId);
      else if (user.chats.includes(lastChatId)) leaveChat(socket, lastChatId);
    }
  }, [socket, user, location, lastLocation]);

  return (
    <NavContext.Provider value={navValue}>
      <UserContext.Provider value={userValue}>
        <SocketContext.Provider value={socketValue}>
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
                      <PrivateRoute
                        user={user}
                        exact
                        path="/"
                        component={Home}
                      />
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
                      <PrivateRoute
                        user={user}
                        path="/archived"
                        component={Archived}
                      />
                    </Switch>
                  </CSSTransition>
                </TransitionGroup>
              )}
            />
          ) : (
            <Loading />
          )}
        </SocketContext.Provider>
      </UserContext.Provider>
    </NavContext.Provider>
  );
}

export default App;
