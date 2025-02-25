import mongoose,{model} from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    description: String,
    data: Object,
    isRead: { type: Boolean, default: false }, // To track read/unread status
  },
  { timestamps: true }
);

export const Notification = model('Notification', notificationSchema);