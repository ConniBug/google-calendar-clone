import Entry from "../factory/entries";
import localStoreKeyNames from "./constants";
import {compareDates, testDate} from "../utilities/dateutils";
import locales from "../locales/en";
import l from "../utilities/logging";
import defautlKeyboardShortcuts from "../locales/kbDefault";
import renderViews from "../config/renderViews";
import context, {datepickerContext} from "./appContext";
const colors = locales.colors;
/*
  this is a temporary list of store methods for development purposes, it is not a complete list of methods



  ***************************************
  // ENTRY MANAGEMENT
  "addEntry",
  "createEntry",
  "deleteEntry",
  "getActiveEntries",
  "getEntry",
  "getEntries",
  "removeLastEntry",
  "updateEntry",
  "searchBy",
  "sortBy",
  "getFirstAndLastEntry",
  "generateCoordinates",
  "getDayEntries",
  "getDayEntriesArray",
  "getMonthEntries",
  "getMonthEntryDates",
  "getGroupedMonthEntries",
  "getWeekEntries",
  "getYearEntries",
  "getGroupedYearEntries",
  ***************************************


  ***************************************
  // CATEGORY MANAGEMENT
  "addNewCtg",
  "deleteCategory",
  "getDefaultCtg",
  "getFirstActiveCategory",
  "getFirstActiveCategoryKeyPair",
  "getActiveCategories",
  "getActiveCategoriesKeyPair",
  "getAllCtg",
  "getAllCtgColors",
  "getAllCtgNames",
  "getCategoryStatus",
  "getCtgColor",
  "getCtgLength",
  "hasCtg",
  "moveCategoryEntriesToNewCategory",
  "removeCategoryAndEntries",
  "setCategoryStatus",
  "setAllCategoryStatusExcept",
  "updateCtgColor",
  "updateCtg"
  ***************************************


  ***************************************
  // KEYBOARD SHORTCUT MANAGEMENT
  "getShortcuts",
  "setShortCut",
  "setShortcutsStatus",
  "getShortcutsStatus",
  ***************************************

  ***************************************
  // ANIMATION MANAGEMENT
  "setAnimationStatus",
  "getAnimationStatus"
  ***************************************


  ***************************************
  // POPUP/TOAST/NOTIFICATION MANAGEMENT
  "addActiveOverlay",
  "removeActiveOverlay",
  "getActiveOverlay",
  "hasActiveOverlay",
  ***************************************


  ***************************************
  // USER UPLOAD/DOWNLOAD MANAGEMNET
  "validateUserUpload",
  "setUserUpload",
  "setDataReconfigCallback",
  "getUserUpload",
  "getDataReconfigCallback",
  ***************************************


  ***************************************
  // FORM MANAGEMENT 
  "setFormRenderHandle",
  "getFormRenderHandle",

  "setFormResetHandle",
  "getFormResetHandle",

  "setRenderFormCallback",
  "getRenderFormCallback",
  ***************************************


  ***************************************
  // SIDEBAR MANAGEMENT
  "setRenderSidebarCallback",
  "getRenderSidebarCallback"
  ***************************************


  ***************************************
  // DATEPICKER MANAGEMENT
  "setResetDatepickerCallback",
  "getResetDatepickerCallback",
  ***************************************


  ***************************************
  // CALENDAR MANAGEMENT
  "setResizeHandle",
  "getResizeHandle",
  ***************************************
]
*/
// Store is passed to all calendar views in the following order :
// ./index > ./renderViews > ./setViews > component

// const api_url = "https://api-cal.transgirl.space/api";
// const user = {
//   id: "7065257507584753665",
//   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNZW1iZXJJRCI6IjcwNjUyNTc1MDc1ODQ3NTM2NjUiLCJpYXQiOjE2ODY3Nzg0MTgsImV4cCI6MTY4NzM4MzIxOH0.r7zbA9z5qugRO5ulTEeHI2FYhNvO7Qa_Th-cezFxWKs",
// }

// class Session {
function request_get(path, callback_result, authed = true, callback_error = null) {
    let requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    if(authed)
      requestOptions.headers = {authorization: `Bearer ${this.user.token}`};

    try {
      return fetch(this.api_url + path, requestOptions)
          .then(response => response.text())
          .then(result => {
            if(authed) {
              let json = JSON.parse(result);
              if(json.error === "Un-Authorised!") {
                const login_container = document.getElementById('login_page-container');
                login_container.style.display = 'block';

                return "Un-Authorised!"
              }
              callback_result.call(this, result);
              return result;
            } else {
              callback_result.call(this, result);
              return result;
            }
          });
    } catch (e) {
      console.log(e);
    }
  }
function request_body(path, body, callback_result, method = 'POST', authed = true, callback_error = null) {
    let requestOptions = {
      method: method,
      body: body,
      redirect: 'follow',
    };
    if(authed)
      requestOptions.headers = {authorization: `Bearer ${this.user.token}`};

    try {
      fetch(this.api_url + path, requestOptions)
          .then(response => response.text())
          .then(result => {
            if (authed) {
              let json = JSON.parse(result);
              if (json.error === "Un-Authorised!") {
                return "Un-Authorised!"
              }
              callback_result.call(this, result);
            } else {
              callback_result.call(this, result);
            }
          });
    } catch (e) {
      console.log(e);
    }
  }
// }

class Store {

  constructor() {
    // console.log("Setting up storage");

    this.store = localStorage.getItem("store")
        ? JSON.parse(localStorage.getItem("store"))
        : [];

    // console.log("Current store:", this.store);

    this.userUpload;

    if(localStorage.getItem("ctg")) {
      this.ctg = JSON.parse(localStorage.getItem("ctg"));
    }
    else {
      this.ctg = {};
      this.ctg.default = {name: "default", color: colors.blue[4], active: true, id: 0};
    }

    this.activeOverlay = new Set();

    this.handleRenders = {
      sidebar: {
        callback: null,
      },
      datepicker: {
        reset: null,
      },
      form: {
        callback: null,
      },
      reconfig: {
        callback: null,
      },
      categories: {
        callback: null,
      },
      calendars: {
        previous: {
          reset: null,
        },
        month: {
          reset: null,
          resize: null,
        },
        week: {
          reset: null,
          render: null,
        },
        day: {
          reset: null,
        },
        list: {
          reset: null,
        },
      },
    };

    this.keyboardShortcuts = defautlKeyboardShortcuts;
    this.keyboardShortcutsStatus = true;
    this.animationStatus = true;

    this.api_url = localStorage.getItem("api_url") || "https://api-cal.transgirl.space/api";
    this.ws_url = localStorage.getItem("ws_url") || "api-cal.transgirl.space:400";
    if(!localStorage.getItem("user")) {
      let str = JSON.stringify({ id: "123", token: "321", expiry: 0 });
      localStorage.setItem("user", str);
    }
    this.user = JSON.parse(localStorage.getItem("user"));

    if(this.user.expiry < Date.now() / 1000) {
        console.warn("Token expired, any changes will not be saved.");
    } else {
        console.log("Token is valid, logged in fine.");
    }

    // TODO: Ensure the user cant create new events when not logged in. nor update them etc.
    this.online_ready = true;
    this.offline_queue = [];


    function websocket_connect() {
      if (!("WebSocket" in window)) {
        l.error("Device does not support websockets.", "Websocket");
        return;
      }

      console.log("Connecting to websocket server. (" + this.ws_url + ")");
      let ws = new WebSocket("wss://" + this.ws_url, 'echo-protocol');

      console.log("Connecting to websocket server. (" + this.ws_url + ")");
      // let ws = new WebSocket(this.ws_url, 'echo-protocol');

      ws.onopen = function () {
        l.debug("Websocket connection established.", "Websocket");

        this.user = JSON.parse(localStorage.getItem("user"));
        this.options = {
          timeout: 30000,
        }

        let msg = {
          type: "auth",
          id: this.user.id,
          token: this.user.token,
        }
        ws.send(JSON.stringify(msg));
        l.debug("Authentication request sent.", "Websocket")
      };

      ws.onmessage = function (evt) {
        let msg = JSON.parse(evt.data);
        switch (msg.type) {
          case "auth":
            if (msg.status !== "success") {
              l.warning("Authentication failed, token expired?", "Websocket");
              this.online_ready = false;
            }
            l.debug("Authentication successful", "Websocket");
            break;
          case "options":
            this.options = msg.options;
            l.log("Options received");
            break;
          case "heartbeat":
            l.verbose("Heartbeat received", "Websocket");
            clearTimeout(this.pingTimeout);

            this.pingTimeout = setTimeout(() => {
              l.warning("Terminating connection due to no ping response", "Websocket");
              this.close();
            }, this.options.timeout + 500);
            break;
          case "new_event":
            l.debug("New event created on another device or by the server", "Websocket");
            let event = msg.data;
            if(this.root.store.find(e => e.id === event.id)) {
                l.verbose("Event already exists, ignoring", "Websocket");
                return
            }
            this.root.store.push(event);
            Store.setStore(this.root.store);
            location.reload();
            return
          default:
            l.debug("Message is received: ", "Websocket");
            console.log(msg);
        }
      };

      ws.onerror = function (err) {
        // l.error("Error: " + JSON.parse(JSON.stringify(err)), "Websocket");
        console.log(err);
      };

      ws.onclose = function () {
        l.log("Connection is closed...", "Websocket");
        clearTimeout(this.pingTimeout);

        l.log("Attempting to reconnect in 5 seconds", "Websocket");
        setTimeout(() => {
          l.log("Attempting to reconnect", "Websocket");
          websocket_connect.call(this);
        }, 5000);
      };
    }
    websocket_connect.call(this);

    request_get.call(this, "/" + this.user.id + "/events/1", function (result) {
      // console.log("Server events");
      let last = this.store;
      // Strip active vars
      let json = JSON.parse(result);
      // l.log("Server updated events list - ");
      // console.log(json);

      let build = [];
      json.forEach(e => {
        build.push({
          "id": e.id,
          "category": e.calanderID,
          "completed": false,
          "description": e.description,
          "location": e.location || "N/A",
          "start":  e.eventStart,
          "end":  e.eventEnd,
          "title": e.title
        })
        this.online_ready = true;
      });

      if(JSON.stringify(last) !== JSON.stringify(build)) {
        console.log("Server updated events list - ", build);
        this.store = build;

        renderViews(context, datepickerContext, this);
      }

      let overlay = document.getElementById('overlay'); overlay.style.display = 'none';
          overlay = document.getElementById('overlay_blank');overlay.style.display = 'none';

      const login_container = document.getElementById('login_page-container');
      login_container.style.display = 'none';
    }, true);

    request_get.call(this, "/" + this.user.id + "", function (result) {
      let last = this.ctg;
      let json = JSON.parse(result);
      // console.log("Logged in member - ", json);
      let build = {};
      build.default = { name: "default", color: colors.blue[4], active: true, id: 0 };

      json.calanders.forEach(e => {
        build[e.id] = {
          "id": e.id,
          "name": e.name,
          "color": e.colour,
          "editable": e.editable,
          "active": true,
        };
      });

      let tmp_old = JSON.stringify(last);
      let tmp_new = JSON.stringify(build);

      // TODO: There is def a better way to do this.
      // Regex remove the key 'active' : true/false
      tmp_old = tmp_old.replace(/"active":(true|false)/g, "");
      tmp_new = tmp_new.replace(/"active":(true|false)/g, "");

      // Check for differences in events
      if(tmp_old !== tmp_new) {
          console.log("Server updated calendar list - ", build);
          console.log(last);
          this.ctg = build;
          Store.setCtg(this.ctg);

          renderViews(context, datepickerContext, this);
      }

    }, true);
  }


  setStoreForTesting(store) {
    this.store = store;
    Store.setStore(this.store);
  }


  getStoreStats() {
    return [this.store.length, this.getAllCtgNames().length];
  }

  getAllMethodNames() {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(
      (method) => {
        return method !== "constructor" && method !== "getStoreStats";
      }
    );
  }

  //#region Local storage management
  /* ************************* */
  /* LOCAL STORAGE MANAGEMENT */
  static getStore() {
    return JSON.parse(localStorage.getItem("store")) || [];
  }

  static getActiveStore() {
    return JSON.parse(localStorage.getItem("activeStore")) || [];
  }

  static getCtg() {
    return JSON.parse(localStorage.getItem("ctg")) || [];
  }

  static getShortcutsStatus() {
    return JSON.parse(localStorage.getItem("keyboardShortcutsStatus"));
  }

  static getAnimationStatus() {
    return JSON.parse(localStorage.getItem("animationStatus"));
  }

  // *******************
  static setStore(store) {
    // console.log("Setting state to", JSON.stringify(store));
    localStorage.setItem("store", JSON.stringify(store));
  }

  static setActiveStore(activeStore) {
    localStorage.setItem("activeStore", JSON.stringify(activeStore));
  }

  static setCtg(ctg) {
    localStorage.setItem("ctg", JSON.stringify(ctg));
  }

  static setShortcutsStatus(status) {
    localStorage.setItem("keyboardShortcutsStatus", JSON.stringify(status));
  }

  static setAnimationStatus(status) {
    localStorage.setItem("animationStatus", JSON.stringify(status));
  }
  /* ************************* */
  //#endregion

  //#region Essential crud
  /* ************** */
  /* essential crud (entries) - create, read, update, delete */
  addEntry(entry) {
    console.log(`Add entry:`, entry);

    // TODO: Implement category and whatever completed is
    //
    // entry = {
    //   "category":"default",
    //   "completed":false,
    // }

    var urlencoded = new URLSearchParams();
    urlencoded.append("title", entry.title);
    urlencoded.append("description", entry.description);
    urlencoded.append("location", entry.location);
    urlencoded.append("id", entry.id);
    urlencoded.append("end", entry.end);
    urlencoded.append("start", entry.start);

    request_body.call(this, "/" + this.user.id + "/events/" + entry.category, urlencoded, function (result) {
      entry.id = JSON.parse(result).response.id;
      console.log("New event ID: ", entry.id);

      this.store.push(entry);
      Store.setStore(this.store);
      renderViews(context, datepickerContext, this);
    });
  }

  createEntry(...args) {
    console.log(`Create entry`);
    console.log(JSON.stringify(...args));
    this.addEntry(new Entry(...args));
    Store.setStore(this.store);
  }

  deleteEntry(delete_id) {
    console.log(`Delete entry: ${delete_id}`);

    let urlencoded = new URLSearchParams();
    request_body.call(this,"/" + this.user.id + "/events/calander_id/" + delete_id, urlencoded, function (result) {
      console.log("Delete status: ", result);

      this.store = this.store.filter((entry) => entry.id !== delete_id);
      Store.setStore(this.store);
      renderViews(context, datepickerContext, this);
    }, 'DELETE');
  }

  getActiveEntries() {
    // console.log("Getting active entries");
    const active = this.getActiveCategories();
    if (!active) return [];
    const activeEntries = this.store.filter((entry) => {
      for(let i = 0; i < active.length; i++){
        if(entry.category === this.ctg[active[i]].name)
          return true;
      }
      // console.log(entry.indexOf(entry.category));
      return active ? active.indexOf(entry.category) > -1 : [];
    });
    // console.log(activeEntries);
    // console.log("=======================");
    return activeEntries;
  }

  getEntry(id) {
    let entry = this.store.find((entry) => entry.id === id);
    console.log(`Get entry: ${id}`, entry);
    return entry;
  }

  getEntries() {
    // console.log("Get entries");
    return this.store || [];
  }

  getEntriesByCtg(ctg) {
    console.log("Get entries by ctg: " + ctg);
    return this.store.filter((entry) => {
      return entry.category === ctg;
    });
  }

  removeLastEntry() {
    console.log("Remove last entry");
    this.store.pop();
    Store.setStore(this.store);
  }

  getLastEntryId() {
    // console.log("Get last entry id");
    let idx = this.store.length - 1 <= 0 ? -1  : this.store.length - 1;
    if (idx === -1)
      return -1;
    return this.store[idx].id;
  }

  compareEntries(entry1, entry2) {
    for (let key in entry1) {
      if (key === "id" || key === "coordinates") continue;
      if (key === "end" || key === "start") {
        if (new Date(entry1[key]).getTime() - new Date(entry2[key]).getTime() !== 0) {
          return false;
        }
      } else if (entry1[key] !== entry2[key]) {
        return false;
      }
    }
    return true;
  }

  updateEntry(id, data) {
    l.log(`Update entry: ${id} with`, data);

    const entryBefore = JSON.parse(JSON.stringify(this.getEntry(id)));

    let urlencoded = new URLSearchParams();
    for ( let j in entryBefore ) {
      if(j === "coordinates")
        continue;
      if ( entryBefore[j] !== data[j] ) {
        if(data[j] === undefined)
          continue;
        urlencoded.append(j, data[j]);
      }
    }

    request_body.call(this, "/" + this.user.id + "/events/1/" + id, urlencoded, function (result) {
      let entry = this.getEntry(id);
      entry = Object.assign(entry, data);

      Store.setStore(this.store);
      renderViews(context, datepickerContext, this);
    }, 'PUT');

  }
  /* ************ */
  //#endregion

  //#region Filter/Sort/Partition
  /* **************************** */
  /* (ENTRIES) FILTER/SORT/PARTITION/ */
  searchBy(entries, searchtype, value) {
    console.log("Search by");

    if (entries.length === 0) return;
    return entries.filter((entry) => {
      return entry[searchtype].toLowerCase().slice(0, value.length) === value;
    });
  }

  sortBy(entries, type, direction) {
    console.log("Sort by");

    if (entries.length === 0) return;

    if (direction === "desc") {
      return entries.sort((a, b) => {
        if (type === "start") {
          return new Date(a.start) - new Date(b.start);
        } else if (type === "end") {
          return new Date(a.end) - new Date(b.end);
        } else if (
          type === "description" ||
          type === "title" ||
          type === "category"
        ) {
          return a[type].localeCompare(b[type]);
        } else {
          return a[type] - b[type];
        }
      });
    } else {
      return entries.sort((a, b) => {
        if (type === "start") {
          return new Date(b.start) - new Date(a.start);
        } else if (type === "end") {
          return new Date(b.end) - new Date(a.end);
        } else if (
          type === "description" ||
          type === "title" ||
          type === "category"
        ) {
          return b[type].localeCompare(a[type]);
        } else {
          return b[type] - a[type];
        }
      });
    }
  }

  /**
   *
   * @returns {Array} [
   *    start date/time of earliest entry,  {string}
   *    end date/time of last entry         {string}
   * ]
   */
  getFirstAndLastEntry() {
    let sorted = this.sortBy(this.getActiveEntries(), "start", "desc");
    if (sorted === undefined) {
      return [0, 0];
    } else {
      return [sorted[0].start, sorted[sorted.length - 1].end];
    }
  }
  /* **************************** */
  //#endregion


  /* *************************************** */
  /* SEGMENT ENTRIES FOR SPECIFIC VIEWS (YEAR/MONTH/...ect)*/

  // @generateCoordinates -- (only used in week and day view)
  // generates coordinates based on start and end times for a given entry
  // if an entry spans beyond a day, it will render at the top of the grid in
  // a static (immobile) position.
  generateCoordinates(start, end) {
    [start, end] = [testDate(start), testDate(end)];

    let startMin = start.getHours() * 4 + Math.floor(start.getMinutes() / 15);
    let endMin = end.getHours() * 4 + Math.floor(end.getMinutes() / 15);
    let height = endMin - startMin;
    let total = startMin + height;

    if (!compareDates(start, end)) {
      return {
        allDay: true,
        x: start.getDay(),
        x2: end.getDay(),
      };
    } else {
      return {
        allDay: false,
        x: start.getDay(),
        y: startMin,
        h: height,
        e: total,
      };
    }
  }

  getDayEntries(day) {
    // console.log("Get day entries");
    // console.log("Day:", day);

    let activeEntries = this.getActiveEntries();
    let boxes = {
      allDay: [], // entries that start on one day and end on another
      day: [], // entries that start and end on same day
    };

    if (activeEntries.length === 0) return boxes;

    let dayEntries = activeEntries.filter((entry) => {
      let entryDate = new Date(entry.start);
      const [y, m, d] = [
        entryDate.getFullYear(),
        entryDate.getMonth(),
        entryDate.getDate(),
      ];
      return (
        y === day.getFullYear() && m === day.getMonth() && d === day.getDate()
      );
    });

    dayEntries.forEach((entry) => {
      // console.log("Day entries");
      entry.coordinates = this.generateCoordinates(
        new Date(entry.start),
        new Date(entry.end)
      );

      if (entry.coordinates.allDay) {
        boxes.allDay.push(entry);
      } else {
        boxes.day.push(entry);
      }
    });
    return boxes;
  }

  getDayEntriesArray(targetDate) {
    // console.log("Get day entries array");

    let activeEntries = this.getActiveEntries();
    if (activeEntries.length === 0) return [];

    return activeEntries.filter((entry) => {
      let entryDate = new Date(entry.start);
      const [y, m, d] = [
        entryDate.getFullYear(),
        entryDate.getMonth(),
        entryDate.getDate(),
      ];
      return (
        y === targetDate.getFullYear() &&
        m === targetDate.getMonth() &&
        d === targetDate.getDate()
      );
    });
  }

  getMonthEntries(montharr) {
    // console.log("Get month entries");
    let activeEntries = this.getActiveEntries();
    if (activeEntries.length === 0) return [];

    return activeEntries.filter((entry) => {
      let entryDate = new Date(entry.start);
      return (
        entryDate >= montharr[0] && entryDate <= montharr[montharr.length - 1]
      );
    });
  }

  getMonthEntryDates(montharr) {
    // console.log("Get month entry dates");
    let entries = this.getMonthEntries(montharr);
    let grouped = {};
    entries.forEach((entry) => {
      let entryDate = new Date(entry.start);
      const [y, m, d] = [
        entryDate.getFullYear(),
        entryDate.getMonth(),
        entryDate.getDate(),
      ];
      let key = `${y}-${m}-${d}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(entry);
    });
    return Object.keys(grouped);
  }

  getGroupedMonthEntries(entries) {
    return entries.reduce((acc, entry) => {
      let tempDate = new Date(entry.start);
      let day = tempDate.getDate();
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(entry);
      return acc;
    }, {});
  }

  getWeekEntries(week) {
    let activeEntries = this.getActiveEntries();
    let [start, end] = [week[0], week[6]];
    let boxes = {
      allDay: [], // entries that start on one day and end on another
      day: [], // entries that start and end on same day
    };

    if (activeEntries.length === 0) return boxes;
    let entries = activeEntries.filter((entry) => {
      let entryDate = new Date(entry.start);
      return entryDate >= start && entryDate <= end;
    });

    entries.forEach((entry) => {
      entry.coordinates = this.generateCoordinates(
        new Date(entry.start),
        new Date(entry.end)
      );

      if (entry.coordinates.allDay) {
        boxes.allDay.push(entry);
      } else {
        boxes.day.push(entry);
      }
    });

    return boxes;
  }

  getYearEntries(year) {
    let activeEntries = this.getActiveEntries();
    if (activeEntries.length === 0) return [];
    return activeEntries.filter(
      (entry) => new Date(entry.start).getFullYear() === year
    );
  }

  getGroupedYearEntries(yearentries) {
    let grouped = {};
    yearentries.forEach((entry) => {
      let entryDate = new Date(entry.start);
      let month = entryDate.getMonth();
      let day = entryDate.getDate();

      if (!grouped[month]) {
        grouped[month] = {};
      }

      if (!grouped[month][day]) {
        grouped[month][day] = [];
      }

      grouped[month][day].push(entry);
    });

    return grouped;
  }

  /* ************************************* */

  //#region iCal Subs
  /* ********************* */
  /*  ICAL SUBSCRIPTIONS */
  addNewSub(url) {
    l.log("Add new sub - " + url, "info", "ical");
    if(!this.online_ready) {
      console.log("Client is in offline mode");
      console.log("Adding to offline queue", {
          func: this.addNewSub,
          args: [url]
      });
      this.offline_queue.push({
          func: this.addNewSub,
          args: [url]
      });
      return;
    }

    let urlencoded = new URLSearchParams();
    urlencoded.append("url", url);
    request_body.call(this, "/" + this.user.id + "/ical", urlencoded, function(response) {
      let iCalID = JSON.parse(response).response.id;
      console.log("new iCal ID: " + iCalID);

      renderViews(context, datepickerContext, this);
    }, 'POST', true);
  }
  deleteSub(iCalSubID) {
    l.log("Deleting sub - " + iCalSubID, "info", "ical");
    if(!this.online_ready) {
      console.log("Client is in offline mode");
      console.log("Adding to offline queue", {
        func: this.deleteSub,
        args: [iCalSubID]
      });
      this.offline_queue.push({
        func: this.deleteSub,
        args: [iCalSubID]
      });
      return;
    }

    request_body.call(this, "/" + this.user.id + "/ical/" + iCalSubID, {}, function(response) {
      let res = JSON.parse(response);
      console.log("Deleted iCal ID: " + res);

      renderViews(context, datepickerContext, this);
    }, 'DELETE', true);
  }
  async getSubs(callback) {
    l.log("getting subs", "info", "ical");
    if(!this.online_ready) {
      return false;
    }

    let response = await request_get.call(this, "/" + this.user.id + "/ical", function (response) {}, true);
    response = JSON.parse(response);
    callback(response);
    return response;
  }

  /* ************************************* */
  //#endregion

  //#region Category Management
  /* ********************* */
  /*  CATEGORY MANAGEMENT */
  addNewCtg(categoryName, color) {
    console.log("Add new category - " + categoryName + " " + color + " " + name);

    if(!this.online_ready) {
      console.log("Client is in offline mode");
      console.log("Adding to offline queue", {
        func: this.addNewCtg,
        args: [categoryName, color]
      });
      this.offline_queue.push({
        func: this.addNewCtg,
        args: [categoryName, color]
      });
      return;
    }

    let urlencoded = new URLSearchParams();
    urlencoded.append("name", categoryName);
    urlencoded.append("colour", color);
    request_body.call(this, "/" + this.user.id + "/events/calander", urlencoded, function(response) {
      let calID = JSON.parse(response).response.id;

      console.log("CalID: " + calID);

      this.ctg[calID] = {
        color: color,
        active: true,
        name: categoryName,
        id: calID,
      };
      Store.setCtg(this.ctg);
      renderViews(context, datepickerContext, this);

    }, 'POST', true);
  }

  deleteCategory(category) {
    category = this.getCtgID(category);
    console.log("Delete category - " + category);

    let urlencoded = new URLSearchParams();
    urlencoded.append("CalanderID", category);
    request_body.call(this, "/" + this.user.id + "/calander", urlencoded, function(response) {
      let status = JSON.parse(response).response.status;

      console.log("Deleted category: " + category + " - status: " + status);

      delete this.ctg[category];
      Store.setCtg(this.ctg);

      renderViews(context, datepickerContext, this);

    }, 'DELETE', true);
  }

  getDefaultCtg() {
    return Object.entries(this.ctg)[0];
  }

  getFirstActiveCategory() {
    for (let [key, value] of Object.entries(this.ctg)) {
      if (value.active) {
        return key;
      }
    }
    return "default";
  }

  getFirstActiveCategoryKeyPair() {
    for (let [key, value] of Object.entries(this.ctg)) {
      if (value.active) {
        return [key, value.color];
      }
    }
    const backup = this.getDefaultCtg();
    return [backup[0], backup[1].color];
  }

  getActiveCategories() {
    let active = Object.keys(this.ctg).filter((key) => this.ctg[key].active);
    if (active.length > 0) {
      return active;
    } else {
      active = [];
    }
  }

  getActiveCategoriesKeyPair() {

    return Object.entries(this.ctg).filter((key) => key[1].active);
  }

  getAllCtg() {
    return this.ctg;
  }

  getAllCtgColors() {
    console.log("Get all ctg colors");
    console.log(this.ctg);
    console.log(Object.values(this.ctg));
    console.log(Object.values(this.ctg).map((ctg) => ctg.color));

    return Object.values(this.ctg).map((ctg) => ctg.color);
  }

  getAllCtgNames() {
    return Object.values(this.ctg).map((ctg) => ctg.name);
  }

  getAllCtgIDs() {
    return Object.keys(this.ctg);
  }

  getCategoryStatus(cat_id) {
    if (this.ctg.hasOwnProperty(cat_id)) {
      return this.ctg[cat_id].active;
    }
  }

  getCtgColorTitle(ctg_title) {
    // console.log("Get ctg color by title - " + ctg_title);
    let ctg_id = this.getCtgID(ctg_title);
    if(!this.ctg[ctg_id]) {
      console.warn("Category not found:", ctg_id, "Returning #000000");
      return "#ffb6c1";
    }
    return this.ctg[ctg_id].color;
  }
  getCtgColor(ctg_id) {
    // l.verbose("Get ctg color by id - " + ctg_id);
    if(!this.ctg[ctg_id]) {
      console.warn("Category not found:", ctg_id, "Returning #000000");
      return "#ffb6c1";
    }
    return this.ctg[ctg_id].color;
  }
  getCtgName(ctg_id) {
    if(!this.ctg[ctg_id]) {
      console.warn("Category not found:", ctg_id, "Returning #000000");
      return "#ffb6c1";
    }
    return this.ctg[ctg_id].name;
  }

  getCtgID(ctg_title) {
    for (let [key, obj] of Object.entries(this.ctg)) {
        if (obj.name === ctg_title) {
            return key;
        }
    }
    return -1;
  }

  getCtgLength(category) {
    return this.store.filter((entry) => entry.category === category).length;
  }

  hasCtg(categoryName) {
    console.log("Has category - " + categoryName);
    console.log(this.ctg);
    Object.values(this.ctg).forEach((ctg) => {
      if (ctg.name.toLowerCase() === categoryName.toLowerCase()) {
        return true;
      }
    });
    return false;
  }

  /**
   *
   * @param {string} category
   * @param {string} newCategory
   */
  moveCategoryEntriesToNewCategory(category, newCategory, newName) {
    if (this.hasCtg(category) || newName === true) {
      this.store.forEach((entry) => {
        if (entry.category === category) {
          entry.category = newCategory;
        }
      });
      Store.setStore(this.store);
    }
    this.deleteCategory(category);
  }

  removeCategoryAndEntries(category) {
    if (this.hasCtg(category)) {
      this.store = this.store.filter((entry) => entry.category !== category);
      Store.setStore(this.store);
    }
    this.deleteCategory(category);
  }

  setCategoryStatus(category, status) {
    // if (this.hasCtg(category)) {
    if(this.ctg[category]) {
      this.ctg[category].active = status;
      Store.setCtg(this.ctg);
    } else{
      console.warn("Category not found");
    }
    // }
  }

  setAllCategoryStatusExcept(category, status) {
    for (let key in this.ctg) {
      if (key !== category) {
        this.ctg[key].active = status;
      } else {
        this.ctg[key].active = !status;
      }
    }
    Store.setCtg(this.ctg);
  }

  /**
   *
   * @param {string} categoryName
   * @param {string} color
   * @desc updates the color of a category
   */
  updateCtgColor(categoryName, color) {
    if (this.hasCtg(categoryName)) {
      this.ctg[categoryName].color = color;
      Store.setCtg(this.ctg);
    }
  }

  getCtgIndex(category) {
    return Object.keys(this.ctg).indexOf(category);
  }

  /**
   *
   * @param {string} newName
   * @param {string} newColor
   * @param {string} oldName
   * @returns new category object
   * @desc note that 'value' of [key, value] is necessary to segment the object, even if it is not directly referenced
   */
  updateCtg(newName, newColor, oldName) {
    let entries = Object.entries(this.ctg);
    let hasColor = newColor !== null;
    let count = 0;
    let length = entries.length;

    const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);
    if (isNumeric(newName)) {
      newName = "category " + newName;
    }

    for (let [key, value] of entries) {
      count++;
      if (count === 1) {
        // changing the default category;
        if (oldName === key) {
          entries[0][0] = newName;
          if (hasColor) {
            entries[0][1].color = newColor;
          }
        }
      } else {
        if (oldName === key) {
          entries[count - 1][0] = newName;
          if (hasColor) {
            entries[count - 1][1].color = newColor;
          }
        }
      }
    }
    if (entries.length !== length) {
      console.error("something went wrong with category name/color change");
    } else {
      this.ctg = Object.fromEntries(entries);
      this.moveCategoryEntriesToNewCategory(oldName, newName, true);
      Store.setCtg(this.ctg);
    }
  }
  /* ********************* */
  //#endregion

  //#region Keyboard Shortcuts
  /* ***************************** */
  /*  KEYBOARD SHORTCUT MANAGEMENT */
  getShortcuts() {
    return this.keyboardShortcuts;
  }

  setShortCut(shortcut) {
    const keys = Object.keys(this.getShortcuts());
    let idx = keys.indexOf(shortcut);
    if (idx > -1) {
      return `Shortcut (${shortcut}) is already in use`;
    } else {
      return;
    }
  }

  setShortcutsStatus(status) {
    this.keyboardShortcutsStatus = status;
    Store.setShortcutsStatus(status);
  }

  getShortcutsStatus() {
    const status = Store.getShortcutsStatus();
    return status !== null ? status : true;
  }
  /* ***************************** */
  //#endregion

  //#region Animation
  /* ***************************** */
  /*  ANIMATION MANAGEMENT */

  getAnimationStatus() {
    const status = Store.getAnimationStatus();
    return status !== null ? status : true;
  }

  setAnimationStatus(status) {
    this.animationStatus = status;
    Store.setAnimationStatus(status);
  }
  /* ***************************** */
  //#endregion

  //#region Overlay
  /* ******************** */
  /*  OVERLAY MANAGEMENT */
  // see readme @ --overlay management-- for more info
  addActiveOverlay(overlay) {
    this.activeOverlay.add(overlay);
  }

  removeActiveOverlay(overlay) {
    const len = this.activeOverlay.size;
    if (len === 0) {
      return;
    } else if (this.activeOverlay.size === 1) {
      this.activeOverlay = new Set();
      return;
    } else {
      this.activeOverlay = new Set(
        [...this.activeOverlay].filter((o) => o !== overlay)
      );
      return;
    }
  }

  getActiveOverlay() {
    return this.activeOverlay;
  }

  hasActiveOverlay() {
    return this.activeOverlay.size > 0;
  }
  /* ******************** */
  //#endregion

  //#region JSON Upload & Download
  /* ************************ */
  /*  JSON UPLOAD & DOWNLOAD */
  validateUserUpload(userUpload) {
    const keys = Object.keys(userUpload);
    let message = {};
    if (keys.length > localStoreKeyNames.length) {
      message.err1 = "invalid number of keys (too many)";
    }

    for (let i = 0; i < keys.length; i++) {
      if (!localStoreKeyNames.includes(keys[i])) {
        let errname = "err" + Object.keys(message).length;
        message[errname] = "invalid key: " + keys[i];
      }
    }

    if (Object.keys(message).length > 0) {
      return message;
    } else {
      return true;
    }
  }

  setUserUpload(userUpload) {
    const validation = this.validateUserUpload(userUpload);
    let validated;
    if (validation === true) {
      localStorage.clear();
      validated = true;
      for (const [key, value] of Object.entries(userUpload)) {
        localStorage.setItem(key, value);
      }
    } else {
      return validation;
    }
    if (validated) {
      const refresh = localStorage.getItem("refresh");
      if (refresh === null) {
        window.location.reload();
        window.localStorage.setItem("refresh", "1");
      }
    }
  }

  getUserUpload() {
    return this.userUpload;
  }
  /* ************************ */
  //#endregion

  /* ******************************************* */
  /*  STATE MANAGEMENT : RENDERING / RESET / RESIZE */
  /**
   * This got a bit more complicated than I anticipated, I'll come back to this later;
   */
  setFormRenderHandle(type, callback) {
    this.handleRenders.calendars[type].render = callback;
  }

  setFormResetHandle(type, callback) {
    this.handleRenders.calendars[type].reset = callback;
  }

  setRenderFormCallback(callback) {
    this.handleRenders.form.callback = callback;
  }

  setRenderSidebarCallback(callback) {
    this.handleRenders.sidebar.callback = callback;
  }

  setResizeHandle(type, callback) {
    this.handleRenders.calendars[type].resize = callback;
  }

  setDataReconfigCallback(callback) {
    this.handleRenders.reconfig.callback = callback;
  }

  setResetDatepickerCallback(callback) {
    this.handleRenders.datepicker.reset = callback;
  }

  setResetPreviousViewCallback(callback) {
    this.handleRenders.calendars["previous"].reset = callback;
  }

  setRenderCategoriesCallback(callback) {
    this.handleRenders.categories.callback = callback;
  }

  getRenderCategoriesCallback() {
    return this.handleRenders.categories.callback;
  }

  getResetPreviousViewCallback() {
    return this.handleRenders.calendars["previous"].reset;
  }

  getResetDatepickerCallback() {
    return this.handleRenders.datepicker.reset;
  }

  getDataReconfigCallback() {
    return this.handleRenders.reconfig.callback;
  }

  getResizeHandle(type) {
    if (this.handleRenders.calendars[type] === undefined) {
      return null;
    } else {
      return this.handleRenders.calendars[type].resize;
    }
  }

  getFormRenderHandle(type) {
    if (this.handleRenders.calendars[type] === undefined) {
      return null;
    } else {
      return this.handleRenders.calendars[type].render;
    }
  }

  getFormResetHandle(type) {
    if (this.handleRenders.calendars[type].reset === undefined) {
      return null;
    } else {
      return this.handleRenders.calendars[type].reset;
    }
  }

  getRenderFormCallback() {
    const callback = this.handleRenders.form.callback;
    if (callback !== null) {
      return callback;
    } else {
      return null;
    }
  }

  getRenderSidebarCallback() {
    const callback = this.handleRenders.sidebar.callback;
    if (callback !== null) {
      return callback;
    } else {
      return null;
    }
  }
  /* ************************************ */
}

// single
export default new Store();

