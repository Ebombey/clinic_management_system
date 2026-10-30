import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      unique: true,
      sparse: true,
    },
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

    symptoms: [{ type: String, trim: true }],
    vitals: {
      bloodPressure: { type: String, trim: true }, // 120/80
      pulse: Number, // bpm
      temperature: Number, // °C
      weight: Number, // kg
      spo2: Number, // %
    },

    diagnosis: [
      {
        condition: { type: String, required: true, trim: true },
        icdCode: { type: String, trim: true },
        notes: { type: String, trim: true },
        _id: false,
      },
    ],

    prescription: [
      {
        medicine: { type: String, required: true, trim: true },
        dosage: { type: String, trim: true },
        frequency: { type: String, trim: true },
        durationDays: { type: Number, min: 1 },
        instructions: { type: String, trim: true },
      },
    ],

    advisedTests: [{ type: String, trim: true }],
    notes: { type: String, trim: true },
    followUpDate: { type: Date },
  },
  { timestamps: true },
);

consultationSchema.index({ patient: 1, createdAt: -1 });
consultationSchema.index({ doctor: 1, createdAt: -1 });

export const Consultation = mongoose.model("Consultation", consultationSchema);
