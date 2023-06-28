import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';

precacheAndRoute(self.__WB_MANIFEST);

var title = 'Yay a message.';
var body = 'A message.';
var icon = '/images/icon-192x192.png';
var tag = 'tag';

async function init() {
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        console.warn('Notifications aren\'t supported.');
        return;
    }
    if (Notification.permission === 'denied') {
        console.warn('The user has blocked notifications.');
        return;
    }
    // if (!('PushManager' in window)) {
    //     console.warn('Push messaging isn\'t supported.');
    //     return;
    // }

    const registration = await navigator.serviceWorker.getRegistration();
    registration.showNotification(title, {
        body: body,
        icon: icon,
        tag: tag
    });

}

init();
