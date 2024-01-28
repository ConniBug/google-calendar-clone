import context, { datepickerContext } from "./context/appContext";
import store from "./context/store";

import { createAuth0Client } from '@auth0/auth0-spa-js';
let auth0Client = null;
const configureClient = async () => {
    const config = {
        "domain": "transgirl.uk.auth0.com",
        "clientId": "FEiayN3D6JgRuTrsz3IoaApQcrDFEjz3"
    };

    auth0Client = await createAuth0Client({
        domain: config.domain,
        clientId: config.clientId
    });
};
window.onload = async () => {
    await configureClient();
    updateUI();
}

const updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    const query = window.location.search;

    if(query.includes("action=")) {
        const action = query.split("action=")[1].split("&")[0];
        console.log(action);

        if(action === "login") {
            login();
        }
        if(action === "logout") {
            logout();
        }
    }

    console.log("isAuthenticated", isAuthenticated);
    if(isAuthenticated) {
        const user = await auth0Client.getUser();
        console.log("user", user);
        user.id = user.app_meta.uuid;
        this.user.token = await auth0Client.getTokenSilently();

        console.log("user + token", user);

        localStorage.setItem('user', JSON.stringify(user));
        return;
    }

    if (query.includes("code=") && query.includes("state=")) {
        console.log("Called handleRedirectCallback");
        console.log(query);

        await auth0Client.handleRedirectCallback();

        updateUI();

        // Use replaceState to redirect the user away and remove the querystring parameters
        window.history.replaceState({}, document.title, "/");
    } else {
        login();
    }
};

const login = async () => {
    await auth0Client.loginWithRedirect({
        authorizationParams: {
            redirect_uri: window.location.origin
        }
    });
};
const logout = () => {
    auth0Client.logout({
        logoutParams: {
            returnTo: window.location.origin
        }
    });
};

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
