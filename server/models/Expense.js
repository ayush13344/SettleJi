import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  // ✅ store name as string — group members have no _id
  user: {
    type: String,
    required: true,
  },
  share: {
    type: Number,
    required: true,
  },
});

const expenseSchema = mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },

    title: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
    },

    // ✅ store paidBy as name string — group members have no _id
    paidBy: {
      type: String,
    },

    participants: [participantSchema],

    receipt: {
      type: String,
    },

    notes: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Pending", "Settled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;