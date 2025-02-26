import mongoose,{model} from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      title: String,
      body: String, // Ensure "body" is used consistently
      data: Object,
      isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
  );

export const Notification = model('Notification', notificationSchema);