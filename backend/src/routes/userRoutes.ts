import { Router } from "express";
import {
  getProfile,
  followUser,
  getVolunteerStats
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/profile", protect, getProfile);
router.get("/stats", protect, getVolunteerStats);
router.post("/:id/follow", protect, followUser);

export default router;
