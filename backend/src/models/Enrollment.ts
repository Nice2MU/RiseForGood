import { Schema, model, Document, Types } from "mongoose";

export interface IEnrollment extends Document {
  user: Types.ObjectId;
  activity: Types.ObjectId;
  status: "enrolled" | "cancelled" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    activity: { type: Schema.Types.ObjectId, ref: "Activity", required: true },
    status: { type: String, enum: ["enrolled", "cancelled", "completed"], default: "enrolled" }
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, activity: 1 }, { unique: true });

export const Enrollment = model<IEnrollment>("Enrollment", enrollmentSchema);
