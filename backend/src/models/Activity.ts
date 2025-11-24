import { Schema, model, Document, Types } from "mongoose";

export type Category = "environment" | "education" | "health" | "community" | "others";
export type Status = "open" | "closed";

export interface IActivity extends Document {
  title: string;
  description: string;
  category: Category;
  organization: string;
  location: string;
  province: string;
  date: string;
  time: string;
  maxVolunteers: number;
  currentVolunteers: number;
  status: Status;
  tags: string[];
  imageUrl?: string;
  createdBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["environment", "education", "health", "community", "others"],
      default: "others"
    },
    organization: { type: String, required: true },
    location: { type: String, required: true },
    province: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    maxVolunteers: { type: Number, default: 20 },
    currentVolunteers: { type: Number, default: 0 },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    tags: [{ type: String }],
    imageUrl: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

export const Activity = model<IActivity>("Activity", activitySchema);
