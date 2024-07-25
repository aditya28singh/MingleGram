import React, {useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
const Navbar = ()=>{
  const {state,dispatch} = useContext(UserContext)
  const navigate = useNavigate()
  const renderList = ()=>{
    if(state){
      return[
        <li key="profile"><Link to="/Profile">Profile</Link></li>,
        <li key="createpost"><Link to="/CreatePost">Create Post</Link></li>,
        <li key="myfollowingpost"><Link to="/myfollowingpost">My Followings Posts</Link></li>,
        <li key="logout"><button className="btn waves-effect waves-light #e53935 red darken-1" onClick={()=>{
          localStorage.clear()
          // dispatch()
          dispatch({type:"CLEAR"})
          navigate('/signin')
        }}>Logout</button></li>
      ]
    }else{
      return[
        <li key="signin"><Link to="/Signin">Signin</Link></li>,
        <li key="signup"><Link to="/Signup">Signup</Link></li>
      ]
    }
  }
    return(
        <nav>
        <div className="nav-wrapper white">
          <Link to={state?"/":"/signup"} className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
      </nav>
    )
}

export default Navbar;