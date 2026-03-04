const mongoose = require("mongoose");

const connectDB = async () => {
    const mongo_url = process.env.mongodb_url;
    console.log("Mongo URL: ", mongo_url ? "Exists" : "Undefined");
    try {
        await mongoose.connect(mongo_url);
        console.log("connected to mongodb");
    } catch (error) {
        console.log(error);
    }
}
module.exports = connectDB