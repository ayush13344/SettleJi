import mongoose from "mongoose";

const settlementSchema = mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group"
    },

    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    amount: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Settlement = mongoose.model("Settlement", settlementSchema);

export default Settlement;