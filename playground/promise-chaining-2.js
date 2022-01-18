require ("../src/db/mongoose")
const Task= require ("../src/models/task")


// Task.findByIdAndDelete("61e441c48fb1ec0c05e8cb6b").then((task) => {
//     console.log("removed task: " + task);
//     return Task.countDocuments({completed:false});
// }).then((result) => {
//     console.log(result);
// }).catch((err) => {
//     console.log(err); 
// });


const deleteTaskAndCount= async (id)=> {
    await Task.findByIdAndDelete(id);
    const count =  await Task.countDocuments({completed:false});
    return count;
}


deleteTaskAndCount("61e5bc4a103d0af1fb1ed157").then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err.message);
});