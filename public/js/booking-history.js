$(document).ready(() => {
    startLoadingAnimation();
    $.ajax({
        url: "/manage-booking/history",
        type: "POST",
        async: true,
        success: function(data) {
            stopLoadingAnimation();
            renderHistory(data)
        },
        error: function(err) {
            console.log(err);
        }
    }) ;
});

function renderHistory(data) {
    const oTable = "<table class='table table-hover table-striped table-condensed'>";
    const cTable = "</table>";
    let tBody = "<tbody>";

    let headers = "<thead>" +
        "<tr>" +
        "<th>Booking ID</th>" +
        "<th>Booking Date</th>" +
        "<th>Booking Type</th>"+
        "<th>Dogs</th>"+
        "<th>Customer Name</th>"+
        "<th>Email Address</th>" +
        "<th>Stay Date</th>" +
        "<th>Payment Method</th>"+
        "<th>Payment Total</th>"+
        "</tr>" +
        "</thead>";

    for (let i = 0; i < data.length; i++) {
        tBody += "<tr>";
        tBody += "<td>" + data[i].booking_id + "</td>";
        tBody += "<td>" + parseBookingDate(data[i].booking_date) + "</td>";
        tBody += "<td>" + formatCasing(data[i].type) + "</td>";
        tBody += "<td>" + data[i].count_dogs + "</td>";
        tBody += "<td>" + formatCasing(data[i].first_name + " " + data[i].last_name) + "</td>";
        tBody += "<td>" + data[i].email_address + "</td>";
        tBody += "<td>" + parseStayDates(data[i].stay_start_date, data[i].stay_end_date) + "</td>";
        tBody += "<td>" + formatCasing(data[i].payment_type) + "</td>";
        tBody += "<td>£" + data[i].payment_total + "</td>";
    }

    $("#booking-history").html(oTable + headers + tBody + cTable);
    console.log(data);
}

function parseStayDates(d1, d2) {
    d1 = new Date(d1);
    d2 = new Date(d2);
    let d1Year = d1.getFullYear();
    let d1Month = d1.getMonth() + 1;
    if (d1Month < 10) {
        d1Month = "0" + d1Month;
    }
    let d1Day = d1.getDate();
    if (d1Day < 10) {
        d1Day = "0" + d1Day;
    }

    let d2Year = d2.getFullYear();
    let d2Month = d2.getMonth() + 1;
    if (d2Month < 10) {
        d2Month = "0" + d2Month;
    }
    let d2Day = d2.getDate();
    if (d2Day < 10) {
        d2Day = "0" + d2Day;
    }

    return d1Day + "/" + d1Month + "/" + d1Year + " - " + d2Day + "/" + d2Month + "/" + d2Year;
}

function parseBookingDate(date) {
    date = new Date(date);
    let YYYY = date.getFullYear();
    let MM = date.getMonth() + 1;
    if (MM < 10) {
        MM = "0" + MM;
    }
    let DD = date.getDate();
    if (DD < 10) {
        DD = "0" + DD;
    }

    return DD + "/" + MM + "/" + YYYY;
}

function formatCasing(string) {
   // return string;
    let arr = string.split(" ");
    let res = "";
    for (let i = 0; i < arr.length; i++) {
        res += arr[i].substring(0, 1).toUpperCase() + arr[i].substring(1, arr[i].length);
        res += " ";
    }

    return res;
}