import React, { useEffect, useState , useContext} from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

const UserProfile = ()=>{
    const[userProfile,setProfile] = useState(null)
    const[showfollow,setShowfollow] = useState(true)
    const {state,dispatch} = useContext(UserContext) 
    const {userid} = useParams()
    // console.log(userid)
    useEffect(()=>{
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result => {
            // console.log(result);
            
            setProfile(result)
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
    }, []);
    
    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            // console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers, data._id]
                    }
                }
            })
            setShowfollow(false)
        })
    }

    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            // console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        // followers:[...prevState.user.followers, data._id]
                        followers:newFollower
                    }
                }
            })
            setShowfollow(true)
        })
    }

    return(
        <>
        {userProfile?  
            <div style={{maxWidth:"60%", margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>

                <div>
                    <img style={{width:"160px", heigh:"160px", borderRadius:"80px"}} src="https://images.unsplash.com/36/X7L5hgFXQZazzPaK3goC_14084990857_88cabf3b6d_o.jpg?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D" alt="Profile Pic" />
                </div>

                <div>
                    {/* <h4>{state?state.name:"loading"}</h4> */}
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>

                    <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        width:"108%"
                    }}>
                        <h6>{userProfile.posts.length} Posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        <h6>{userProfile.user.followings.length} followings</h6>
                    </div>
                    {showfollow?
                    <button style={{margin:"10px"}} className="btn waves-effect waves-light #42a5f5 blue darken-2" onClick={()=>followUser()}>Follow</button>
                    :
                    <button style={{margin:"10px"}} className="btn waves-effect waves-light #42a5f5 blue darken-2" onClick={()=>unfollowUser()}>Unfollow</button>
                    }
                </div>
            </div>

            <div className="gallery">
                {
                    userProfile.posts.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />            
                        )
                    })
                }
            </div>
            </div>
        : <h2>loading ...</h2>}
        
        </>
    )
}

export default UserProfile;