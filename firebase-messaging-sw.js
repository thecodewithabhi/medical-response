// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

// ✅ Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAnGNsf7SREctRzhuaG0OXoq2mEQt2eMU4",
  authDomain: "fir-send-notification-e6a29.firebaseapp.com",
  projectId: "fir-send-notification-e6a29",
  storageBucket: "fir-send-notification-e6a29.appspot.com",
  messagingSenderId: "428899144439",
  appId: "1:428899144439:web:4be7bf84a3cbd30d90f9f2",
});

const messaging = firebase.messaging();

// ✅ Handle background notification
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message:", payload);

  const notificationTitle = payload.notification?.title || "Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    data: payload.data || {},
    icon: "/firebase-logo.png", // make sure this exists in root
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// ✅ Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification click:", event);
  event.notification.close();

  let targetUrl = event.notification?.data?.url || "/";
  let fullUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (let client of clientList) {
        if (client.url === fullUrl && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(fullUrl);
      }
    })
  );
});
