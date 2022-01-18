require ("../src/db/mongoose")
const User = require("../src/models/user")

// User.findByIdAndUpdate('61e43162943b529124ece373',{age:23}).then((user) => {
//     console.log(user);
//     return User.countDocuments({age:23});
// }).then((result) => {
//     console.log(result);
// }).catch((err) => {
//     console.log(err.message);
// });

const updateAgeAndCount = async (id,age) => {
    const user = await User.findByIdAndUpdate(id,{age:age});
    const count = await User.countDocuments({age:age});
    return count;
};

updateAgeAndCount("61e43162943b529124ece373",23).then((count) => {
    console.log(count);
}).catch((err) => {
    console.log(err.message);
})