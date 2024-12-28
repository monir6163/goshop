import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGO_URI is not defined in .env");
}

async function connectToDatabase() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1);
  }
}

export default connectToDatabase;
