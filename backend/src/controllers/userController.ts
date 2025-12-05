import { Request, Response } from "express";
import { User } from "../models/User";
import { Enrollment } from "../models/Enrollment";

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const user = await User.findById(req.user.id).populate("following", "name email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const followUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const targetUserId = req.params.id;
    if (req.user.id === targetUserId) {
      return res.status(400).json({ message: "ไม่สามารถติดตามตัวเองได้" });
    }

    const user = await User.findById(req.user.id);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // ถ้าติดตามแล้ว ให้ยกเลิกติดตาม (toggle)
    if (user.following.includes(targetUser._id)) {
      user.following = user.following.filter((id) => id.toString() !== targetUserId);
    } else {
      user.following.push(targetUser._id);
    }

    const updated = await user.save();
    const populated = await User.findById(updated._id).populate("following", "name email");
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to follow user" });
  }
};

export const addVolunteerPoints = async (userId: string, points: number) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { volunteerPoints: points } },
      { new: true }
    );
    return user;
  } catch (err) {
    console.error(err);
  }
};

export const getVolunteerStats = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // นับจำนวนกิจกรรมที่เข้าร่วมแล้วเสร็จ
    const completedEnrollments = await Enrollment.countDocuments({
      user: req.user.id,
      status: "completed"
    });

    // คำนวณ Level จากแต้ม (10 แต้มต่อ 1 เล็ล)
    const level = Math.floor(user.volunteerPoints / 10) + 1;
    const nextLevelPoints = level * 10;

    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      volunteerPoints: user.volunteerPoints,
      level: level,
      nextLevelPoints: nextLevelPoints,
      completedActivities: completedEnrollments,
      following: user.following.length,
      follower: user.following.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch volunteer stats" });
  }
};
