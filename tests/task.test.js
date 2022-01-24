const request = require('supertest');
const mongoose = require('mongoose');
const app = require("../src/app");
const Task = require("../src/models/task");
const {userOneId,userOne,userTwoId,userTwo,taskOne,taskTwo,taskThree,setupData} = require('./fixtures/db');


beforeEach(setupData);


test("Should create task for user", async () => {
    const response = await request(app)
        .post("/tasks")
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            description:"test description",
        })
        .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test("Should get all tasks of user", async () => {
    const response = await request(app)
        .get("/tasks")
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    expect(response.body.length).toEqual(2);
});


test("Test delete security", async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});