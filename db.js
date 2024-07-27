const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    try{
        if(mongoose.connection.readyState === 1){
            return
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB connected')
        
    }
    catch(err){
        console.log("DB connection failed")
    }
}

module.exports = connectDB;