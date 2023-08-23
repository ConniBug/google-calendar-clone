import setHeader from "../components/menus/header";
import setYearView from "../components/views/yearview";
import setMonthView from "../components/views/monthview";
import setWeekView from "../components/views/weekview";
import setDayView from "../components/views/dayview";
import setListView from "../components/views/listview";
// import setListView from "../components/views/listview"

const yearComponent = document.querySelector(".yearview");
const monthComponent = document.querySelector(".monthview");
const weekComponent = document.querySelector(".weekview");
const dayComponent = document.querySelector(".dayview");
const listComponent = document.querySelector(".listview");

let [prev1, prev2] = [null, null];
export default function setViews(component, context, store, datepickerContext) {
  prev1 = prev2;
  prev2 = component;

  function hideViews() {
    const views = [
      yearComponent,
      monthComponent,
      weekComponent,
      dayComponent,
      listComponent
    ];

    // reset previous view after switching to a new view
    const resetPrevView = store.getResetPreviousViewCallback();
    if (prev1 !== null && resetPrevView !== null && prev1 !== prev2) {
      resetPrevView();
    }

    // only the month view relies on a resize listener
    // more info provided @readme > monthview > box queries
    views.forEach((view) => {
      view.classList.add("hide-view");
      // if (view !== monthComponent) {
      //   window.onresize = null;
      // }
    });
  }
  // window.removeEventListener("resize", store.getResizeHandle("month"));

  const convertTo24Hr = (strTime) => {
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

  function initView(component) {
    let cells;
    switch (component) {
      case "day":
        context.setComponent(component);
        setHeader(context, component);
        setDayView(context, store, datepickerContext);
        dayComponent.classList.remove("hide-view");

        cells = document.getElementsByClassName("dv-sidegrid--cell");
        for(let i = 0; i < cells.length; i++) {
          cells[i].textContent = convertTo24Hr(cells[i].textContent);
        }
        break;
      case "week":
        context.setComponent(component);
        setHeader(context, component);
        setWeekView(context, store, datepickerContext);
        weekComponent.classList.remove("hide-view");

        cells = document.getElementsByClassName("sidegrid-cell");
        for(let i = 0; i < cells.length; i++) {
          cells[i].textContent = convertTo24Hr(cells[i].textContent);
        }
        break;
      case "month":
        context.setComponent(component);
        setHeader(context, component);
        setMonthView(context, store, datepickerContext);
        monthComponent.classList.remove("hide-view");
        // window.onresize = store.getResizeHandle("month");
        // window.addEventListener("resize", store.getResizeHandle("month"));
        break;
      case "year":
        context.setComponent(component);
        setHeader(context, component);
        setYearView(context, store, datepickerContext);
        yearComponent.classList.remove("hide-view");
        break;
      case "list":
        context.setComponent(component);
        setHeader(context, component, store);
        setListView(context, store, datepickerContext);
        listComponent.classList.remove("hide-view");

        cells = document.getElementsByClassName("rowgroup--cell__time");
        for(let i = 0; i < cells.length; i++) {

          let [first, second] = cells[i].textContent.split(" – ");

          if(!(first.includes("am") || first.includes("pm")))
            first += second.includes("pm") ? "pm" : "am";

          first = convertTo24Hr(first);
          second = convertTo24Hr(second);

          cells[i].textContent = first + " – " + second;
        }
        break;
      default:
        context.setComponent("month");
        setHeader(context, "month");
        setMonthView(context, store, datepickerContext);
        monthComponent.classList.remove("hide-view");
        break;
    }
  }

  hideViews();
  document.title = "GCal - " + context.getMonthName();
  initView(component);
}