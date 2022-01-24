const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require("../../src/models/user");
const Task = require('../../src/models/task');


const userOneId= new mongoose.Types.ObjectId();

const userOne = {
    _id:userOneId,
    name:"Mike",
    email:"mike@example.com",
    password:"what123",
    age:23,
    tokens: [{
        token: jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
};

const userTwoId = new mongoose.Types.ObjectId();

const userTwo = {
    _id:userTwoId,
    name:"Andrew",
    email:"andrew@example.com",
    password:"dat123112",
    age:23,
    tokens: [{
        token: jwt.sign({_id:userTwoId},process.env.JWT_SECRET)
    }]
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "Testing task",
    completed: false,
    created_by: userOne._id
};

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Testing task 2",
    completed: true,
    created_by: userOne._id
};

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Testing task 3",
    completed: true,
    created_by: userTwo._id
};

const setupData = async ()=>{
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
};

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupData
}