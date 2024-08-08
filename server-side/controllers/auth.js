const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');





const register=async (req,res)=>{
    console.log('REGISTER ENDPOINT =>',req.body);
    const {name,email,password,secret} = req.body;
    // validation
    if(!name) return res.json({error:"Name is required"});
    if(!email) return res.json({error:"Email is required!!"})
    if(!password || password.length < 6)return res.json({error:"Password is requried and should be 6 characters long"});
    if(!secret)return res.json({error:"Answer is required"});
    const exist = await User.findOne({email});
    if(exist) return res.json({error:"Email is taken"});
    
    // hash password
    const hashedPassword= await hashPassword(password);
    const uniqueId = uuidv4().replace(/-/g, '').slice(0, 6);
    const user = new User({
        name,
        email,
        password:hashedPassword,
        secret,
        username:uniqueId});
    try{
        await user.save();
        console.log('Registered User! =>',user); 
        return res.json({ok:"User registered Successfully"});
    }catch(err){
        console.log('REGISTER FAILED=> ', err);
        return res.json({error:"Error. Try again"});
    }


};

const login = async (req,res) => {
    console.log(req.body);
    try{
        // check if db has that user with that email
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user) return res.json({error:'No user with this email'});

        // comparepassword takes client password and compares with database hashed password
       const match = await comparePassword(password,user.password);
       if(!match)return res.json({error:'Incorrect Password !!'});
        // create signed token
    const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET, {
        expiresIn: "7d" 
    });
    
    user.password = undefined;
    user.secret = undefined;
    res.json({
        token,
        user
    })
 
    }catch(err){
        console.log(err)
        return res.status(400).send('Error. Try again');
    }
}

const currentUser = async(req,res) =>{
    try{
        console.log('this is my req',req.auth._id);
        const user = await User.findById(req.auth._id)    
        res.json({
            ok:true
        })
    }catch(err){
        console.log(err);
        res.sendStatus(400);
    }
}

const forgotPassword = async (req,res) => {
    const{email,newPassword,secret} = req.body;
    // validation
    if(!newPassword || newPassword<6){
        return res.json({
            error: "New password is required and should be min 6 characters long"
        });
    }
    if(!secret){
        return res.json({
            error: "Secret is required"
        })
    }

    const user = await User.findOne({ email, secret });
    if(!user){
        return res.json({
            error: "We cant verify you with those details"
        })
    }
    try{
        const hashed = await hashPassword(newPassword);
        await User.findByIdAndUpdate(user._id,{password:hashed});
        return res.json({
            success:'Congrats password changed!! '
        })
    }catch(err){
        res.json({
            error:"something went wrong"
        })
        console.log(err)
    }
}

const updateProfile = async(req,res)=>{
    try{
        console.log("profile upddate req.body", req.body);
        const data ={};
        if(req.body.username){
            data.username=req.body.username
        }
        if(req.body.about){
            data.about=req.body.about
        }
        if(req.body.name){
            data.name=req.body.name
        }
        if(req.body.password){
            if(req.body.password.length < 6){
                return res.json({
                    error:'Password is required and should be min 6 characters long'
                })
            }else{
                data.password=await hashPassword(req.body.password);
            }
        }
        if(req.body.secret){
            data.secret=req.body.secret;
        }
        if(req.body.image){
            data.image = req.body.image;
            
        }
        let user = await User.findByIdAndUpdate(req.auth._id,data,{new:true}); 
        user.password=undefined;
        user.secret=undefined;
        console.log('updated user',user);
        res.json(user);
    }catch(err){
        if(err.code == 11000 ){
            return res.json({error:"Duplicate username"});
        }

        console.log(err);
    }
}

const findPeople= async (req,res)=>{
    try{
        const user = await User.findById(req.auth._id);
        // user.following
        let following = user.following;
        following.push(user._id);
        const people = await User.find({_id:{ $nin: following }}).select('-password -secret').limit(10);
        console.log('all the peopel',people);
        res.json(people);
    }catch(err){
        console.log(err);
    }
}

const addFollower = async ( req,res,next)=>{
    try{
        const user = await User.findByIdAndUpdate(req.body._id, {
            $addToSet: { followers: req.auth._id}
        },{new:true});
        next();
    }catch(err){
        console.log(err);
    }
}


const userFollow  = async (req,res)=>{
    try{
        const user = await User.findByIdAndUpdate(req.auth._id,{
            $addToSet:{ following:req.body._id }
        },{new:true}).select("-password -secret")
        res.json(user);
    }catch(err){
        console.log(err);
    }
}

const userFollowing = async (req,res) => {
    try{
        const user = await User.findById(req.auth._id);
        const following = await User.find({_id: user.following}).limit(100);
        res.json(following);
    }catch(err){
        console.log(err);
    }
}

const removeFollower = async(req,res,next)=>{
    try{
        const user = await User.findByIdAndUpdate(req.body._id,{
            $pull:{followers:req.auth._id }
        });
        next();
    }catch(err){
        console.log(err);
    }
}

const userUnfollow = async (req,res) => {
    try{
        const user = await User.findByIdAndUpdate(req.auth._id,{
            $pull:{ following:req.body._id }
        }
        , { new:true })
        res.json(user);
    }catch(err){
        console.log(err);
    }
}

const searchUser = async(req,res)=>{
    const { query } = req.params;
    if(!query)return;
    try{
        const user = await User.find({
            $or: [
                {name:{$regex: query, $options: 'i'} },
                {username:{$regex: query, $options: 'i'} }
            ]
        }).select('-password -secret')
        res.json(user);
    }catch(err){
        console.log(err);
    }
}
const getUser = async(req,res)=>{
    try{
        console.log(req.params.username);
        const user = await User.findOne({username:req.params.username})
        .select('-password -secret')
        res.json(user)
    }catch(err){
        console.log(err);
    }
}



module.exports = {
    register,
    login,
    currentUser,
    forgotPassword,
    updateProfile,
    findPeople,
    addFollower,
    userFollow,
    userFollowing,
    removeFollower,
    userUnfollow,
    searchUser,
    getUser
}