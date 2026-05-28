import mongoose from "mongoose";
import Expense from "../models/Expense.js";
import Group from "../models/groupModel.js";

const addExpense = async (req, res) => {
  try {
    const {
      group,
      title,
      amount,
      category,
      paidBy,
      participants,
      notes,
    } = req.body;

    // Validate group id
    if (!group) {
      return res.status(400).json({
        success: false,
        message: "Group ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(group)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Group ID",
      });
    }

    const expense = await Expense.create({
      group,
      title,
      amount,
      category,
      paidBy,
      participants,
      notes,
    });

    await Group.findByIdAndUpdate(group, {
      $inc: {
        totalExpense: amount,
      },
    });

    res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getGroupExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      group: req.params.groupId,
    })
      .populate("paidBy", "name avatar")
      .populate("participants.user", "name avatar");

    res.json(expenses);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  addExpense,
  getGroupExpenses,
};