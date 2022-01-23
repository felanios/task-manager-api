const express = require('express');
const Task = require("../models/task");
const auth = require('../middleware/auth');
const SearchOptions = require('../middleware/searchOptions');
const router=new express.Router();

//creating task
router.post("/tasks",auth, async (req, res) => { 
    //const task = new Task(req.body);
    const task= new Task({
        ...req.body,
        created_by:req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    }catch (err) {
        res.status(400).send(err.message);
    }
});


// GET /tasks?completed=false
//list of all tasks auth users
router.get("/tasks",auth, async (req,res)=>{
    const match = {};
    if(req.query.completed) {
        match.completed = req.query.completed === "true";
    }
    try{
        await req.user.populate({
            path:"tasks",
            ...new SearchOptions(req.query),
            match 
            });
        res.send(req.user.tasks);
    }catch (err){
        res.status(500).send();
    }
});

//get specific task by _id
router.get("/tasks/:id",auth, async (req,res)=>{
    const _id = req.params.id;
    try{
        const tasks = await Task.findOne({_id,created_by:req.user._id});
        if(!tasks) {
            return res.status(404).send({error:"task not found"});
        }
        res.status(302).send(tasks);
    }catch (err){
        res.status(500).send();
    }
});


//update task
router.patch('/tasks/:id',auth,async (req, res)=>{
    const updates=Object.keys(req.body);
    const allowedUpdates=["description","completed"];
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update));
    if(!isValidOperation) {
        return res.status(400).send({error:"Invalid update"});
    }
    try {
        const task = await Task.findOne({_id:req.params.id,created_by:req.user._id});
        updates.forEach((update)=> task[update]=req.body[update]);
        await task.save();
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


//delete task
router.delete('/tasks/:id',auth,async (req, res)=>{
    const _id =req.params.id;
    try{
        const task = await Task.findOneAndDelete({_id,created_by:req.user._id});
        if(!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;