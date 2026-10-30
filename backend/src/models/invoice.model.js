import mongoose from "mongoose";
import getNextSequence from "./index.js";

export const PAYMENT_METHODS = [
  "cash",
  "card",
  "upi",
  "credit",
  "insurance",
  "net_banking",
];
export const INVOICE_STATUS = [
  "pending",
  "partially_paid",
  "paid",
  "cancelled",
  "refunded",
];

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true, index: true },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    consultation: { type: mongoose.Schema.Types.ObjectId, ref: "Consultation" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        description: { type: String, required: true, trim: true },
        quantity: { type: Number, default: 1, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        _id: false,
      },
    ],

    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },

    payments: [
      {
        amount: { type: Number, required: true, min: 0.01 },
        method: { type: String, enum: PAYMENT_METHODS, required: true },
        transactionId: { type: String, trim: true },
        paidAt: { type: Date, default: Date.now },
      },
    ],

    status: { type: String, enum: INVOICE_STATUS, default: "pending" },
  },
  { timestamps: true },
);

invoiceSchema.pre("validate", async function (next) {
  this.subtotal = this.items.reduce(
    (sum, i) => sum + i.quantity * i.unitPrice,
    0,
  );
  this.total = Math.max(this.subtotal - this.discount + this.tax, 0);
  this.amountPaid = this.payment.reduce((sum, p) => sum + p.amount, 0);

  if (this.status !== "cancelled" && this.status !== "refunded") {
    if (this.amountPaid <= 0) this.status = "pending";
    else if (this.amountPaid < this.total) this.status = "partially_paid";
    else this.status = "paid";
  }

  if (this.isNew && !this.invoiceNumber) {
    const year = new Date().getFullYear();
    const seq = await getNextSequence;
    this.invoiceNumber = `INV-${year}-${String(seq).padStart(6, "0")}`;
  }

  next();
});

export const Invoice = mongoose.model("Invoice", invoiceSchema);
