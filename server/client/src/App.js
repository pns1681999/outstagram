import React, { useEffect, createContext, useReducer, useContext } from "react";
import NavBar from "./components/Navbar";
import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./components/screen/Home";
import Signin from "./components/screen/Signin";
import Profile from "./components/screen/Profile";
import Signup from "./components/screen/Signup";
import CreatePost from "./components/screen/CreatePost";
import { reducer, initialState } from "./reducers/useReducer";
import UserProfile from './components/screen/UserProfile';
import SubscriberUserPost from './components/screen/SubscriberUserPost';
import Reset from "./components/screen/Reset"
import Error404 from "./components/screen/Error404"
import NewPassword from "./components/screen/Newpassword"
export const UserContext = createContext();



const Routing = () => {
  const history = useHistory();
  const {state, dispatch} = useContext(UserContext);
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER", payload:user})
    }else{
      if(!history.location.pathname.startsWith('/reset'))
           history.push('/signin')
    }
  },[])

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscriberUserPost />
      </Route>
      <Route exact path="/reset">
        <Reset/>
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>
      <Route path="*">
        <Error404 />
      </Route>
     
    </Switch>
  );
};

function App() {

  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
