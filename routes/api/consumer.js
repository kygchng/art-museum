const express = require("express"); //backend framework that handles API requests
const router = express.Router();

const User = require("../../models/User");
const Room = require("../../models/Room");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
var ObjectId = require("mongodb").ObjectId;

router.post("/register/user", async(req, res) => {
    const duplicateUsername = await User.findOne({username: req.body.username});
    const duplicateEmail = await User.findOne({email: req.body.email});
    if(duplicateUsername || duplicateEmail) {
        return res.status(400).send({});
    } else {
        const newUser = new User(req.body);
        newUser.save().catch(err => console.log(err));
        return res.status(200).send(newUser);
    }
});

router.post("/create/room", async(req, res) => {
    const duplicate = await Room.findOne({name: req.body.name});
    const userId = ObjectId(req.body.creator);
    const user = await User.findById(userId);
    if(!duplicate && user.is_admin) {
        const newRoom = new Room(req.body);
        newRoom.save().catch(err => console.log(err));
        return res.status(200).send(newRoom);
    } else {
        return res.status(400).send({});
    }
})

router.post("/create/post", async(req, res) => {
    const userId = ObjectId(req.body.user_id);
    const user = await User.findById(userId);
    //console.log(user.username, " --> this is the username");

    const roomId = ObjectId(req.body.room_id);
    const room = await Room.findById(roomId);

    if(user && room) {
        const newPost = new Post(req.body);

        //update user's room[] 
        const updatedUserRooms = user.rooms;
        //console.log(updatedUserRooms, " --> this should be a list")
        updatedUserRooms.push(req.body.room_id);
        const updatedUserValues = {
            email: user.email, 
            password: user.password, 
            username: user.username,
            birthday: user.birthday, 
            bio: user.bio, 
            profile_picture: user.profile_picture, 
            is_admin: user.is_admin,
            rooms: updatedUserRooms 
        }
        await User.findOneAndUpdate({_id: userId}, updatedUserValues); 

        //update room's contributor[] 
        const updatedRoomContributors = room.contributors;
        updatedRoomContributors.push(req.body.user_id);

        //const updatedRoomPosts = room.posts;
        //updatedRoomPosts.push(newPost._id);

        const updatedRoomValues = {
            name: room.name,
            picture: room.picture, 
            description: room.description,
            //posts: updatedRoomPosts,
            contributors: updatedRoomContributors, 
            creator: room.creator
        }
        await Room.findOneAndUpdate({_id: roomId}, updatedRoomValues);

        newPost.save().catch(err => console.log(err));
        return res.status(200).send(newPost);
    } else {
        return res.status(400).send({});
    }
})

router.get("/fetch/rooms", async(req, res) => {
    const roomList = await Room.find();
    //console.log(roomList);
    if(roomList.length != 0) {
        return res.status(200).send(roomList);
    } else {
        return res.status(404).send({});
    }
});

router.get("/fetch/room/:roomID", async(req, res) => {
    const roomId = ObjectId(req.params.roomID);
    const room = await Room.findById(roomId);
    if(room) {
        return res.status(200).send(room);
    } else {
        return res.status(404).send({});
    }
})

router.get("/fetch/post/:postID", async(req, res) => {
    const postId = ObjectId(req.params.postID);
    const post = await Post.findById(postId);
    if(post) {
        return res.status(200).send(post);
    } else {
        return res.status(404).send({});
    }
})

router.get("/fetch/user/email/:email", async(req, res) => {
    const user = await await User.findOne({email: req.params.email});
    if(user) {
        return res.status(200).send(user);
    } else {
        return res.status(404).send({});
    }
})

router.get("/fetch/user/ID/:userID", async(req, res) => {
    const userId = ObjectId(req.params.userID);
    const user = await User.findById(userId);
    if(user) {
        return res.status(200).send(user);
    } else {
        return res.status(404).send({});
    }
})

router.delete("/delete/user/:email", async(req, res) => {
    const user = await User.findOne({email: req.params.email});
    if(user) {
        const deletedUser = await User.deleteOne({email: req.params.email});
        return res.status(200).send(deletedUser);
    } else {
        return res.status(404).send({});
    }
})

router.get("/fetch/posts/:roomID", async(req, res) => {
    const postList = await Post.find({room_id: req.params.roomID, is_approved: true});
    if(postList.length != 0) {
        return res.status(200).send(postList);
    } else {
        return res.status(404).send({});
    }
})

router.get("/fetch/posts/user/:userID", async(req, res) => {
    const postList = await Post.find({user_id: req.params.userID, is_approved: true});
    if(postList.length != 0) {
        return res.status(200).send(postList);
    } else {
        return res.status(404).send({});
    }
})

router.get("/fetch/contributors/:roomID", async(req, res) => {
    const roomId = ObjectId(req.params.roomID);
    const room = await Room.findById(roomId);
    if(room) {
        return res.status(200).send(room.contributors);
    } else {
        return res.status(404).send({});
    }
})

router.delete("/delete/room/:roomID", async(req, res) => {
    const roomId = ObjectId(req.params.roomID);
    const room = await Room.findById(roomId);
    if(room) {
        const deletedRoom = await Room.deleteOne({_id: roomId});
        return res.status(200).send(deletedRoom);
    } else {
        return res.status(404).send({});
    }
})

router.put("/approve/post/:postID", async(req, res) => {
    const postId = ObjectId(req.params.postID);
    const post = await Post.findById(postId);
    if(post) {

        const updatedPostValues = {
            user_id: post.user_id,
            username: post.username,
            room_id: post.room_id, // → post.find(room_id)
            title: post.title,
            description: post.description,
            picture: post.picture, // (link)
            likes: post.likes, // of user ObjectIds
            //comments: post.comments, // of comment ObjectIds
            is_approved: req.body.is_approved
        }
        await Post.findOneAndUpdate({_id: postId}, updatedPostValues); 

        return res.status(200).send(post);
    } else {
        return res.status(404).send({});
    }
})

router.post("/create/comment", async(req, res) => {
    const postId = ObjectId(req.body.post_id);
    const post = await Post.findById(postId);

    if(post) {
        const newComment = new Comment(req.body);

        /*
        //update post's comment[] 
        const updatedPostComments = post.comments;
        //console.log(updatedUserRooms, " --> this should be a list")
        updatedPostComments.push(newComment._id);
        const updatedPostValues = {
            user_id: post.user_id,
            room_id: post.room_id, // → post.find(room_id)
            title: post.title,
            description: post.description,
            picture: post.picture, // (link)
            likes: post.likes, // of user ObjectIds
            comments: updatedPostComments, // of comment ObjectIds
            is_approved: post.is_approved
        }
        await Post.findOneAndUpdate({_id: postId}, updatedPostValues); 
        */

        newComment.save().catch(err => console.log(err));
        return res.status(200).send(newComment);
    } else {
        return res.status(404).send({});
    }
})

router.get("/fetch/comments/:postID", async(req, res) => {
    const postId = ObjectId(req.params.postID);
    const post = await Post.findById(postId);

    if(post) {
        const commentsList = await Comment.find({post_id: req.params.postID});
        return res.status(200).send(commentsList);
    } else {
        return res.status(404).send({});
    }
})

router.get("/fetch/unapproved/posts", async(req, res) => {
    const unapprovedList = await Post.find({is_approved: false});
    if(unapprovedList.length != 0) {
        return res.status(200).send(unapprovedList);
    } else {
        return res.status(404).send({});
    }
})

router.put("/increase/likes/:postID/:userID", async(req, res) => {
    const postId = ObjectId(req.params.postID);
    const post = await Post.findById(postId);

    const userId = ObjectId(req.params.userID);
    const user = await User.findById(userId);

    if(post && user) {
        const updatedLikes = post.likes;
        updatedLikes.push(req.params.userID);

        const updatedPostValues = {
            user_id: post.user_id,
            username: post.username,
            room_id: post.room_id, // → post.find(room_id)
            title: post.title,
            description: post.description,
            picture: post.picture, // (link)
            likes: updatedLikes, // of user ObjectIds
            //comments: post.comments, // of comment ObjectIds
            is_approved: post.is_approved
        }
        await Post.findOneAndUpdate({_id: postId}, updatedPostValues); 

        return res.status(200).send(post);
    } else {
        return res.status(404).send({});
    }
})

router.put("/decrease/likes/:postID/:userID", async(req, res) => {
    const postId = ObjectId(req.params.postID);
    const post = await Post.findById(postId);

    const userId = ObjectId(req.params.userID);
    const user = await User.findById(userId);

    if(post && user) {
        const updatedLikes = post.likes;
        for(var i = 0; i < updatedLikes.length; i++) {
            if (updatedLikes[i] === req.params.userID) {
                updatedLikes.splice(i, 1);
                break;
            }
        }

        const updatedPostValues = {
            user_id: post.user_id,
            username: post.username,
            room_id: post.room_id, // → post.find(room_id)
            title: post.title,
            description: post.description,
            picture: post.picture, // (link)
            likes: updatedLikes, // of user ObjectIds
            //comments: post.comments, // of comment ObjectIds
            is_approved: post.is_approved
        }
        await Post.findOneAndUpdate({_id: postId}, updatedPostValues); 

        return res.status(200).send(post);
    } else {
        return res.status(404).send({});
    }
})

router.delete("/delete/post/:postID", async(req, res) => {
    const postId = ObjectId(req.params.postID);
    const post = await Post.findById(postId);
    if(post) {
        const deletedPost = await Post.deleteOne({_id: postId});
        return res.status(200).send(deletedPost);
    } else {
        return res.status(404).send({});
    }
})

router.delete("/delete/comment/:commentID", async(req, res) => {
    const commentId = ObjectId(req.params.commentID);
    const comment = await Comment.findById(commentId);
    if(comment) {
        const deletedComment = await Comment.deleteOne({_id: commentId});
        return res.status(200).send(deletedComment);
    } else {
        return res.status(404).send({});
    }
})

module.exports = router;