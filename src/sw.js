import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';

precacheAndRoute(self.__WB_MANIFEST);

navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification("Afternoon", {
        body: "Test beep beep",
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        tag: "vibration-sample",
    });
});
