// import admin from "firebase-admin";
// import path from "path";
// import { fileURLToPath } from "url";

// // Convert __dirname to work with ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Initialize Firebase Admin SDK
// const serviceAccount = await import(path.join(__dirname, "public/json/foriraapp-406c0-46705e1df39c.json"), { assert: { type: "json" } });

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount.default)
// });
import admin from "firebase-admin";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

// Convert import.meta.url to __dirname equivalent
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Correct the path to your JSON file
const serviceAccountPath = path.join(__dirname, "../json/foriraapp-406c0-46705e1df39c.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`Firebase service account file not found at: ${serviceAccountPath}`);
  process.exit(1); // Stop execution if the file is missing
}

// Read and parse the JSON file
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sendNotification = async (fcmToken, title, description) => {
    const message = {
        token: fcmToken,
        notification: {
            title,
            description
        }
    };

    try {
        await admin.messaging().send(message);
        console.log("Notification sent successfully");
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};

export { sendNotification };
