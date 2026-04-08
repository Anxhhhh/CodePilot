import mongoose from "mongoose";

export const connectdb = async () => {
  try {
    let res = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("There is an error", error);
  }
};