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
import dotenv from 'dotenv';
dotenv.config();
const serviceAccountJson = Buffer.from(process.env.FIREBASE_CREDENTIALS_BASE64, "base64").toString("utf-8");
const serviceAccount = JSON.parse(serviceAccountJson);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
// Convert import.meta.url to __dirname equivalent
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// // Correct the path to your JSON file
// const serviceAccountPath = path.join(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS);

// if (!fs.existsSync(serviceAccountPath)) {
//   console.error(`Firebase service account file not found at: ${serviceAccountPath}`);
//   process.exit(1); // Stop execution if the file is missing
// }

// // Read and parse the JSON file
// const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

const sendNotification = async (fcmToken, title, body) => {
  const message = {
      token: fcmToken,
      notification: { title, body },
  };

  try {
      await admin.messaging().send(message);
      console.log("Notification sent successfully to:", fcmToken);
      return true; // Successfully sent
  } catch (error) {
      console.error("Error sending notification:", error);

      if (error.code === "messaging/invalid-argument") {
          console.warn("Invalid FCM token detected:", fcmToken);
          return false; // Invalid token
      }

      throw error; // Re-throw other errors
  }
};

const validateFCMToken = async (fcmToken) => {
  try {
    //   await admin.messaging().send({ token: fcmToken, notification: { title: "Test", body: "Checking token" } });
      return true; // Valid token
  } catch (error) {
      if (error.code === "messaging/invalid-argument") {
          console.error("Invalid FCM token:", fcmToken);
          return false;
      }
      throw error; // Re-throw other errors
  }
};


export { sendNotification ,validateFCMToken };
