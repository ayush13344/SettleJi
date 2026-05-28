import express from "express";

import {
  addExpense,
  getGroupExpenses
} from "../controllers/expenseController.js";

import protect  from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addExpense);

router.get("/:groupId", protect, getGroupExpenses);

export default router;