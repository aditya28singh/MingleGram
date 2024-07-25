import { useState, useContext } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css"
import { UserContext } from "../../App";

const Signin = ()=>{
    const {state, dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const PostData = ()=>{
        if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)){
            return M.toast({html: "Invalid email", classes:"#e53935 red darken-1"})
        }
        fetch("/signin" , {
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res => {
            if (!res.ok) {
                // If response is not ok (e.g., 400, 500 errors), throw an error
                return res.text().then(text => { throw new Error(text) });
            }
            return res.json();
        })
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error , classes:"#e53935 red darken-1"})
            }
            else{
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch({type:"USER", payload:data.user})
                M.toast({html: "Signed In successfully" , classes:"#81c784 green lighten-2"})
                navigate('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    }


    return(
        <div className="myCard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button className="btn waves-effect waves-light #42a5f5 blue darken-2" onClick={()=>PostData()}>Login</button>
                <h6>
                <Link to="/Signup">Don't have an acount?</Link>
                </h6>
            </div>
        </div>
    )

}

export default Signin;