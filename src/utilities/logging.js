/*
    Author: Conni!~#0920 (conni@spookiebois.club)
    Github: https://github.com/ConniBug/JS-Logging

*/
function getDateTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return (year + ":" + month + ":" + day + " - " + hour + ":" + min + ":" + sec);
}

logLevel = "LEGITALL";
function getLogLevelNum(level) {
    if (level == "TESTING") return 0;
    if (level == "GENERIC") return 2;
    if (level == "DEBUG")   return 3;
    if (level == "WARNING") return 5;
    if (level == "ERROR")   return 7;
    if (level == "VERBOSE") return 9;
    if (level == "CRITICAL") return 11;
    if (level == "ALL")     return 15;

    // Debugging stuff.
    if (level == "TIMINGS") return 20;

    if (level == "LEGITALL") return 100;

    log("Unsure what log level " + level.red + " belongs to.", "GENERIC");
    return 4;
}

async function log(message, caller, type = "DEBUG", callingFunction = "N/A") {
    if (getLogLevelNum(type) > getLogLevelNum(logLevel)) {
        return;
    }
    maxSize = 17

    time = getDateTime();

    if (callingFunction == "N/A") {
        StartMessage = `[${time}] - [`;
    } else {
        StartMessage = `[${time}] - [${callingFunction}] - [`;
    }

    if (type == "ERROR") {
        console.log(caller);

        StartMessage += type;
    }
    else if (type == "WARNING") StartMessage += type;
    else if (type == "GENERIC") StartMessage += type;
    else if (type == "DEBUG") StartMessage += type;
    else if (type == "VERBOSE") StartMessage += type;
    else if (type == "TESTING") StartMessage += type;
    else if (type == "CRITICAL") StartMessage += type
    else StartMessage += type;

    left = maxSize - StartMessage.length;
    function balence() {
        tmp = "";
        space = " ";
        while(left >= 0) {
            left = left-1;
            tmp = tmp + space;
        }
        return tmp;
    }
    let toLog = StartMessage + "] " + balence(StartMessage) +  "-> " + message;

    console.log(toLog);
}

module.exports = {
    setLogLevel: (Level) => {
        logLevel = Level
    },
    getLogLevelNum: (level) => {
        return getLogLevelNum(level);
    },
    log: async (message, type = "GENERIC", callingFunction = "N/A") => {
        log(message, "", type, callingFunction);
    },
    verbose: async (message, callingFunction = "N/A") => {
        log(message, "", "VERBOSE", callingFunction);
    },
    error: async (message, callingFunction = "N/A") => {
        log(message, "", "ERROR", callingFunction);
    },
    warning: async (message, callingFunction = "N/A") => {
        log(message, "", "WARNING", callingFunction);
    },
    debug: async (message, callingFunction = "N/A") => {
        log(message, "", "DEBUG", callingFunction);
    },
    critical: async (message, callingFunction = "N/A") => {
        log(message, "", "CRITICAL", callingFunction);
    },
    char_count: (str, letter) => {
        return char_count(str, letter);
    },
    getDateTime: () => {
        return getDateTime();
    }
};