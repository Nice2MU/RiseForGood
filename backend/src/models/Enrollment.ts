import { Schema, model, Document, Types } from "mongoose";

export interface IEnrollment extends Document {
  user: Types.ObjectId;
  activity: Types.ObjectId;
  createdAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    activity: { type: Schema.Types.ObjectId, ref: "Activity", required: true }
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, activity: 1 }, { unique: true });

export const Enrollment = model<IEnrollment>("Enrollment", enrollmentSchema);
