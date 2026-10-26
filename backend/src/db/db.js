import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  console.log(`${process.env.DB_URL}`);
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DB_URL}/${DB_NAME}`,
    );

    console.log(
      `\n MongoDB connected!!! DB Host: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.error("Mongo DB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
