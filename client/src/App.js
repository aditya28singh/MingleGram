import React ,{useEffect, createContext, useReducer, useContext} from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter,Route, Routes, Switch, useNavigate } from "react-router-dom";
import Home from "./components/screens/Home";
import Signup from "./components/screens/Signup";
import Signin from "./components/screens/Signin";
import Profile from "./components/screens/Profile";
import CreatePost from "./components/screens/CreatePost";
import { reducer, initialState } from "./reducers/userReducer";
import UserProfile from "./components/screens/UserProfile";
import SubUserPosts from "./components/screens/SubUserPosts";

export const UserContext = createContext()


const Routing = ()=>{
  const navigate = useNavigate();
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))


    if(user){
      dispatch({type:"USER", payload:user})
    }else{
      navigate('/signin')
    }
  }, [])

  return(
        <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Signin" element={<Signin />} />
        <Route exact path="/Profile" element={<Profile />} />
        <Route path="/CreatePost" element={<CreatePost />} />
        <Route path="/profile/:userid" element={<UserProfile />} />
        <Route path="/myfollowingpost" element={<SubUserPosts />} />
      </Routes>
  )
}
function App() {
  const [state, dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>

    <BrowserRouter>

      <Navbar/>
      <Routing/>
      
      {/* <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/CreatePost" element={<CreatePost />} />
      </Routes> */}

    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
