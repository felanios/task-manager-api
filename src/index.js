const express = require('express');
require("./db/mongoose")
const User = require("./models/user");
const Task = require("./models/task");


const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

//create user
app.post("/users",async (req, res) => { 
    const user  = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

//list of all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(302).send(users);
    } catch (err) {
        res.status(500).send();
    }
});

//getting specific user by id
app.get('/users/:id', async (req,res)=>{
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if(!user) return res.status(404).send();
        res.send(user);
    } catch (err) {
        res.status(500).send();
    }
});

//creating task
app.post("/tasks", async (req, res) => { 
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    }catch (err) {
        res.status(400).send(err.message);
    }
});

//list of all tasks
app.get("/tasks", async (req,res)=>{
    try{
        const tasks = await Task.find({});
        res.status(302).send(tasks);
    }catch (err){
        res.status(500).send();
    }
});

//getting specific task by id
app.get("/tasks/:id", async (req, res)=>{
    const _id = req.params.id;
    try{
        const task = await Task.findById(_id);
        if(!task) return res.status(404).send();
        res.send(task);
    }catch (err){
        res.status(500).send();
    }
});


app.listen(port, ()=>{
    console.log('Server is on port ',+port);
});

