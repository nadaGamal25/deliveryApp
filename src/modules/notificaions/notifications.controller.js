import { Notification } from "../../../database/models/notification.model.js";
import { User } from "../../../database/models/user.model.js";
import { sendNotification, validateFCMToken } from "../../../public/js/firebase.js";
import { catchError } from "../../middleware/catchError.js";

const notifyAllDrivers = async (req, res, next) => {
    const { title, body } = req.body;
    const from=req.user._id

    try {
        const drivers = await User.find({ role: "driver", fcmToken: { $ne: "" } });

        if (drivers.length === 0) {
            return res.status(404).json({ message: "No drivers found" });
        }

        let successfulNotifications = [];

        for (const driver of drivers) {
            const isValid = await validateFCMToken(driver.fcmToken);
            if (isValid) {
                const sent = await sendNotification(driver.fcmToken, title, body);
                if (sent) {
                    successfulNotifications.push({ userId: driver._id, title, body, from });
                }
            } else {
                console.warn(`Skipping invalid FCM token for driver: ${driver._id}`);
            }
        }
        if (successfulNotifications.length > 0) {
            const msg = await Notification.insertMany(successfulNotifications);
            await Notification.updateMany(
                { _id: { $in: msg.map((m) => m._id) } },
                { $set: { type: 'admin' } }
            );
        }        

        res.status(200).json({
            message: `Notifications sent to ${successfulNotifications.length} drivers`,
            totalDrivers: drivers.length,
            successful: successfulNotifications.length,
            failed: drivers.length - successfulNotifications.length,
        });

    } catch (error) {
        next(error);
    }
};

//  Send Notification to All Clients & Store in Database
const notifyAllClients = async (req, res, next) => {
    const { title, body } = req.body;
    const from=req.user._id

    try {
        const clients = await User.find({ role: "client", fcmToken: { $ne: "" } });

        if (!clients || clients.length === 0) {
            return res.status(404).json({ message: "No clients found" });
        }

        let successfulNotifications = [];

        for (const client of clients) {
            const isValid = await validateFCMToken(client.fcmToken);
            if (isValid) {
                const sent = await sendNotification(client.fcmToken, title, body);
                if (sent) {
                    successfulNotifications.push({
                        userId: client._id,
                        title,
                        body,
                        from
                    });
                }
            } else {
                console.warn(`Skipping invalid FCM token for user: ${client._id}`);
            }
        }

        if (successfulNotifications.length > 0) {
            const msg = await Notification.insertMany(successfulNotifications);
            await Notification.updateMany(
                { _id: { $in: msg.map((m) => m._id) } },
                { $set: { type: 'admin' } }
            );
        }
        
        res.status(200).json({
            message: `Notifications sent to ${successfulNotifications.length} clients`,
            totalClients: clients.length,
            successful: successfulNotifications.length,
            failed: clients.length - successfulNotifications.length,
        });

    } catch (error) {
        next(error);
    }
};


//  Send Notification to Specific User & Store in Database
const notifyUser = async (req, res, next) => {
    const { userId } = req.params;
    const { title, body } = req.body;
    const from=req.user._id
    try {
        const user = await User.findById(userId);
        if (!user || !user.fcmToken) return res.status(404).json({ message: "User not found or no FCM token" });

        const isValid = await validateFCMToken(user.fcmToken);
        if (!isValid) {
            console.warn(`Invalid FCM token for user: ${userId}`);
            return res.status(400).json({ message: "Invalid FCM token" });
        }

        const sent = await sendNotification(user.fcmToken, title, body);
        if (!sent) return res.status(500).json({ message: "Failed to send notification" });

        const msg=  await Notification.create({ userId, title, body,from });
            await Notification.updateOne({ _id: msg._id }, { $set: { type: 'admin' } }, { new: true });

        res.status(200).json({ message: "Notification sent successfully" });

    } catch (error) {
        next(error);
    }
};



const getNotifications =catchError(async (req, res, next) => {
    const { userId } = req.params;
    
    // Fetch notifications for the user
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 })
    .populate({
        path: 'from',
        select: 'name profileImg' 
    })

        res.status(200).json({ message: "success", status:200,data:{notifications} });
    
});


export {
    notifyAllDrivers,
    notifyAllClients,
    notifyUser,
    getNotifications
}