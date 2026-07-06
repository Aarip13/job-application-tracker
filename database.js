
/*require('dotenv').config()
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Atlas Connected");
    })
    .catch((error) => {
        console.log(error);
    });*/
    const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/jobTracker")
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => console.log(error));