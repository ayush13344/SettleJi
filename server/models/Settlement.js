import mongoose from "mongoose";

const settlementSchema = mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    // ✅ stored as name strings since group members have no _id
    fromUser: {
      type: String,
      required: true,
    },

    toUser: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Settlement = mongoose.model("Settlement", settlementSchema);

export default Settlement;