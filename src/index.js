import context, { datepickerContext } from "./context/appContext";
import store from "./context/store";


import setAppDefaults from "./config/appDefaults";
import renderViews from "./config/renderViews";

import locales from "./locales/en";
const lang = locales.labels;


import 'bootstrap';
import { Modal } from 'bootstrap'
import { Toast } from 'bootstrap'


/*!*************************************!*\
// (CSS)
/*!*************************************!*/

import 'bootstrap/dist/css/bootstrap.min.css';

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
import "./styles/alerts.css";

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

/*!*************************************!*/
setAppDefaults(context, store);
renderViews(context, datepickerContext, store);

// Setup language for alerts
const alert_connection_lost = document.getElementById("alert__connection_lost__text");
alert_connection_lost.textContent = lang.alerts.connection_lost;



if (window.Notification) {
    Notification.requestPermission((status) => {
        console.log('Status of the notification permission request:', status);
    });
}

let options;
const myModal = new Modal(document.getElementById('login_modal'), options)
myModal.hide();

// Login button
document.getElementById("login_modal__close").addEventListener("click", function () {
    myModal.hide();
});
document.getElementById("login_modal__submit").addEventListener("click", function () {
    function request_body(path, body, callback_result, method = 'POST', authed = true, callback_error = null) {
        let requestOptions = {
            method: method,
            body: body,
            redirect: 'follow',
        };

        let api_url = localStorage.getItem("api_url") || "https://api-cal.transgirl.space/api";

        try {
            fetch(api_url + path, requestOptions)
                .then(response => response.text())
                .then(result => {
                    if (authed) {
                        let json = JSON.parse(result);
                        if (json.error === "Un-Authorised!") {
                            return "Un-Authorised!"
                        }
                        callback_result(result);
                    } else {
                        callback_result(result);
                    }
                });
        } catch (e) {
            console.log(e);
        }
    }

    function login() {
        console.log("Called login");
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        let urlencoded = new URLSearchParams();
        urlencoded.append("email", email);
        urlencoded.append("password", password);
        urlencoded.append("refresh", "false");    // Prevent invalidating previous tokens

        request_body("/login", urlencoded, function (result) {
            console.log("Server events");
            let data = JSON.parse(result)["response"];

            if(data === "Un-Authenticated") {
                localStorage.setItem('user', "");

                document.getElementById('password').value = "";

                // TODO: Add notification for failed login attempts

                return;
            }
            // console.log(data);

            localStorage.setItem('user', JSON.stringify(data));

            // const overlay = document.getElementById('overlay');
            // overlay.style.display = 'none';

            myModal.hide();


        }, 'POST');
    }

    login();
});