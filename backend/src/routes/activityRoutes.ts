import { Router } from "express";
import {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  enrollToActivity,
  cancelEnrollment,
  getMyActivities,
  getMyHostedActivities
} from "../controllers/activityController";
import { protect } from "../middleware/authMiddleware";
import chatRoutes from "./chatRoutes";

const router = Router();

router.get("/my", protect, getMyActivities);
router.get("/mine", protect, getMyHostedActivities);
router.get("/", getActivities);
router.get("/:id", getActivityById);

router.post("/", protect, createActivity);
router.put("/:id", protect, updateActivity);
router.delete("/:id", protect, deleteActivity);

router.post("/:id/enroll", protect, enrollToActivity);
router.post("/:id/cancel", protect, cancelEnrollment);
router.use("/:activityId/chat", chatRoutes);

export default router;
