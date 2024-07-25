const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

router.get('/allPosts', requireLogin, (req,res)=>{
    Post.find()
    .populate("postedBy","_id name")  //populate expands the postedBy section giving us all the details of the user (we specified that we want only id and name)
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err => {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: "Internal Server Error" });
    });
})

router.get('/getsubpost', requireLogin, (req,res)=>{
    Post.find({postedBy:{$in:req.user.followings}})
    .populate("postedBy","_id name")  //populate expands the postedBy section giving us all the details of the user (we specified that we want only id and name)
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err => {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: "Internal Server Error" });
    });
})

router.post('/createPost', requireLogin, (req,res)=>{
    
    const {title,body,pic} = req.body
    console.log(title,body,pic)
    // console.log("Received data:", req.body);
    if(!title || !body || !pic){
        return res.status(422).json({error:"missing fields"})
    }

    req.user.password = undefined //to avoid password in response
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.get('/myPosts', requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(myposts=>{
        res.json({myposts})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" });
    })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, { new: true }).exec()
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.error('Error liking post:', err);
        res.status(422).json({ error: err });
    });
});

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, { new: true }).exec()
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.error('Error unliking post:', err);
        res.status(422).json({ error: err });
    });
});

router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments:comment}
    }, { new: true })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec()
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.error('Error liking post:', err);
        res.status(422).json({ error: err });
    });
});

// router.delete('/deletepost/:postId', requireLogin, (req, res) => {
//     Post.findOne({_id:req.params.postId})
//     .populate("postedBy","_id")
//     .exec((err,post)=>{
//         if(err || !post){
//             return res.status(422).json({error:err || "Post not found" })
//         }
//         if(post.postedBy._id.toString() === req.user._id.toString()){
//             post.remove()
//             .then(result=>{
//                 res.json(result)
//             }).catch(err => {
//                 console.error('Error deleting post:', err);
//                 res.status(422).json({ error: err });
//             });
//         }else {
//             return res.status(401).json({ error: "You are not authorized to delete this post" });
//         }
//     })
// });

// router.delete('/deletepost/:postId', requireLogin, (req, res) => {
//     Post.findOne({_id: req.params.postId})
//         .populate("postedBy", "_id")
//         .then(post => {
//             if (!post) {
//                 return res.status(422).json({ error: "Post not found" });
//             }
//             if (post.postedBy._id.toString() !== req.user._id.toString()) {
//                 return res.status(401).json({ error: "You are not authorized to delete this post" });
//             }
//             post.remove()
//                 .then(result => {
//                     res.json(result);
//                 })
//                 .catch(err => {
//                     console.error('Error deleting post:', err);
//                     res.status(422).json({ error: err });
//                 });
//         })
//         .catch(err => {
//             console.error('Error fetching post:', err);
//             res.status(500).json({ error: "Internal Server Error" });
//         });
// });

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findOne({_id: req.params.postId})
        .populate("postedBy", "_id")
        .then(post => {
            if (!post) {
                return res.status(422).json({ error: "Post not found" });
            }
            if (post.postedBy._id.toString() !== req.user._id.toString()) {
                return res.status(401).json({ error: "You are not authorized to delete this post" });
            }
            // Using the model's static delete method instead of the instance method
            Post.deleteOne({ _id: req.params.postId })
                .then(result => {
                    res.json({ message: "Post deleted successfully", result });
                })
                .catch(err => {
                    console.error('Error deleting post:', err);
                    res.status(422).json({ error: err });
                });
        })
        .catch(err => {
            console.error('Error fetching post:', err);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

module.exports = router
