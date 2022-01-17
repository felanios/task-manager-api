require ("../src/db/mongoose")
const Task= require ("../src/models/task")


Task.findByIdAndDelete("61e441c48fb1ec0c05e8cb6b").then((task) => {
    console.log("removed task: " + task);
    return Task.countDocuments({completed:false});
}).then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err); 
});