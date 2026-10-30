import mongoose, { Schema } from "mongoose";
import getNextSequence from "./index.js";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Patient Schema
const patientSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    patientCode: { type: String, unique: true, index: true },

    bloodGroup: { type: String, enum: BLOOD_GROUPS },
    allergies: { type: String, trim: true },
    chronicConditions: [{ type: String, trim: true }],

    emergencyContact: {
      name: { type: String, trim: true },
      relation: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
  },
  { timestamps: true },
);

patientSchema.pre("validate", async function (next) {
  if (!this.isNew || this.patientCode) return next();

  const seq = await getNextSequence("patient");
  this.patientCode = `PAT-${String(seq).padStart(6, "0")}`;

  next();
});

export const Patient = mongoose.model("Patient", patientSchema);
