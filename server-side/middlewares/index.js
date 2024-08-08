const { expressjwt } = require('express-jwt');
const Post = require('../models/post');
const User = require('../models/user');

const requireSignin = expressjwt({  
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: 'auth',
})

const canEditDeletePost = async(req,res,next) =>{
    try{
        const post = await Post.findById(req.params._id);
        console.log('Post in Edit Delete middleware',post);
        console.log('posted by this guy',post.postedBy._id==req.auth._id)
        if(post.postedBy._id!= req.auth._id){
            return res.status(400).send("Unauthorized");
        }else{
            next();
        }
    }catch(err){
        console.log(err);
    }
}

const isAdmin = async (req,res,next) => {
    try{
        const user = await User.findById(req.auth._id);
        if(user.role!=='Admin'){
            return res.status(400).send('Unauthorized');
        }else{
            next();
        }
    }catch(err){
        console.log(err);
    }
}

module.exports = {requireSignin,canEditDeletePost,isAdmin};