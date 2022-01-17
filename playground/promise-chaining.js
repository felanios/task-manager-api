require ("../src/db/mongoose")
const User = require("../src/models/user")

User.findByIdAndUpdate('61e43162943b529124ece373',{age:23}).then((user) => {
    console.log(user);
    return User.countDocuments({age:23});
}).then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err.message);
});

//61e43162943b529124ece373