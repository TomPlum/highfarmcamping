// This file is for all functions which are used in several files to prevent redundancy:

// This string can be used for displaying the user an error:
const errorNotification = "I am sorry. We have an error. Please contact your IT Support";


// For getting icons for a pitch:
function getIcon(type) {
    const all_weather = "<span class='fa fa-cloud'></span>";
    const tent = "<span class='glyphicon glyphicon-tent'></span>";
    const caravan = "<span class='fa fa-car'></span>";
    const motorhome = "<span class='fa fa-truck'></span>";
    const electrical = "<span class='fa fa-lightbulb'></span>";

    switch (type) {
        case "tent":
            return tent;
        case "caravan":
            return caravan + " " + all_weather;
        case "motorhome":
            return motorhome + " " + all_weather + electrical;
        case "all":
            return tent + " " + caravan + " " + motorhome + " " + electrical;
        default:
            return "N/A";
    }
}
//for displaying date in a table:
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