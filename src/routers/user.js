const express = require('express');
const User = require("../models/user");
const auth = require('../middleware/auth');
const router=new express.Router();



//create user
router.post("/users",async (req, res) => { 
    const user  = new User(req.body);
    const token = await user.generateAuthToken();
    try {
        await user.save();
        res.status(201).send({user,token});
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post('/users/login',async (req, res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        res.send({user});
    } catch (err) {
        res.status(400).send();
    }
});



//list of all users
router.get("/users",auth,async (req, res) => {
    try {
        const users = await User.find({});
        res.status(302).send(users);
    } catch (err) {
        res.status(500).send();
    }
});

//getting specific user by id
router.get('/users/:id', async (req,res)=>{
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if(!user) return res.status(404).send();
        res.send(user);
    } catch (err) {
        res.status(500).send();
    }
});

//Update user
router.patch("/users/:id",async (req, res)=>{
    const updates=Object.keys(req.body);
    const allowedUpdates=["name","email","password","age"];
    const isValidOperation=updates.every((update)=> allowedUpdates.includes(update));
    if(!isValidOperation) return res.status(400).send({error:"Invalid updates!"});
    try {
        const user = await User.findById(req.params.id);
        updates.forEach((update)=> user[update]=req.body[update]);
        await user.save();
        //const user = await User.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true});
        if(!user) return res.status(404).send();
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//delete user
router.delete('/users/:id',async (req, res)=>{
    const _id =req.params.id;
    try{
        const user = await User.findByIdAndDelete(_id);
        if(!user) return res.status(404).send();
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


module.exports = router;