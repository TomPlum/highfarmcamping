$(document).ready(() => {
    startLoadingAnimation();

    $.ajax({
        url: "/manage-booking/get-booking-overview",
        type: "POST",
        success: (data) => {
            stopLoadingAnimation();
            renderTable(data);
        },
        error: (err) => {
            console.log(err);
        }
    });

});

function renderTable(data) {
    const oTable = "<table class='table table-hover table-striped table-condensed'>";
    const cTable = "</table>";
    let tBody = "<tbody>";

    let headers = "<thead>" +
        "<tr>" +
        "<th>Pitch Details</th>" +
        "<th>Customer Name</th>" +
        "<th>Paid?</th>" +
        "<th>Booking Duration</th>" +
        "</tr>" +
        "</thead>";

    //Create Table Body
    for (let i = 0; i < data.length; i++) {
        tBody += "<tr>";
        tBody += "<td> Pitch " + data[i].pitch_id + "<br>" + getIcon(data[i].type) + "</td>";
        tBody += "<td>" + data[i].first_name + " " + data[i].last_name + "</td>";
        tBody += "<td>" + formatPaid(data[i].paid) + "</td>";
        tBody += "<td>" + formatDate(data[i].stay_start_date) + " - " + formatDate(data[i].stay_end_date) + "</td>";
        tBody += "</tr>";
    }

    tBody += "</tbody>";


    $(".pitch-booking-overview").html(oTable + headers + tBody + cTable);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

Date.prototype.addDays = function(days) {
    let dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

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

function getName() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
}


function formatDate(date) {
    date = new Date(date);
    let DD = date.getDate();
    if (DD < 10) {
        DD = "0" + DD;
    }
    let MM = date.getMonth();
    if (MM < 10) {
        MM = "0" + MM;
    }
    const YYYY = date.getFullYear();
    return DD + "/" + MM + "/" + YYYY;
}

function formatPaid(paid) {
    if (paid === 1) {
        return "Yes";
    }
    return "No";
}