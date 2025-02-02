import setViews from "../../config/setViews";
import { getClosest } from "../../utilities/helpers";

import {
  formatEntryOptionsDate,
  compareDates,
} from "../../utilities/dateutils";

const entryOptionsOverlay = document.querySelector(".entry__options--overlay");
const entryOptionsWrapper = document.querySelector('.entry__options');
const entryOptionsHeaderWrapper = document.querySelector(".entry__options--header")
const entryOptionsDateHeader = document.querySelector('.entry__options-date');
const entryOptionsTimeHeader = document.querySelector('.entry__options-time');
const entryOptionTitle = document.querySelector(".eob-title");
const entryOptionDescription = document.querySelector('.eob-description');
const entryOptionCategoryIcon = document.querySelector(".eob-category--icon");
const entryOptionCategory = document.querySelector('.eob-category');

export default function getEntryOptionModal(context, store, entry, datepickerContext, finishSetup) {

  function openEditForm() {
    const openForm = store.getRenderFormCallback();
    openForm();
    finishSetup();
    closeEntryOptions();
  }

  function proceedDelete(entry) {
    store.deleteEntry(entry.id);
    closeEntryOptions();
    setViews(context.getComponent(), context, store, datepickerContext);
  }

  function openDeleteWarning() {
    const deletepopup = document.createElement("div");
    deletepopup.classList.add("delete-popup");

    const deletebtns = document.createElement("div");
    deletebtns.classList.add("delete-popup__btns");

    const deletepopupCancel = document.createElement("button");
    deletepopupCancel.classList.add("delete-popup__cancel");
    deletepopupCancel.textContent = "Cancel";

    const deletepopupConfirm = document.createElement("button");
    deletepopupConfirm.classList.add("delete-popup__confirm");
    deletepopupConfirm.textContent = "Delete";

    const deletepopupText = document.createElement("p");
    deletepopupText.classList.add("delete-popup__text");
    deletepopupText.textContent = "Are you sure you want to delete this entry?";

    deletebtns.append(deletepopupCancel, deletepopupConfirm);
    deletepopup.append(deletepopupText, deletebtns);
    entryOptionsWrapper.append(deletepopup);

    const removeDeletePopup = () => { deletepopup.remove(); };
    const submitDelete = () => {
      proceedDelete(entry);
      removeDeletePopup();
      const resetCurrentView = store.getFormResetHandle(context.getComponent());
      if (resetCurrentView !== null) {
        resetCurrentView();
      }
    };

    deletepopupCancel.onclick = removeDeletePopup;
    deletepopupConfirm.onclick = submitDelete;
  }


  /**
   * formNegated
   * @desc anytime the entry options modal is opened, the form is set to represent the entry selected. If user chooses to not open the form from this modal, reset form & modal to default state.
   */
  function formNegated() {
    const resetCurrentView = store.getFormResetHandle(context.getComponent());
    closeEntryOptions();
    resetCurrentView();
  }

  function closeEntryOptions() {
    [
      entryOptionsDateHeader,
      entryOptionsTimeHeader,
      entryOptionTitle,
      entryOptionDescription,
      entryOptionCategory,
    ].forEach(el => el.innerText = "");

    entryOptionsWrapper.classList.add("entry__options--hidden");
    entryOptionsOverlay.classList.add("entry__options--hidden");
    store.removeActiveOverlay("entry__options--hidden");
    entryOptionDescription.parentElement.removeAttribute("style");
    entryOptionsWrapper.onclick = null;
    entryOptionsOverlay.onclick = null;
    entryOptionsHeaderWrapper.focus();
    document.removeEventListener("keydown", handleEntryOptionKD);
  }

  function convertTo24Hr(strTime)  {
    // TODO: This should only be converting the displayed ui time when its enabled in the users ui config

    if(!(strTime.includes(" "))) {
      strTime = strTime.replace("p", " p");
      strTime = strTime.replace("a", " a");
    }

    const [time, modifier] = strTime.split(' ');
    let [hours, minutes] = time.split(':');

    if (minutes === undefined)
      minutes = "00";

    if (hours === '12')
      hours = '00';

    if (modifier.toUpperCase() === 'PM')
      hours = parseInt(hours, 10) + 12;

    return `${hours}:${minutes}`;
  }

  function setEntryDefaults() {
    entryOptionsWrapper.classList.remove("entry__options--hidden");
    entryOptionsOverlay.classList.remove("entry__options--hidden");
    store.addActiveOverlay("entry__options--hidden");

    const [start, end] = [new Date(entry.start), new Date(entry.end)];
    let istoday = false;
    if (compareDates(start, new Date())) {
      istoday = true;
    }

    const getDateTime = formatEntryOptionsDate(start, end);

    console.log("setEntryDefaults");
    console.log("Date was " + getDateTime.date);

    let result = getDateTime.date.match(/\((.*?)\)/gm)[0].replace("(", "").replace(")", "");    entryOptionsDateHeader.textContent = result[1];
    let [first, second] = result.split(" – ");

    if(!(first.includes("am") || first.includes("pm")))
      first += second.includes("pm") ? "pm" : "am";

    first = convertTo24Hr(first);
    second = convertTo24Hr(second);

    entryOptionsDateHeader.textContent = getDateTime.date.split("(")[0] + "(" + first + " – " + second + ")";

    console.log("Displaying date as " + entryOptionsDateHeader.textContent);

    // entryOptionsDateHeader.textContent = getDateTime.date;
    if (getDateTime.time !== null) {
      if (getDateTime.time === undefined) {
        let tempdate = new Date();
        let secondsDiff = tempdate.getTime() - end.getTime();
        let daysSince = Math.floor(secondsDiff / (1000 * 60 * 60 * 24));
        let timeheadertitle;

        /**
         * If the entry has ended, display the time since it ended
         * If the entry has ended today, display the time since it ended
         * If the entry has ended yesterday, display "ended yesterday"
         * If the entry starts today, display how long until it is scheduled to end
         * If the entry is yet to start, display how long until it is scheduled to start
         */
        if (daysSince === 0) {
          let hourSince = Math.floor(secondsDiff / (1000 * 60 * 60));
          let minSince = Math.floor((secondsDiff - (hourSince * 1000 * 60 * 60)) / (1000 * 60));
          if (hourSince === 0) {
            if (minSince === 1) {
              timeheadertitle = `ended ${minSince} minute ago`;
            } else {
              timeheadertitle = `ended ${minSince} minutes ago`;
            }
          } else if (hourSince === 1) {
            timeheadertitle = `ended ${hourSince} hour ago`;
          } else if (hourSince > 1) {
            timeheadertitle = `ended ${hourSince} hours ago`;
          }
        } else if (daysSince === 1) {
          timeheadertitle = "ended yesterday";
        } else {
          timeheadertitle = `ended ${daysSince} days ago`;
        }
        entryOptionsTimeHeader.textContent = timeheadertitle;
      } else {
        if (istoday) {
          entryOptionsTimeHeader.textContent = "ending in " + getDateTime.time;
        } else {
          entryOptionsTimeHeader.textContent = getDateTime.time;
        }
      }
    }

    entryOptionTitle.textContent = entry.title;

    entry.description.length === 0 ? entryOptionDescription.parentElement.style.display = "none" : entryOptionDescription.textContent = entry.description;

    entryOptionCategoryIcon.setAttribute("fill", store.getCtgColor(entry.category));
    entryOptionCategory.textContent = store.getCtgName(entry.category);

    entryOptionsWrapper.onclick = delegateEntryOptions;
    entryOptionsOverlay.onclick = formNegated;
    // entryOptionsWrapper.focus();
    document.addEventListener("keydown", handleEntryOptionKD);
  }

  function handleEntryOptionKD(e) {
    const deletepopup = document?.querySelector(".delete-popup");

    if (e.key === "Escape") {
      if (deletepopup) {
        deletepopup.remove();
        return;
      } else {
        formNegated();
      }
    }

    if (e.key.toLowerCase() === "e") {
      openEditForm();
    }

    if (e.key === "Delete") {
      openDeleteWarning();
    }
  }

  function delegateEntryOptions(e) {
    const editBtn = getClosest(e, ".eoi__edit");
    const deleteBtn = getClosest(e, ".eoi__delete");
    const closeBtn = getClosest(e, ".eoi__close");

    if (editBtn) {
      openEditForm();
      return;
    }

    if (deleteBtn) {
      openDeleteWarning();
      return;
    }

    if (closeBtn) {
      formNegated();
      return;
    }
  }

  setEntryDefaults();
}