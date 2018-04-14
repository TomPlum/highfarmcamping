// This file is for all functions which are used in several files to prevent redundancy:

// This string can be used for displaying the user an error:
const errorNotification = "I am sorry. We have an error. Please contact your IT Support";


// For getting icons for a pitch:
function getIcon(type) {
    const all_weather = "<span title='All Weather' class='fa fa-cloud'></span>";
    const tent = "<span title='Tent' class='glyphicon glyphicon-tent'></span>";
    const caravan = "<span title='Caravan' class='fas fa-car'></span>";
    const motorhome = "<span title='Motorhome' class='fas fa-truck'></span>";
    const electrical = "<span title='Electrical Outlet' class='fas fa-bolt'></span>";

    switch (type) {
        case "tent":
            return tent;
        case "caravan":
            return caravan + " " + all_weather;
        case "motorhome":
            return motorhome + " " + all_weather + electrical;
        case "all":
            return tent + " " + caravan + " " + motorhome + " " + electrical;
        case "all-manage":
            return "<div class='row'>" + tent + " " + caravan + "</div><div class='row'>" + motorhome + " " + electrical + "</div>";
        default:
            return "N/A";
    }
}

// for displaying Paid? Yes or No in table
function formatPaid(paid) {
    if (paid === 1) {
        return "Yes";
    }
    return "No";
}
// To make the payment type in first letter lowercased:
function ucFirst(string) {
    return string.substring(0, 1).toUpperCase() + string.substring(1);
}

//convert input date DD/MM/YYYY into database suitable date
function dateConverter(date){
    dateF = date.trim();
    let d = dateF.substring(0, 2);
    let m = dateF.substring(3,5);
    let y = dateF.substring(6,10);
    return(y +"-"+m+"-"+d);
}

//convert input date from DatePicker DD/MM/YYYY into database suitable date
function datePickerDateConverter(date){
    dateF = date.trim();
    let d = dateF.substring(0, 2);
    let m = dateF.substring(3,5);
    let y = dateF.substring(6,10);
    return(y +"-"+m+"-"+d);
}

//for displaying date of SQL query in a table:
function formatDate(date) {
    date = new Date(date);
    let DD = date.getDate();
    if (DD < 10) {
        DD = "0" + DD;
    }
    let MM = date.getMonth() +1;
    if (MM < 10) {
        MM = "0" + MM;
    }
    const YYYY = date.getFullYear();
    return DD + "/" + MM + "/" + YYYY;
}

//convert british format to ISOformat
function convertBritishToISO(date) {
    dateF = date.trim();
    let d = dateF.substring(0, 2);
    let m = dateF.substring(3,5);
    let y = dateF.substring(6,10);
    return(y +"/"+m+"/"+d);
}

// To format milliseconds into format DD/MM/YYYY:
function formatDateFromMilliseconds(date) {
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    const year = String(date.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${day}/${month}/${year}`;
}
// formats DD/MM/YYYY into JavaScript Date format
function writtenDateToJavaScriptDate(dateStr) {
    const [day, month, year] = dateStr.split("/");
    return new Date(year, month - 1, day);
}


// checks if a value has the date format DD/MM/YYYY

function generalDateValidityCheck(date) {

    let validity = true;
    date += "";

    if (date.indexOf("/") !== 2 && date.indexOf("/", date.indexOf("/")) !== 5 && date.indexOf("/", date.indexOf(date.indexOf("/"), "/")) === -1) {
        validity = false;
    } else {
        let d = date.substring(0, 2);
        let m = date.substring(3, 5);
        let y = date.substring(6);

        if (d.length !== 2 || m.length !== 2 || y.length !== 4) {
            validity = false;
        } else {
            if (parseInt(d) > 31 || parseInt(m) > 12) {
                validity = false;
            }
        }

    }

    return validity;
}

function parseURLParams(url) {
    let queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}


