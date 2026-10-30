import mongoose from "mongoose";

export const APPOINTMENT_STATUS = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
];

const TIME_24H = /^([01]\d|2[0-3]):[0-5]\d$/;

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // patient or receptionist

    date: { type: Date, required: true },
    startTime: { type: String, required: true, match: TIME_24H },
    endTime: { type: String, required: true, match: TIME_24H },

    status: { type: String, enum: APPOINTMENT_STATUS, default: "scheduled" },
    reason: { type: String, trim: true, maxLength: 500 },
    cancellationReason: { type: String, trim: true },
  },
  { timestamps: true },
);

appointmentSchema.index(
  { doctor: 1, date: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["scheduled", "confirmed"] } },
  },
);

// Common queries: a patient's history, a doctor's day.
appointmentSchema.index({ patient: 1, date: -1 });
appointmentSchema.index({ doctor: 1, date: 1, status: 1 });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
