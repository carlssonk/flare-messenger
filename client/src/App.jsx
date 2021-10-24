import React, { useEffect, useState, useMemo } from "react";
import Loading from "./components/Loading";
import "./style/style.min.css";
import { UserContext } from "./context/UserContext";
import { NavContext } from "./context/NavContext";
// import DeviceInfo from "./components/DeviceInfo";
import { useLocation, useHistory } from "react-router-dom";
import { joinChat, leaveChat } from "./utils/socket";
import { SocketContext } from "./context/SocketContext";
import io from "socket.io-client";
// import FullScreen from "./components/FullScreen";
import { isMobile } from "./utils/isMobile";
import RoutesAnimation from "./components/routes/RoutesAnimation";
import Routes from "./components/routes/Routes";

const setRoutes = (user) => {
  return isMobile() ? (
    <RoutesAnimation user={user}></RoutesAnimation>
  ) : (
    <Routes user={user}></Routes>
  )
}

function App() {
  const location = useLocation();
  const history = useHistory();

  // const [nav, setNav] = useState("forward");
  const [nav, setNav] = useState({path: "/", direction: 0, state: null});
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketIsActive, setSocketIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastLocation, setLastLocation] = useState("");
  const [initialLoad, setInitialLoad] = useState(false);

  const navValue = useMemo(() => ({ nav, setNav }), [nav, setNav]);
  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  const socketValue = useMemo(
    () => ({ socket, setSocket }),
    [socket, setSocket]
  );

  useEffect(() => {
    setInitialLoad(true);
    getUser();
  }, []);

  const getUser = async () => {
    const res = await fetch(`/api/user`);
    const getUser = await res.json();
    setUser(getUser);
    setIsLoading(false);
  };

  // add & remove socket
  useEffect(() => {
    if (!socketIsActive && user) {
      setSocket(io(`${window.location.origin}/`, {transports: ["websocket"]}));
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


  // Handle navigation
  useEffect(() => {
    if(!initialLoad) return;
    // We can either have files key, path key ot selectedFriends key in nav.state
    // Adding stuff manually here is not scalable long term, but for now we only have 3 properties to worry about
    const files = nav.state && nav.state.files;
    const prevPath = nav.state && nav.state.prevPath;
    const selectedFriends = nav.state && nav.state.selectedFriends;

    history.push({
      pathname: nav.path,
      ...(nav.state && 
        {state: {
          ...history.location.state, 
          ...(files && {files}), 
          ...(prevPath && {prevPath}), 
          ...(selectedFriends && {selectedFriends})} })
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav])


  return (
    <NavContext.Provider value={navValue}>
      <UserContext.Provider value={userValue}>
        <SocketContext.Provider value={socketValue}>
          {/* <DeviceInfo /> */}
          {/* <FullScreen /> */}
          {!isLoading ? (
            setRoutes(user)
          ) : (
            <Loading />
          )}
        </SocketContext.Provider>
      </UserContext.Provider>
    </NavContext.Provider>
  );
}

export default App;
