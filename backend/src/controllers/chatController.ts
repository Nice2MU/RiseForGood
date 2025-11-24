import { Request, Response } from "express";
import { Message } from "../models/Message";
import { Enrollment } from "../models/Enrollment";

export const getMessagesForActivity = async (req: Request, res: Response) => {
  try {
    const { activityId } = req.params;
    const msgs = await Message.find({ activity: activityId }).sort({ createdAt: 1 });
    res.json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load messages" });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { activityId } = req.params;
    const { text } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    if (!text) {
      return res.status(400).json({ message: "ข้อความห้ามเว้นว่าง" });
    }

    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      activity: activityId
    });
    if (!enrollment) {
      return res
        .status(403)
        .json({ message: "ต้องสมัครเข้าร่วมกิจกรรมก่อนจึงจะส่งข้อความได้" });
    }

    const msg = await Message.create({
      activity: activityId,
      user: req.user.id,
      userName: req.user.name,
      text
    });
    res.status(201).json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
};
