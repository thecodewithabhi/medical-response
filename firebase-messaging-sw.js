// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

// ✅ Initialize Firebase (same config as index.html)
firebase.initializeApp({
  apiKey: "AIzaSyAnGNsf7SREctRzhuaG0OXoq2mEQt2eMU4",
  authDomain: "fir-send-notification-e6a29.firebaseapp.com",
  projectId: "fir-send-notification-e6a29",
  storageBucket: "fir-send-notification-e6a29.appspot.com",
  messagingSenderId: "428899144439",
  appId: "1:428899144439:web:4be7bf84a3cbd30d90f9f2",
});

// Retrieve Firebase Messaging
const messaging = firebase.messaging();

// ✅ Handle background notification
messaging.onBackgroundMessage(function (payload) {
  console.log("[SW] Background message:", payload);

  const notificationTitle = payload.notification?.title || "Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    data: payload.data || {}, // 👈 attach data for click event
    icon: "/firebase-logo.png",
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// ✅ Handle click on notification
self.addEventListener("notificationclick", function (event) {
  console.log("[SW] Notification click:", event);
  event.notification.close();

  let targetUrl = event.notification?.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (let client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
