const express = require('express');
const Task = require("../models/task");
const router=new express.Router();

//creating task
router.post("/tasks", async (req, res) => { 
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    }catch (err) {
        res.status(400).send(err.message);
    }
});

//list of all tasks
router.get("/tasks", async (req,res)=>{
    try{
        const tasks = await Task.find({});
        res.status(302).send(tasks);
    }catch (err){
        res.status(500).send();
    }
});

//getting specific task by id
router.get("/tasks/:id", async (req, res)=>{
    const _id = req.params.id;
    try{
        const task = await Task.findById(_id);
        if(!task) return res.status(404).send();
        res.send(task);
    }catch (err){
        res.status(500).send();
    }
});

//update task
router.patch('/task/:id',async (req, res)=>{
    const updates=OBject.keys(req.body);
    const allowedUpdates=["description","completed"];
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update));
    if(!isValidOperation) return res.status(400).send({error:"Invalid update"});
    try {
        const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(!task) return res.status(404).send();
        res.send(task);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


//delete task
router.delete('/tasks/:id',async (req, res)=>{
    const _id =req.params.id;
    try{
        const task = await Task.findByIdAndDelete(_id);
        if(!task) return res.status(404).send();
        res.send(task);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;