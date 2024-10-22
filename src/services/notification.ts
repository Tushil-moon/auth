import admin from "firebase-admin"; // Import the initialized admin instance
import { getMessaging } from "firebase-admin/messaging";
import { sendResponse } from "../utils/responseFormatter";
// Function to send notifications
export const sendNotification = (req: any, res: any) => {
  const data = req.body; // Fcm token received by front end application
console.log(data)
  if(!data){
    sendResponse(res,{
      status:400,
      message:"provide correct data",
      data:''
    })
  }
  const message = {
    notification: {
      title: data.notification.title,
      body: data.notification.body,
    },
    webpush: {
      notification: {
        icon: data.notification.icon, // Set the icon for web notifications
      },
    },
    token: data.to, // FCM token from client-side
  };
  getMessaging().send(message).then((response) => {
      console.log("Notification Sent");
      sendResponse(res,{
        status:200,
        message:'notification sent',
        data:''
      })
    }).catch((error) => {
      console.log("Error sending message:", error);
    });
};
