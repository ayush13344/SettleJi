import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    initials: {
      type: String,
    },

    color: {
      type: String,
    },
  },
  { _id: false }
);

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: ["trip", "flat", "friends", "office", "event"],
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    splitType: {
      type: String,
      enum: ["equal", "percentage", "custom"],
      default: "equal",
    },

    coverImage: {
      type: String,
      default: "",
    },

    members: [memberSchema],

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;