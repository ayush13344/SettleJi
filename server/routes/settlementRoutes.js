import express from "express";

import {
  createSettlement,
  getGroupSettlements,
  deleteSettlement,
  calculateBalances
} from "../controllers/settlementController.js";

import  protect  from "../middleware/authMiddleware.js";

const router = express.Router();

/* Create Settlement */
router.post("/", protect, createSettlement);

router.get("/balances/:groupId", protect, calculateBalances);

router.get("/:groupId", protect, getGroupSettlements);

/* Delete Settlement */
router.delete("/:id", protect, deleteSettlement);

export default router;