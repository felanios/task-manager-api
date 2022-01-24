const express = require('express');
const sharp = require('sharp');
const User = require("../models/user");
const auth = require('../middleware/auth');
const {sendWelcomeMail,sendAccountCancellationMail} = require('../emails/account');
const fileUpload = require('../middleware/fileUpload');
const router=new express.Router();


//create user
router.post("/users",async (req, res) => { 
    const user  = new User(req.body);
    try {
        await user.save();
        sendWelcomeMail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({user,token});
    } catch (err) {
        res.status(400).send(err.message);
    }
});

//login process
router.post('/users/login',async (req, res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user:user,token});
    } catch (err) {
        res.status(400).send({error:"user not found"});
    }
});

//users logout
router.post('/users/logout',auth,async (req, res)=>{
    try {
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !==req.token;
        });
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send(); 
    }
});


//logout all
router.post("/users/logoutAll",auth,async (req, res)=>{
    try {
        req.user.tokens=[];
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send(); 
    }
});


//user info
router.get("/users/me",auth,async (req, res) => {
    res.send(req.user);
});


//Update user
router.patch("/users/me",auth,async (req, res)=>{
    const updates=Object.keys(req.body);
    const allowedUpdates=["name","email","password","age"];
    const isValidOperation=updates.every((update)=> allowedUpdates.includes(update));
    if(!isValidOperation) {
        return res.status(400).send({error:"Invalid updates!"});
    }
    try {
        const user = await User.findById(req.user._id);
        updates.forEach((update)=> user[update]=req.body[update]);
        await user.save();
        //const user = await User.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true});
        res.send(user);
    } catch (err) {
        res.status(500).send();
    }
});

//delete user
router.delete('/users/me',auth,async (req, res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.user._id);
        // if(!user) return res.status(404).send();
        await req.user.remove();
        sendAccountCancellationMail(req.user.email,req.user.name);
        res.send(req.user);
    } catch (err) {
        res.status(500).send();
    }
});

//Uploading avatar image
router.post('/users/me/avatar',auth,fileUpload.single("avatar"), async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    req.user.avatar=buffer;
    await req.user.save();
    res.send();
},(err,req,res,next)=>{
    res.status(404).send({error:err.message});
});


router.delete('/users/me/avatar',auth, async (req, res)=>{
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.status(200).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});


router.get('/users/:id/avatar',async (req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error();
        }
        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    } catch (err) {
        res.status(404).send();
    }
});

module.exports = router;