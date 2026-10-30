import mongoose, { Schema } from "mongoose";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const TIME_24H = /^([01]\d|2[0-3]):[0-5]\d$/;

const doctorSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },
    practiceArea: { type: String, trim: true },
    qualification: [
      {
        degree: { type: String, required: true, trim: true },
        specialization: { type: String, trim: true },
        institution: { type: String, trim: true },
        yearOfCompletion: {
          type: Number,
          min: 1950,
          max: () => new Date().getFullYear(),
        },
      },
    ],

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    registrationCouncil: {
      type: String,
      required: true,
      trim: true,
    },
    experienceYears: { type: Number, min: 0, default: 0 },
    consultationFee: { type: Number, required: true },

    // Weekly availability
    weeklySchedule: [
      {
        day: { type: String, enum: DAYS, required: true },
        startTime: { type: String, required: true, match: TIME_24H },
        endTime: { type: String, required: true, match: TIME_24H },
        slotDuration: { type: Number, default: 15, min: 5 },
        _id: false,
      },
    ],

    isAcceptingAppointments: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
