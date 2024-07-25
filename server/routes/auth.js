const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const{JWT_KEY} = require("../keys");
const requireLogin = require("../middleware/requireLogin");

//authorization testing

// router.get('/protected',requireLogin,(req,res)=>{
//     res.send("hello user")
// })


//SIGNUP
router.post('/signup',(req,res)=>{
    // console.log(req.body.name)
    const{name , email , password} = req.body
    if(!email || !password || !name){
        return res.status(422).json({error:"please add all fields!"})
    }
    // res.json({error:"successfully posted!!"})
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User already exists!!"})
        }

        bcrypt.hash(password, 12)
        .then(hashedPassword=>{
            const user = new User({
                email,
                password:hashedPassword,
                name
            })
            user.save()
            .then(user=>{
                res.json({message:"User saved sucessfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
        
    })
    .catch(err=>{
        console.log(err)
    })
})



router.post('/signin', (req,res)=>{
    const{email,password} = req.body
    if(!email, !password){
        return res.status(422).json({error:"provide email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            res.status(422).json({error:"invalid email or password"})
        }

        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"Signed in successfully!"})
                const token = jwt.sign({_id:savedUser._id} , JWT_KEY)
                const {_id, name, email, followers, followings} = savedUser
                res.json({token,user:{
                    _id,
                    name,
                    email,
                    followers,
                    followings
                }})
            }else{
                return res.status(422).json({message:"invalid email or password"}) // dont give hint that password is wrong
            }
        }).catch(err=>{
            console.log(err)
        })
    })
})

module.exports = router;
