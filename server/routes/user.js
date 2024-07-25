const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

// router.get('/user/:id', requireLogin, (req,res)=> {
//     User.findOne({_id:req.params.id})
//     .select("-password")
//     .then(user=>{
//         Post.find({postedBy:req.params.id})
//         .populate("postedBy", "_id name")
//         then((posts)=>{
//         if (!posts) {
//             return res.status(422).json({ error: "Post not found" });
//         }
//         res.json({user,posts})
//         })
//     })
//     .catch(err=>{
//         return res.status(404).json({ error: "User not found" });
//     })
// })

router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({_id: req.params.id})
        .select("-password")
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .then(posts => {
                    res.json({ user, posts });
                })
                .catch(err => {
                    console.error('Error fetching posts:', err);
                    res.status(422).json({ error: err });
                });
        })
        .catch(err => {
            console.error('Error fetching user:', err);
            res.status(404).json({ error: "User not found" });
        });
});

router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, { new: true })
    .then(() => {
        return User.findByIdAndUpdate(req.user._id, {
            $push: { followings: req.body.followId }
        }, { new: true })
        .select("-password")
    })
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.error('Error following user:', err);
        res.status(422).json({ error: err });
    });
});

router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    }, { new: true })
    .then(() => {
        return User.findByIdAndUpdate(req.user._id, {
            $pull: { followings: req.body.unfollowId }
        }, { new: true })
        .select("-password")
    })
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.error('Error unfollowing user:', err);
        res.status(422).json({ error: err });
    });
});


module.exports = router

