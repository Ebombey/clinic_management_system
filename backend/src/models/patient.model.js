import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jwt";

const patientSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!!!"],
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    profileIMG: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

patientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 10);

  next();
});

patientSchema.methods.isPasswordCorrect = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

patientSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

patientSchema.methods.generateFreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.FRESH_TOKEN_SECRET,
    { expiresIn: process.env.FRESH_TOKEN_EXPIRY },
  );
};

export const Patient = mongoose.model("Patient", patientSchema);
