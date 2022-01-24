const request = require('supertest');
const app = require("../src/app");
const User = require("../src/models/user");
const {userOneId,userOne,setupData} = require('./fixtures/db');


beforeEach(setupData);



test('Should signup a new user', async ()=> {
    const response = await request(app).post('/users').send({
        name: "Eyüp Furkan Özmen",
        email: "felanios9@gmail.com",
        password: "19981998Aa",
        age: 23
    }).expect(201);

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: "Eyüp Furkan Özmen",
            email: "felanios9@gmail.com",
            age: 23
        },
        token: user.tokens[0].token
    });
    expect(user.password).not.toBe("19981998Aa");
});

test('should login existing user',async ()=>{
   const response = await request(app).post('/users/login').send({
       email:userOne.email,
       password:userOne.password
   }).expect(200);
   const user = await User.findById(response.body.user._id);
   expect(response.body.token).toBe(user.tokens[1].token);
});


test('should not login nonexisting user', async ()=>{
    await request(app).post('/users/login').send({
        email:"",
        password:""
    }).expect(400);
});

test('should get profile for user', async ()=>{
    await request(app)
    .get('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for authenticated  user', async ()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});


test('should delete account four user', async ()=>{
    await request(app)
    .delete('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    const user = await User.findById(userOneId);
    expect(user).not.toBe();
});


test('should not delete account for unauthorized user', async ()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});


test('Should upload avatar image',async ()=>{
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/profile-pic.jpg')
    .expect(200);
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});


test('should update valid user fields', async ()=>{
    const name = "Testing";
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        name:name
    })
    .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toEqual(name);
});


test('should not update valid user fields', async ()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        location:"Istanbul"
    })
    .expect(400);
});
