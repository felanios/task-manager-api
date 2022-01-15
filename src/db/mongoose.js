const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser:true
});

const Tasks = mongoose.model('tasks',{
    description: {
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        required:false,
        default:false
    }
});

const newTask = new Tasks({
    description: 'This is test field for description',
    completed:true
});

newTask.save().then((result) => {
    console.log('User added successfully',result);
}).catch((error)=>{
    console.log("Error",error);
});


// const User=mongoose.model('User',{
//     name: {
//         type: String,
//         required: true,
//         trim:true
//     },
//     email: {
//         type: String, 
//         required: true,
//         trim:true,
//         lowercase:true,
//         validate(value) {
//             if(!validator.isEmail(value)){
//                 throw new Error("Email is invalid")
//             }
//         }
//     },
//     password:{
//         type:String,
//         required:true,
//         minlength:7,
//         trim:true,
//         validate(value) {
//             if(value.toLowerCase().includes("password")){
//                 throw new Error("Password cannot contain 'password'.");
//             }
//         }
//     },
//     age: {
//         type: Number,
//         default:0,
//         validate(value){
//             if(value<0){
//                 throw new Error("Age must be a positive number");
//             }
//         }
//     }
// });

// const newUser =new User({
//     name:"Furkan",
//     email:"FURKAN@gmail.com",
//     password:"1234567",
//     age:23

// });

// newUser.save().then(() => {
//     console.log("User saved",newUser);
// }).catch((err) =>{
//     console.log(err);
// });