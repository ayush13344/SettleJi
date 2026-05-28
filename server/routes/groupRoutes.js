import express from "express";

import protect from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

import {
  createGroup,
  fetchGroups,
  fetchSingleGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/groupController.js";

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    upload.single("coverImage"),
    createGroup
  )
  .get(protect, fetchGroups);

router
  .route("/:id")
  .get(protect, fetchSingleGroup)
  .put(
    protect,
    upload.single("coverImage"),
    updateGroup
  )
  .delete(protect, deleteGroup);

export default router;