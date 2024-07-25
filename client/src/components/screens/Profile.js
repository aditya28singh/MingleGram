import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'


const Profile = () => {
    const [mypics, setPics] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [image, setImage] = useState("");

    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            console.log(result);
            setPics(result.mypost || []); // Ensure mypost is an array
        })
        .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (image) {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "insta-clone");
            data.append("cloud_name", "adks");

            fetch("https://api.cloudinary.com/v1_1/adks/image/upload", {
                method: "post",
                body: data
            })
            .then(res => res.json())
            .then(data => {
                fetch('/updatepic', {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        pic: data.url
                    })
                }).then(res => res.json())
                .then(result => {
                    console.log(result);
                    localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }));
                    dispatch({ type: "UPDATEPIC", payload: result.pic });
                })
                .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
        }
    }, [image]);

    const updatePhoto = (file) => {
        setImage(file);
    };

    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div style={{ margin: "18px 0px", borderBottom: "1px solid grey" }}>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <div>
                        <img 
                            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                            src={state?.pic || "loading"}
                            alt="profile"
                        />
                    </div>
                    <div>
                        <h4>{state?.name || "loading"}</h4>
                        <h5>{state?.email || "loading"}</h5>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                            <h6>{mypics.length} posts</h6>
                            <h6>{state?.followers?.length || "0"} followers</h6>
                            <h6>{state?.following?.length || "0"} following</h6>
                        </div>
                    </div>
                </div>

                <div className="file-field input-field" style={{ margin: "10px" }}>
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Update pic</span>
                        <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>

            <div className="gallery">
                {mypics.map(item => (
                    <img key={item._id} className="item" src={item.photo} alt={item.title} />
                ))}
            </div>
        </div>
    );
};

export default Profile;

// const Profile  = ()=>{
//     const [mypics,setPics] = useState([])
//     const {state,dispatch} = useContext(UserContext)
//     const [image,setImage] = useState("")
//     useEffect(()=>{
//        fetch('http://localhost:5000/mypost',{
//            headers:{
//                "Authorization":"Bearer "+localStorage.getItem("jwt")
//            }
//        }).then(res=>res.json())
//        .then(result=>{
//            console.log(result)
//            setPics(result.mypost)
//        })
//     },[])
//     useEffect(()=>{
//        if(image){
//         const data = new FormData()
//         data.append("file",image)
//         data.append("upload_preset","insta-clone")
//         data.append("cloud_name","adks")
//         fetch("https://api.cloudinary.com/v1_1/adks/image/upload",{
//             method:"post",
//             body:data
//         })
//         .then(res=>res.json())
//         .then(data=>{
    
       
//            fetch('http://localhost:5000/updatepic',{
//                method:"put",
//                headers:{
//                    "Content-Type":"application/json",
//                    "Authorization":"Bearer "+localStorage.getItem("jwt")
//                },
//                body:JSON.stringify({
//                    pic:data.url
//                })
//            }).then(res=>res.json())
//            .then(result=>{
//                console.log(result)
//                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
//                dispatch({type:"UPDATEPIC",payload:result.pic})
//                //window.location.reload()
//            })
       
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//        }
//     },[image])
//     const updatePhoto = (file)=>{
//         setImage(file)
//     }
//    return (
//        <div style={{maxWidth:"550px",margin:"0px auto"}}>
//            <div style={{
//               margin:"18px 0px",
//                borderBottom:"1px solid grey"
//            }}>

         
//            <div style={{
//                display:"flex",
//                justifyContent:"space-around",
              
//            }}>
//                <div>
//                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
//                    src={state?state.pic:"loading"}
//                    />
                 
//                </div>
//                <div>
//                    <h4>{state?state.name:"loading"}</h4>
//                    <h5>{state?state.email:"loading"}</h5>
//                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
//                        <h6>{mypics.length} posts</h6>
//                        <h6>{state?state.followers.length:"0"} followers</h6>
//                        <h6>{state?state.following.length:"0"} following</h6>
//                    </div>

//                </div>
//            </div>
        
//             <div className="file-field input-field" style={{margin:"10px"}}>
//             <div className="btn #64b5f6 blue darken-1">
//                 <span>Update pic</span>
//                 <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
//             </div>
//             <div className="file-path-wrapper">
//                 <input className="file-path validate" type="text" />
//             </div>
//             </div>
//             </div>      
//            <div className="gallery">
//                {
//                    mypics.map(item=>{
//                        return(
//                         <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
//                        )
//                    })
//                }

           
//            </div>
//        </div>
//    )
// }


//export default Profile






// import React,{useEffect,useState,useContext} from 'react'
// import {UserContext} from '../../App'

// const Profile  = ()=>{
//     const [mypics,setPics] = useState([])
//     const {state,dispatch} = useContext(UserContext)
//     const [image,setImage] = useState("")
//     useEffect(()=>{
//        fetch('http://localhost:5000/mypost',{
//            headers:{
//                "Authorization":"Bearer "+localStorage.getItem("jwt")
//            }
//        }).then(res=>res.json())
//        .then(result=>{
//            console.log(result)
//            setPics(result.mypost)
//        })
//     },[])
//     useEffect(()=>{
//        if(image){
//         const data = new FormData()
//         data.append("file",image)
//         data.append("upload_preset","insta-clone")
//         data.append("cloud_name","adks")
//         fetch("https://api.cloudinary.com/v1_1/adks/image/upload",{
//             method:"post",
//             body:data
//         })
//         .then(res=>res.json())
//         .then(data=>{
    
       
//            fetch('/updatepic',{
//                method:"put",
//                headers:{
//                    "Content-Type":"application/json",
//                    "Authorization":"Bearer "+localStorage.getItem("jwt")
//                },
//                body:JSON.stringify({
//                    pic:data.url
//                })
//            }).then(res=>res.json())
//            .then(result=>{
//                console.log(result)
//                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
//                dispatch({type:"UPDATEPIC",payload:result.pic})
//                //window.location.reload()
//            })
       
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//        }
//     },[image])
//     const updatePhoto = (file)=>{
//         setImage(file)
//     }
//    return (
//        <div style={{maxWidth:"550px",margin:"0px auto"}}>
//            <div style={{
//               margin:"18px 0px",
//                borderBottom:"1px solid grey"
//            }}>

         
//            <div style={{
//                display:"flex",
//                justifyContent:"space-around",
              
//            }}>
//                <div>
//                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
//                    src={state?state.pic:"loading"}
//                    />
                 
//                </div>
//                <div>
//                    <h4>{state?state.name:"loading"}</h4>
//                    <h5>{state?state.email:"loading"}</h5>
//                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
//                        <h6>{mypics.length} posts</h6>
//                        <h6>{state?state.followers.length:"0"} followers</h6>
//                        <h6>{state?state.following.length:"0"} following</h6>
//                    </div>

//                </div>
//            </div>
        
//             <div className="file-field input-field" style={{margin:"10px"}}>
//             <div className="btn #64b5f6 blue darken-1">
//                 <span>Update pic</span>
//                 <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
//             </div>
//             <div className="file-path-wrapper">
//                 <input className="file-path validate" type="text" />
//             </div>
//             </div>
//             </div>      
//            <div className="gallery">
//                {
//                    mypics.map(item=>{
//                        return(
//                         <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
//                        )
//                    })
//                }

           
//            </div>
//        </div>
//    )
// }


// export default Profile



// import React, { useEffect, useState , useContext} from "react";
// import { UserContext } from "../../App";

// const Profile = ()=>{
//     const[mypics,setPics] = useState([])
//     const {state,dispatch} = useContext(UserContext) 
//     useEffect(()=>{
//         fetch('/myPosts', {
//             headers: {
//                 "Authorization": "Bearer " + localStorage.getItem("jwt")
//             }
//         })
//         .then(res => {
//             if (!res.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return res.json();
//         })
//         .then(result => {
//             console.log(result);
//             setPics(result.myposts);
//         })
//         .catch(error => {
//             console.error('Error fetching posts:', error);
//         });
//     }, []);

//     return(
//         <div style={{maxWidth:"60%", margin:"0px auto"}}>
//             <div style={{
//                 display:"flex",
//                 justifyContent:"space-around",
//                 margin:"18px 0px",
//                 borderBottom:"1px solid grey"
//             }}>
                
//                 <div>
//                     <img style={{width:"160px", heigh:"160px", borderRadius:"80px"}} src="https://images.unsplash.com/36/X7L5hgFXQZazzPaK3goC_14084990857_88cabf3b6d_o.jpg?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D" alt="Profile Pic" />
//                 </div>

//                 <div>
//                     <h4>{state?state.name:"loading"}</h4>
//                     <h5>{state?state.email:"loading"}</h5>
//                     {/* <h4>{state.name}</h4> */}

//                     <div style={{
//                         display:"flex",
//                         justifyContent:"space-between",
//                         width:"108%"
//                     }}>
//                         <h6>{mypics.length} Posts</h6>
//                         <h6>{state?state.followers.length:"0"} followers</h6>
//                         <h6>{state?state.followings.length:"0"} followings</h6>
//                     </div>
//                 </div>
//             </div>

//             <div className="gallery">
//                 {
//                     mypics.map(item=>{
//                         return(
//                             <img key={item._id} className="item" src={item.photo} alt={item.title} />            
//                         )
//                     })
//                 }
//             </div>
//         </div>
//     )
// }

// export default Profile;