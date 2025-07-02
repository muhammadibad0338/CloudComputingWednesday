import mongoose from 'mongoose';


const MONGODB_URI = 'mongodb://localhost:27017/';

const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: "CloudDB",
        });
        console.log("Connected to MongoDB.");
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
};

export default connectMongoDB;