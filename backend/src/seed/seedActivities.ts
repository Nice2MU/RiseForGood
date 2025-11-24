import dotenv from "dotenv";
import mongoose from "mongoose";
import { Activity } from "../models/Activity";
import { Enrollment } from "../models/Enrollment";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/riseforgood";

const baseActivities = [
  {
    title: "เก็บขยะริมชายหาด",
    description: "ร่วมกันเก็บขยะและคัดแยกขยะริมชายหาด เพื่อฟื้นฟูระบบนิเวศทางทะเล",
    category: "environment",
    organization: "ชมรมรักษ์ทะเล",
    location: "ชายหาดสมมติ",
    province: "ชลบุรี",
    date: "2025-12-01",
    time: "09:00",
    maxVolunteers: 50,
    currentVolunteers: 10,
    status: "open",
    tags: ["ทะเล", "สิ่งแวดล้อม"],
    imageUrl: "https://images.pexels.com/photos/2614037/pexels-photo-2614037.jpeg"
  },
  {
    title: "สอนการบ้านน้อง ๆ ในชุมชน",
    description: "อาสาสมัครช่วยสอนการบ้านวิชาพื้นฐานให้เด็กประถมในชุมชน",
    category: "education",
    organization: "กลุ่มการศึกษาเพื่อทุกคน",
    location: "ศูนย์การเรียนรู้ชุมชน",
    province: "กรุงเทพมหานคร",
    date: "2025-12-03",
    time: "17:30",
    maxVolunteers: 20,
    currentVolunteers: 5,
    status: "open",
    tags: ["การศึกษา", "เด็ก"],
    imageUrl: "https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg"
  }
];

const run = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("Mongo connected for seeding");
  await Enrollment.deleteMany({});
  await Activity.deleteMany({});
  const docs: any[] = [];
  for (let i = 0; i < 40; i++) {
    const base = baseActivities[i % baseActivities.length];
    docs.push({
      ...base,
      title: base.title + " #" + (i + 1),
      date: "2025-12-" + String((i % 28) + 1).padStart(2, "0"),
      province: i % 2 === 0 ? base.province : "เชียงใหม่"
    });
  }
  await Activity.insertMany(docs);
  console.log("Seeded", docs.length, "activities");
  await mongoose.disconnect();
  console.log("Done.");
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
