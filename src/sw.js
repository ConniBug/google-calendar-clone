import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', event => {
    const options = {
        body: event.data.text(),
        // icon: 'path-to-notification-icon.png', // Path to your notification icon
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1',
        },
    };

    event.waitUntil(
        self.registration.showNotification('Test title', options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
});
