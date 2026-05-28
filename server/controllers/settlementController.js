import Settlement from "../models/Settlement.js";
import Expense from "../models/Expense.js";
import Activity from "../models/Activity.js";

/* ─────────────────────────────────────────────
   Create Settlement
───────────────────────────────────────────── */

const createSettlement = async (req, res) => {
  try {
    const {
      group,
      fromUser,
      toUser,
      amount
    } = req.body;

    if (!group || !fromUser || !toUser || !amount) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const settlement = await Settlement.create({
      group,
      fromUser,
      toUser,
      amount
    });

    /* Add activity */
    await Activity.create({
      group,
      user: fromUser,
      action: `settled ₹${amount} with user`
    });

    res.status(201).json({
      success: true,
      settlement
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ─────────────────────────────────────────────
   Get All Settlements of Group
───────────────────────────────────────────── */

const getGroupSettlements = async (req, res) => {
  try {
    const settlements = await Settlement.find({
      group: req.params.groupId
    })
      .populate("fromUser", "name avatar")
      .populate("toUser", "name avatar")
      .sort({ createdAt: -1 });

    res.json(settlements);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ─────────────────────────────────────────────
   Delete Settlement
───────────────────────────────────────────── */

const deleteSettlement = async (req, res) => {
  try {
    const settlement = await Settlement.findById(req.params.id);

    if (!settlement) {
      return res.status(404).json({
        message: "Settlement not found"
      });
    }

    await settlement.deleteOne();

    res.json({
      success: true,
      message: "Settlement deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ─────────────────────────────────────────────
   Calculate Balances
───────────────────────────────────────────── */

const calculateBalances = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const expenses = await Expense.find({
      group: groupId
    })
      .populate("paidBy", "name")
      .populate("participants.user", "name");

    let balances = {};

    /* Initialize users */
    expenses.forEach((expense) => {

      const payerId = expense.paidBy._id.toString();

      if (!balances[payerId]) {
        balances[payerId] = {
          name: expense.paidBy.name,
          balance: 0
        };
      }

      /* Add amount paid */
      balances[payerId].balance += expense.amount;

      /* Subtract participant shares */
      expense.participants.forEach((participant) => {

        const participantId = participant.user._id.toString();

        if (!balances[participantId]) {
          balances[participantId] = {
            name: participant.user.name,
            balance: 0
          };
        }

        balances[participantId].balance -= participant.share;
      });
    });

    res.json(balances);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export {
  createSettlement,
  getGroupSettlements,
  deleteSettlement,
  calculateBalances
};