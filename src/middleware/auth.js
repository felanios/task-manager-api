const { request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const auth = async (req, res, next)=>{
    try {
        const token = req.get('Authorization').split(' ')[1];
        const decoded = jwt.verify(token,'secret');
        const user = await User.findOne({_id:decoded._id,'tokens.token': token});
        if(!user) throw new Error();
        next();
        req.user = user;
        console.log(req.user);
    } catch (err) {
        res.status(401).send({error:"Please authenticate."});
    }
};

module.exports = auth;