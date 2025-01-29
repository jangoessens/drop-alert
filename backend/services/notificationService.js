import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function sendNotification(message) {
    try {
        await axios.post("https://onesignal.com/api/v1/notifications", {
            app_id: process.env.ONESIGNAL_APP_ID,
            contents: { en: message },
            included_segments: ["All"],
        }, {
            headers: { Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}` },
        });

        console.log("Notification sent:", message);
    } catch (error) {
        console.error("Error sending notification:", error);
    }
}
