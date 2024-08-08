const express = require('express');
const router = express.Router();

// controllers
const { register, 
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
    } = require('../controllers/auth');
const { requireSignin, isAdmin} = require('../middlewares');

router.post('/register',register)
router.post('/login',login)
router.get('/current-user',requireSignin, currentUser);
router.post('/forgot-password',forgotPassword)
router.put('/profile-update',requireSignin,updateProfile)
router.get('/find-people',requireSignin,findPeople);

router.put('/user-follow', requireSignin, addFollower, userFollow);
router.put("/user-unfollow",requireSignin,removeFollower,userUnfollow)
router.get("/user-following",requireSignin,userFollowing)

router.get('/search-user/:query',requireSignin,searchUser)

router.get('/user/:username',requireSignin,getUser);

router.get('/current-admin',requireSignin, isAdmin, currentUser);


module.exports = router;