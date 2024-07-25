import React from "react";
import { useState, useEffect } from "react";
import { Form , useNavigate} from "react-router-dom";
import M from "materialize-css"


const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (url) {
            fetch("/createPost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#e53935 red darken-1" });
                } else {
                    M.toast({ html: "Created Post Successfully", classes: "#81c784 green lighten-2" });
                    navigate('/');
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
    }, [url]); // Only run this effect when `url` changes

    const postDetails = () => {
        if (!image) {
            M.toast({ html: "Please upload an image", classes: "#e53935 red darken-1" });
            return;
        }

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
            if (data.error) {
                M.toast({ html: data.error, classes: "#e53935 red darken-1" });
            } else {
                console.log("Cloudinary Response: ", data); // Added logging
                setUrl(data.url);
            }
        })
        .catch(err => {
            console.log(err);
        });
    };


// const CreatePost = ()=>{
//     const navigate = useNavigate()
//     const[title, setTitle] = useState("")
//     const[body, setBody] = useState("")
//     const[image, setImage] = useState("")
//     const[url, setUrl] = useState("")

//     const postDetails = ()=>{
//         const data = new FormData()
//         data.append("file",image)
//         data.append("upload_preset", "insta-clone")
//         data.append("cloud_name","Aditya35")
//         fetch("https://api.cloudinary.com/v1_1/aditya35/image/upload" ,{
//             method:"post",
//             body:data
//         }).then(res=>res.json())
//         .then(data=>{
//             // console.log(data)
//             setUrl(data.url)
//         }).catch(err=>{
//             console.log(err)
//         })

//         fetch("/createPost" , {
//             method:"post",
//             headers:{
//                 "Content-Type":"application/json",
//                 "Authorization":"Bearer "+localStorage.getItem("jwt")
//             },
//             body:JSON.stringify({
//                 title,
//                 body,
//                 pic:url
//             })
//         }).then(res=>res.json())
//         .then(data=>{
//             if(data.error){
//                 M.toast({html: data.error , classes:"#e53935 red darken-1"})
//             }
//             else{
//                 M.toast({html: "Created Post Successfully" , classes:"#81c784 green lighten-2"})
//                 navigate('/')
//             }
//         }).catch(err=>{
//             console.log(err)
//         })
//     }

    return(
        <div className="card input-field" style={{
            margin:"50px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"
        }}>
            <input type="text"  placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
            <input type="text"  placeholder="Body" value={body} onChange={(e)=>setBody(e.target.value)} />
            <div className="file-field input-field">
                <div className="btn #42a5f5 blue darken-2">
                  <span>Upload Image</span>
                  <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
            </div>
            <button className="btn waves-effect waves-light #42a5f5 blue darken-2"  onClick={()=>postDetails()}>Post</button>
        </div>
    )
}

export default CreatePost;