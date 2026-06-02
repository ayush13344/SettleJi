// controllers/groupController.js

import Group from "../models/groupModel.js";

// ===============================
// CREATE GROUP
// ===============================
export const createGroup = async (req, res) => {
  try {
    console.log("BODY =>", req.body);
    console.log("FILE =>", req.file);

    const {
      groupName,
      description,
      category,
      currency,
      splitType,
      startDate,
      endDate,
    } = req.body || {};

    // ===============================
    // MEMBERS PARSE
    // ===============================
    let parsedMembers = [];

    if (req.body?.members) {
      try {
        parsedMembers = JSON.parse(
          req.body.members
        );
      } catch (err) {
        parsedMembers = [];
      }
    }

    // ===============================
    // IMAGE URL
    // ===============================
    let imageUrl =
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600&q=80";

    if (req.file) {
      imageUrl = `https://settleji.onrender.com/uploads/${req.file.filename}`;
    }

    // ===============================
    // VALIDATION
    // ===============================
    if (!groupName) {
      return res.status(400).json({
        success: false,
        message: "Group name is required",
      });
    }

    // ===============================
    // CREATE GROUP
    // ===============================
    const group = await Group.create({
      groupName,

      description,

      category,

      currency:
        currency || "INR",

      splitType:
        splitType || "equal",

      coverImage: imageUrl,

      members: parsedMembers,

      startDate,

      endDate,

      createdBy: req.user._id,
    });

    // ===============================
    // RESPONSE
    // ===============================
    res.status(201).json({
      success: true,
      message:
        "Group created successfully",
      group,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// FETCH ALL GROUPS
// ===============================
export const fetchGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      createdBy: req.user._id,
    }).sort({
      createdAt: -1,
    });

    const fixedGroups = groups.map((group) => {
      const obj = group.toObject();

      if (
        obj.coverImage &&
        obj.coverImage.includes(
          "http://localhost:5000"
        )
      ) {
        obj.coverImage =
          obj.coverImage.replace(
            "http://localhost:5000",
            "https://settleji.onrender.com"
          );
      }

      return obj;
    });

    res.status(200).json({
      success: true,
      total: fixedGroups.length,
      groups: fixedGroups,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// FETCH SINGLE GROUP
// ===============================
export const fetchSingleGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate(
      "createdBy",
      "name email avatar"
    );

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    res.status(200).json({
      success: true,
      group,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// UPDATE GROUP
// ===============================
export const updateGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    group.groupName = req.body.groupName || group.groupName;

    group.description = req.body.description || group.description;

    group.category = req.body.category || group.category;

    group.currency = req.body.currency || group.currency;

    group.splitType = req.body.splitType || group.splitType;

    group.startDate = req.body.startDate || group.startDate;

    group.endDate = req.body.endDate || group.endDate;

    // MEMBERS
    if (req.body.members) {
      try {
        group.members = JSON.parse(req.body.members);
      } catch (err) {
        console.log(err);
      }
    }

    // IMAGE
    if (req.file) {
      group.coverImage = req.file.path;
    }

    const updatedGroup = await group.save();

    res.status(200).json({
      success: true,
      message: "Group updated successfully",
      group: updatedGroup,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// DELETE GROUP
// ===============================
export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    await group.deleteOne();

    res.status(200).json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};