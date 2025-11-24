import { Router } from "express";
import { getMessagesForActivity, createMessage } from "../controllers/chatController";
import { protect } from "../middleware/authMiddleware";

const router = Router({ mergeParams: true });

router.get("/", getMessagesForActivity);
router.post("/", protect, createMessage);

export default router;
