import React from 'react'
import { Switch, Route } from 'react-router-dom';

// Utils
import PrivateRoute from "./PrivateRoute";

// Pages
import Archived from "../../pages/Archived";
import Camera from "../../pages/Camera";
import SendPhoto from "../../pages/SendPhoto";
import EditName from "../../pages/EditName";
import NewChat from "../../pages/NewChat";
import NewGroup from "../../pages/NewGroup";
import Chat from "../../pages/Chat";
import EditProfile from "../../pages/EditProfile";
import AddFriends from "../../pages/AddFriends";
import Profile from "../../pages/Profile";
import Home from "../../pages/Home";
import Authenticate from "../../pages/Authenticate";



function Routes({ location, user }) {
  return (
    <Switch location={location || null} key={(location && location.pathname) || null}>
      {!user ? <Route exact path="/" component={Authenticate} /> : null}
      <PrivateRoute user={user} exact path="/" component={Home} />
      <PrivateRoute user={user} path="/profile/edit/name" component={EditName} />
      <PrivateRoute user={user} path="/profile/edit" component={EditProfile} />
      <PrivateRoute user={user} path="/profile" component={Profile} />
      <PrivateRoute user={user} path="/add" component={AddFriends} />
      <PrivateRoute user={user} path="/new/chat" component={NewChat} />
      <PrivateRoute user={user} path="/new/group" component={NewGroup} />
      <PrivateRoute user={user} path="/chat/:id" component={Chat} />
      <PrivateRoute user={user} path="/archived" component={Archived} />
      <PrivateRoute user={user} path="/camera" component={Camera} />
      <PrivateRoute user={user} path="/send-photo" component={SendPhoto} />
    </Switch>
  )
}

export default Routes
