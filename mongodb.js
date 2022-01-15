const {MongoClient,ObjectID}=require('mongodb');

const connectionURL="mongodb://127.0.0.1:27017";
const databaseName="task-manager";


const id = new ObjectID();
console.log(id);
console.log(id.getTimestamp);


MongoClient.connect(connectionURL,{useNewUrlParser:true},(err, client) => {
    if(err) {
        return console.error("Unable to connect to database");
    }

    const db=client.db(databaseName);
    const db_users_collection=db.collection("Users");
    const db_tasks_collection=db.collection("Tasks");

    db_tasks_collection.insertMany([
        {description:"Blablabla",
         completed:true,
         isidentified:false},
        {description:"nownownow",
         completed:false},
    ]).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    });

});