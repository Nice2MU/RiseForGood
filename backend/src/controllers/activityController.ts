import { Request, Response } from "express";
import { Activity } from "../models/Activity";
import { Enrollment } from "../models/Enrollment";

export const getActivities = async (req: Request, res: Response) => {
  try {
    const { q, category, status } = req.query;
    const filter: any = {};
    if (q) filter.title = { $regex: q as string, $options: "i" };
    if (category) filter.category = category;
    if (status) filter.status = status;
    const activities = await Activity.find(filter).sort({ date: 1 });
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};

export const getActivityById = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch activity" });
  }
};

export const createActivity = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (req.user) data.createdBy = req.user.id;
    const activity = await Activity.create(data);
    res.status(201).json(activity);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create activity" });
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    if (req.user && req.user.role !== "admin") {
      if (activity.createdBy && activity.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "คุณไม่มีสิทธิ์แก้ไขกิจกรรมนี้" });
      }
    }

    Object.assign(activity, req.body);
    const saved = await activity.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to update activity" });
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    if (req.user && req.user.role !== "admin") {
      if (activity.createdBy && activity.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "คุณไม่มีสิทธิ์ลบกิจกรรมนี้" });
      }
    }

    await Enrollment.deleteMany({ activity: activity._id });
    await activity.deleteOne();
    res.json({ message: "Activity deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete activity" });
  }
};

export const enrollToActivity = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    const existing = await Enrollment.findOne({
      user: req.user.id,
      activity: activity._id,
      status: "enrolled"
    });
    if (existing) {
      return res.status(400).json({ message: "คุณสมัครกิจกรรมนี้แล้ว" });
    }

    if (activity.currentVolunteers >= activity.maxVolunteers) {
      return res.status(400).json({ message: "จำนวนอาสาเต็มแล้ว" });
    }

    // ถ้ามี enrollment เก่าที่ยกเลิก ให้ลบและสร้างใหม่
    await Enrollment.deleteMany({
      user: req.user.id,
      activity: activity._id,
      status: "cancelled"
    });

    await Enrollment.create({
      user: req.user.id,
      activity: activity._id,
      status: "enrolled"
    });

    activity.currentVolunteers += 1;
    await activity.save();

    res.status(201).json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "ไม่สามารถสมัครกิจกรรมได้" });
  }
};

export const cancelEnrollment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const activityId = req.params.id;
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      activity: activityId
    });

    if (!enrollment) {
      return res.status(404).json({ message: "ไม่พบการสมัครนี้" });
    }

    if (enrollment.status === "cancelled") {
      return res.status(400).json({ message: "ยกเลิกการสมัครแล้ว" });
    }

    enrollment.status = "cancelled";
    await enrollment.save();

    const activity = await Activity.findById(activityId);
    if (activity && activity.currentVolunteers > 0) {
      activity.currentVolunteers -= 1;
      await activity.save();
    }

    res.json({ message: "ยกเลิกการสมัครสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "ไม่สามารถยกเลิกการสมัครได้" });
  }
};

export const getMyActivities = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const enrollments = await Enrollment.find({ 
      user: req.user.id,
      status: { $ne: "cancelled" }
    }).populate("activity");
    const activities = enrollments
      .map((e: any) => e.activity)
      .filter((a: any) => !!a);
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch my activities" });
  }
};

export const getMyHostedActivities = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const activities = await Activity.find({ createdBy: req.user.id }).sort({ date: 1 });
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch my hosted activities" });
  }
};
