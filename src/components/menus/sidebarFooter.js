import { getClosest } from "../../utilities/helpers";

const sidebarFooter = document.querySelector(".sb__info");

// popup containing : project notes, privacy policy, & terms of use
const sbInfoPopup = document.querySelector(".sb__info-popup");
const sbInfoPopupOverlay = document.querySelector(".sb__info-popup-overlay");
const selectInfo = document.querySelector(".select-popup-info");
const closePopupButton = document.querySelector(".close-sb-info");
const infopopupTitle = document.querySelector(".sbip-title");
const infopopupBody = document.querySelector(".sbip-content");


export default function handleSidebarFooter(store) {
  const style = `
<style>
.changelog {
    margin-bottom: 1rem;
}
.changelog__version {
    margin-bottom: 0.5rem;
}
.changelog__version-title {
    margin-bottom: 0.25rem;
    font-size: 1.25rem;
    font-weight: 600;
}
.changelog__version-date {
    font-size: 0.75rem;
    font-weight: 300;
}
.changelog__description {
    margin-bottom: 0.5rem;
}
.changelog__changes {
    margin-bottom: 0.5rem;
}
.changelog__changes ul {
    margin-left: 1rem;
}
.changelog__changes ul li {
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
    font-weight: 300;
}
</style>
`;
  const log = [
    {
        version: "0.1.0",
        date: "August 24, 2023",
        description: "UI Improvements, 24hr time and offline support",
        changes: [
            "Redesigned the login page to be more user friendly",
            "Users are now able to user the calendar without an internet connection",
            "Added support for the UI to display times in 24hr format",
            "Added alerts to notify the user when connection to the servers are lost",
            "Bugfix - The server would not sync changes to the calander an event is in",
            "Bug fix - Tokens were invalidated when logging in on a new device or browser",
            "Bugfix - Incorrect login attempts where not made obvious to the user",
        ]
    },
    {
        version: "0.0.0",
        date: "July 7, 2023",
        description: "Added changelog :D",
        changes: [
            "Added changelog :D",
            "Added iCal GET/DELETE backend, additionally added a simple frontend for temporary use",
            "Added SSL to the websocket",
            "Added webhook events for calendar creation and deletion",
            "Fixed issues with websockets CORS policies",
        ]
    }
  ]
  let data = "";
  for (let i = 0; i < log.length; i++) {
    data += `
    <div class="changelog">
      <div class="changelog__version">
        <h3 class="changelog__version-title">${log[i].version}</h3>
        <p class="changelog__version-date">${log[i].date}</p>
      </div>
      <div class="changelog__description">
        <p>${log[i].description}</p>
      </div>
      <div class="changelog__changes">
        <ul>
    `;
    for (let j = 0; j < log[i].changes.length; j++)
        data += `<li>${log[i].changes[j]}</li>`;

    data += `</ul></div></div>`;
  }
  const infoContent = {
    changelog: {
      title: "Project Changelog",
      content: `${style}<div class="container">${data}</div>`
    },
    privacy: {
      title: "Cookies and Data Privacy",
      content: "This project uses an open source license",
    },
    terms: {
      title: "Code license and terms of use",
      content: "All data is stored locally meaning no data is sent to a server."
    },
  };

  function closeInfoPopup() {
    store.removeActiveOverlay("hide-sb-info-popup");
    sbInfoPopup.classList.add("hide-sb-info-popup");
    sbInfoPopupOverlay.classList.add("hide-sb-info-popup");
    document.removeEventListener("keydown", closeInfoPopupOnEscape);
    sbInfoPopupOverlay.onclick = null;
    closePopupButton.onclick = null;
  }

  function setInfoContent(selection) {
    infopopupTitle.innerText = infoContent[selection].title;
    infopopupBody.innerHTML = infoContent[selection].content;
  }

  function handleSelectInfoChange(e) {
    const selection = e.target.value;
    setInfoContent(selection);
  }

  function closeInfoPopupOnEscape(e) {
    if (e.key === "Escape") {
      closeInfoPopup();
    }
  }

  function setUpInfoPopup() {
    setInfoContent(selectInfo.value);
    selectInfo.onchange = handleSelectInfoChange;
    sbInfoPopupOverlay.onclick = closeInfoPopup;
    closePopupButton.onclick = closeInfoPopup;
    document.addEventListener("keydown", closeInfoPopupOnEscape);
  }

  function openInfoPopup(selection) {
    const selections = ['changelog', 'privacy', 'terms'];
    const idx = selections.indexOf(selection);
    selectInfo.selectedIndex = idx;

    store.addActiveOverlay("hide-sb-info-popup");
    sbInfoPopup.classList.remove("hide-sb-info-popup");
    sbInfoPopupOverlay.classList.remove("hide-sb-info-popup");
    setUpInfoPopup();
  }

  function delegateSidebarFooterEvents(e) {
    const projectChangelog = getClosest(e, ".sb__project-changelog");
    const privacy = getClosest(e, ".sb__privacy");
    const terms = getClosest(e, ".sb__terms");

    if (projectChangelog) {
      openInfoPopup("changelog");
      return;
    }

    if (privacy) {
      openInfoPopup("privacy");
      return;
    }

    if (terms) {
      openInfoPopup("terms");
      return;
    }
  }

  sidebarFooter.onmousedown = delegateSidebarFooterEvents;
}