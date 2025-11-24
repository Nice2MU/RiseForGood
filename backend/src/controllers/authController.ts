import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const genToken = (id: string, name: string, role: string) => {
  const secret = process.env.JWT_SECRET || "riseforgood-secret";
  return jwt.sign({ id, name, role }, secret, { expiresIn: "7d" });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "กรุณากรอกชื่อ อีเมล และรหัสผ่านครบถ้วน" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "อีเมลนี้มีผู้ใช้แล้ว" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashed, role: "user" });
    const token = genToken(user.id, user.name, user.role);
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "ไม่สามารถลงทะเบียนได้" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }
    const token = genToken(user.id, user.name, user.role);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "ไม่สามารถเข้าสู่ระบบได้" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "ไม่พบข้อมูลผู้ใช้" });
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลผู้ใช้ได้" });
  }
};
