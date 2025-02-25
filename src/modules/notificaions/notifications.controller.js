import { Notification } from "../../../database/models/notification.model.js";
import { User } from "../../../database/models/user.model.js";
import { sendNotification } from "../../../public/js/firebase.js";
import { catchError } from "../../middleware/catchError.js";


const notifyAllDrivers = async (req, res, next) => {
    const { title, description } = req.body;
    try {
        const drivers = await User.find({ role: "driver", fcmToken: { $ne: "" } });

        // Send notification & store it for each driver
        const notifications = drivers.map(driver => ({
            userId: driver._id,
            title,
            description,
        }));

        // Send notifications via FCM
        drivers.forEach(driver => sendNotification(driver.fcmToken, title, description));

        // Store notifications in MongoDB
        await Notification.insertMany(notifications);

        res.status(200).json({ message: "Notifications sent to all drivers" });
    } catch (error) {
        next(error);
    }
};

// Send Notification to All Clients & Store in Database
const notifyAllClients = async (req, res, next) => {
    const { title, description } = req.body;
    try {
        const clients = await User.find({ role: "client", fcmToken: { $ne: "" } });

        // Send notification & store it for each client
        const notifications = clients.map(client => ({
            userId: client._id,
            title,
            description,
        }));

        clients.forEach(client => sendNotification(client.fcmToken, title, description));

        // Store notifications in MongoDB
        await Notification.insertMany(notifications);

        res.status(200).json({ message: "Notifications sent to all clients" });
    } catch (error) {
        next(error);
    }
};

//Send Notification to Specific User & Store in Database
const notifyUser = async (req, res, next) => {
    const { userId } = req.params;
    const { title, description } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user || !user.fcmToken) return res.status(404).json({ message: "User not found or no FCM token" });

        await sendNotification(user.fcmToken, title, description);

        // Store notification in MongoDB
        await Notification.create({ userId, title, description });

        res.status(200).json({ message: "Notification sent successfully" });
    } catch (error) {
        next(error);
    }
};


const getNotifications =catchError(async (req, res, next) => {
    const { userId } = req.params;
    
    // Fetch notifications for the user
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({ message: "success", status:200,data:{notifications} });
    
});


export {
    notifyAllDrivers,
    notifyAllClients,
    notifyUser,
    getNotifications
}