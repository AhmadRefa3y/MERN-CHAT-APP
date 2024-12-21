import mongoose from "mongoose";

export const connectDB = async () => {
  console.log("Connecting to MongoDB...");

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.log("MOngoDB Error: ", error);
  }
};
