import mongoose from "mongoose";

const expenseSchema = mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group"
    },

    title: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    category: {
      type: String
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },

        share: {
          type: Number
        }
      }
    ],

    receipt: {
      type: String
    },

    notes: {
      type: String
    },

    status: {
      type: String,
      enum: ["Pending", "Settled"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;