import Settlement from "../models/Settlement.js";
import Expense from "../models/Expense.js";
import Activity from "../models/Activity.js";
import Group from "../models/groupModel.js";

/* ─────────────────────────────────────────────
   Create Settlement
───────────────────────────────────────────── */
const createSettlement = async (req, res) => {
  try {
    const { group, fromUser, toUser, amount } = req.body;

    if (!group || !fromUser || !toUser || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const settlement = await Settlement.create({ group, fromUser, toUser, amount });

    res.status(201).json({ success: true, settlement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────────
   Get All Settlements of Group
───────────────────────────────────────────── */
const getGroupSettlements = async (req, res) => {
  try {
    const settlements = await Settlement.find({ group: req.params.groupId })
      .sort({ createdAt: -1 });
    res.json(settlements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────────
   Delete Settlement
───────────────────────────────────────────── */
const deleteSettlement = async (req, res) => {
  try {
    const settlement = await Settlement.findById(req.params.id);
    if (!settlement) {
      return res.status(404).json({ message: "Settlement not found" });
    }
    await settlement.deleteOne();
    res.json({ success: true, message: "Settlement deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────────
   Calculate Balances

   Root cause: group members have { name, initials, color }
   with _id:false — no IDs at all. Expenses store paidBy
   and participants as member NAMES (strings), not ObjectIds.

   Fix: use name as the key for balance tracking.
───────────────────────────────────────────── */
const calculateBalances = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    // fetch expenses — no populate needed, paidBy is a name string
    const expenses = await Expense.find({ group: groupId });

    // fetch settlements
    const settlements = await Settlement.find({ group: groupId });

    console.log("Expenses:", expenses.length);
    expenses.forEach(e => {
      console.log("title:", e.title, "| amount:", e.amount, "| paidBy:", e.paidBy);
      console.log("participants:", JSON.stringify(e.participants));
    });

    // balance map: name (string) → balance number
    const balanceMap = {};

    const ensure = (name) => {
      if (name && !balanceMap[name]) balanceMap[name] = 0;
    };

    for (const expense of expenses) {
      // paidBy stored as name string
      const payerName = expense.paidBy;
      if (!payerName) continue;

      ensure(payerName);
      // payer gets full credit
      balanceMap[payerName] += expense.amount;

      for (const p of expense.participants || []) {
        // participant name stored in p.user (as string) or p.name
        const pName = p.user || p.name;
        const share = p.share ?? p.amount ?? 0;
        if (!pName) continue;

        ensure(pName);
        balanceMap[pName] -= share;
      }
    }

    console.log("Balance map after expenses:", balanceMap);

    // apply already-settled payments
    for (const s of settlements) {
      const fromName = s.fromUser; // stored as name string
      const toName   = s.toUser;

      if (!fromName || !toName) continue;

      ensure(fromName);
      ensure(toName);

      balanceMap[fromName] += s.amount;  // debt reduced
      balanceMap[toName]   -= s.amount;  // credit reduced
    }

    console.log("Balance map after settlements:", balanceMap);

    // convert to array, filter near-zero
    const balancesArray = Object.entries(balanceMap)
      .filter(([_, bal]) => Math.abs(Math.round(bal)) >= 1)
      .map(([name, bal]) => ({
        user:    name,
        amount:  Math.abs(Math.round(bal)),
        type:    bal > 0 ? "receive" : "pay",
        settled: false,
      }));

    const totalSettled = settlements.reduce((a, s) => a + s.amount, 0);

    console.log("Final balances:", balancesArray);

    res.json({ balances: balancesArray, totalSettled });
  } catch (error) {
    console.log("calculateBalances error:", error);
    res.status(500).json({ message: error.message });
  }
};

export {
  createSettlement,
  getGroupSettlements,
  deleteSettlement,
  calculateBalances,
};