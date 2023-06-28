import context, { datepickerContext } from "./context/appContext";
import store from "./context/store";


import setAppDefaults from "./config/appDefaults";
import renderViews from "./config/renderViews";

/*!*************************************!*\
// (CSS) 
/*!*************************************!*/

// <html>
import "./styles/root.css";
// </html>

// <header>
import "./styles/header.css";
// </header>

// <main>
import "./styles/containers.css";
import "./styles/yearview.css";
import "./styles/monthview.css";
import "./styles/weekview.css";
import "./styles/dayview.css";
import "./styles/listview.css";
import "./styles/sidebar.css";
import "./styles/sbdatepicker.css";

import "./styles/overlay_connecting.css"
// </main>

// <aside>
import "./styles/aside/datepicker.css";
import "./styles/aside/toast.css";
import "./styles/aside/goto.css";
import "./styles/aside/toggleForm.css";
import "./styles/aside/sidebarSubMenu.css";
import "./styles/aside/changeViewModule.css";
import "./styles/aside/editCategoryForm.css";
import "./styles/aside/form.css";
import "./styles/aside/timepicker.css";
import "./styles/aside/deleteCategoryPopup.css";
import "./styles/aside/entryOptions.css";
import "./styles/aside/info.css";
import "./styles/aside/shortcuts.css";
// </aside>

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}

// function showOverlay() {
//     var overlay = document.getElementById('overlay');
//     overlay.style.display = 'flex';
// }
// function hideOverlay() {
//     var overlay = document.getElementById('overlay');
//     overlay.style.display = 'none';
// }

/*!*************************************!*/
setAppDefaults(context, store);
renderViews(context, datepickerContext, store);

if (window.Notification) {
    Notification.requestPermission((status) => {
        console.log('Status of the notification permission request:', status);
    });
}
