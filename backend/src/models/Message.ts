import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
  activity: Types.ObjectId;
  user: Types.ObjectId | null;
  userName: string;
  text: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    activity: { type: Schema.Types.ObjectId, ref: "Activity", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    userName: { type: String, required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

export const Message = model<IMessage>("Message", messageSchema);
