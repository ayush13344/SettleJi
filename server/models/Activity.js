import mongoose from "mongoose";

const activitySchema = mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group"
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    action: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;