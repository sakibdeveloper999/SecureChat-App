import e from "express";
import mongoose from "mongoose";

export const connectDB = async () => {
  try {

   mongoose.connection.on('connected',()=>console.log('Database Connected'));
   mongoose.connection.on('error',(err)=>console.log(`Database connection error: ${err.message}`));
   await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    console.log("MongoDB connected successfully");

  } catch (error) {
    console.log(error);
  } 
};

