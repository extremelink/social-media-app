const Post = require("../models/post");
const cloudinary = require('cloudinary');
const User = require("../models/user");


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET

})


const createPost = async (req,res) => {
    console.log(req.body)
    const { content, image } = req.body;
    console.log(content,image);
    if(!content.length){
        return res.json({
            error:"Content is Required!!"})
    }
    try{
        const post = new Post({
            content,
            image,
            postedBy:req.auth._id});
         await post.save();
         const postWithUser = await Post.findById(post._id).populate('postedBy','-password -secret')
        res.json(postWithUser);
    }catch(err){
        console.log(err);
        return res.status(400).json({
            error:"Content is Required!!"})
    }

}

const uploadImage= async (req,res) => {

console.log("req files =>", req.files);
try{
    const result = await cloudinary.uploader.upload(req.files.image.path);
    console.log('uploaded url',result)
    res.json({
        url:result.secure_url,
        public_id: result.public_id
    })
}catch(err){
    console.log("received error heree!!",err);
    res.status(500).json({ error: 'Image upload failed' });
}
}

const postsByUser = async(req,res) => {
    try{
        // const posts = await Post.find( {postedBy:req.auth._id} )
        const posts = await Post.find()
        .populate(
            'postedBy',
            '_id name image'
        ).sort({ createdAt: -1 })
        .limit(10)
        console.log('posts',posts);
        res.json(posts);
    }catch(err){
        console.log(err);
    }

}

const userPost = async (req,res) => {

    try{
        const post =await Post.findById(req.params._id)
        .populate('postedBy', '_id name image')
        .populate('comments.postedBy', '_id name image');
        res.json(post);

    }catch(err){
        console.log(err);
    }
}

const updatePost = async (req,res) =>{
    console.log('post update controller', req.body);
    
    try{
        const post = await Post.findByIdAndUpdate(req.params._id,req.body,{
            new:true,
        })
        res.json(post);
    }catch(err){
        console.log(err);
    }
}

const deletePost = async (req,res) =>{

    try{
        const post = await Post.findByIdAndDelete(req.params._id);
        // remove image from cloudinary
        if(post.image && post.image.public_id){
            const image = await cloudinary.uploader.destroy(post.image.public_id);
        }
        res.json({ok:"deleted!!"});
    }catch(err){
        console.log(err);
    }
}

const newsFeed = async (req,res)=>{
    try{
        const user = await User.findById(req.auth._id);
        let following = user.following;
        following.push(req.auth._id);

        const currentPage = parseInt(req.params.page) || 1;
        const perPage = 3;
        console.log('req',currentPage,req.params.page)

        const posts = await Post.find({ postedBy: { $in: following } })
        .skip((currentPage-1) * perPage)
        .populate('postedBy', '_id name image')
        .populate('comments.postedBy', '_id name image')
        .sort({ createdAt: -1 })
        .limit(perPage)
        
        res.json(posts);
    }catch(err){
        console.log(err);
    }
}

const likePost = async (req,res)=>{
    try{
        const post = await Post.findByIdAndUpdate(req.body._id,{
            $addToSet:{likes: req.auth._id}
        },{new:true})
        res.json(post);
    }catch(err){
        console.log(err);
    }
}

const unlikePost = async(req,res)=>{
    try{
        const post = await Post.findByIdAndUpdate(req.body._id,{
            $pull:{ likes:req.auth._id }
        },{new:true})
        res.json(post);

    }catch(err){
        console.log(err);
    }

}


const addComment = async (req,res)=>{
    try{
        const { postId, comment } = req.body;
        const data = {
            text:comment,
            postedBy:postId

        }
        const post = await Post.findByIdAndUpdate(postId,{
            $push:{ comments: { text:comment, postedBy:req.auth._id }   }
        },
        {new:true}
    ).populate('postedBy', "_id name image")
    .populate("comments.postedBy","_id name image")
        res.json(post);
    }catch(err){
        console.log(err);
    }
}
const removeComment = async (req,res)=>{
    try{
        const { postId, comment } = req.body;
        const data = {
            text:comment,
            postedBy:postId

        }
        const post = await Post.findByIdAndUpdate(postId,{
            $pull:{ comments: { _id:comment._id }   }
        },
        {new:true}
    )
    res.json(post);
    }catch(err){
        console.log(err);
    }
}

const totalPosts = async (req,res) => {
    try{
        const total = await Post.estimatedDocumentCount();
        res.json(total);
    }catch(err){
        console.log(err);
    }

}
const posts =async (req,res) =>{    
    try{
        const posts = await Post.find()
        .populate("postedBy","_id name image")
        .populate("comments.postedBy","_id name image")
        .sort({createdAt: -1})
        .limit(12)
        res.json(posts);
    }catch(err){
        console.log(err);
    }
}
const getPost = async (req,res)=>{
    try{
        const post = await Post.findById(req.params._id)
        .populate("postedBy","_id name image")
        .populate("comments.postedBy","_id name image")
        res.json(post);
    }catch(err){
        console.log(err);
    }
}

module.exports = { 
                createPost,
                uploadImage,
                postsByUser,
                userPost,
                updatePost,
                deletePost, 
                newsFeed,
                likePost,
                unlikePost,
                addComment,
                removeComment,
                totalPosts,
                posts,
                getPost
            };