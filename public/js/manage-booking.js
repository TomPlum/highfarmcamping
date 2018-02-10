$(document).ready(() => {
    const oTable = "<table>";
    const cTable = "</table>";
    let tBody = "";

    let headers = "<tr>" +
                    "<th>Pitch Details</th>" +
                    "<th>Customer Name</th>" +
                    "<th>Paid?</th>" +
                    "<th>Booking Duration</th>" +
                  "</tr>";

    let data = [];

    //Populate Tents
    for (let i = 1; i <= 20; i++) {
        const today = new Date();
        const todayFuture = today.addDays(getRandomInt(0, 50));
        console.log(today);
        console.log(todayFuture);
        const startDate = getRandomDate(new Date(), todayFuture);
        const endDate = startDate.addDays(getRandomInt(1, 14));

        data.push({
            pitch_id: i,
            pitch_type: "Tent",
            customer_name: getName(),
            electrical: false,
            all_weather: false,
            paid: getRandomInt(0, 1) === 0,
            start_date: startDate,
            end_date: endDate
        });
    }

    //Populate Caravans
    for (let i = 1; i <= 12; i++) {
        const today = new Date();
        const todayFuture = today.addDays(getRandomInt(0, 50));
        console.log(today);
        console.log(todayFuture);
        const startDate = getRandomDate(new Date(), todayFuture);
        const endDate = startDate.addDays(getRandomInt(1, 14));

        data.push({
            pitch_id: i + 20,
            pitch_type: "Caravan",
            customer_name: getName(),
            electrical: false,
            all_weather: true,
            paid: getRandomInt(0, 1) === 0,
            start_date: startDate,
            end_date: endDate
        });
    }

    //Populate Electrical (Suitable for Tents, Caravans and Motorhomes)
    for (let i = 1; i <= 6; i++) {
        const today = new Date();
        const todayFuture = today.addDays(getRandomInt(0, 50));
        console.log(today);
        console.log(todayFuture);
        const startDate = getRandomDate(new Date(), todayFuture);
        const endDate = startDate.addDays(getRandomInt(1, 14));

        data.push({
            pitch_id: i + 32,
            pitch_type: "Electrical",
            customer_name: getName(),
            electrical: true,
            paid: getRandomInt(0, 1) === 0,
            start_date: startDate,
            end_date: endDate
        });
    }

    //Create Table Body
    for (let i = 0; i < data.length; i++) {
        tBody += "<tr>";
        tBody += "<td> Pitch " + data[i].pitch_id + "<br>" + getIcon(data[i].pitch_type) + "</td>";
        tBody += "<td>" + data[i].customer_name + "</td>";
        tBody += "<td>" + formatPaid(data[i].paid) + "</td>";
        tBody += "<td>" + formatDate(data[i].start_date) + " - " + formatDate(data[i].end_date) + "</td>";
        tBody += "</tr>";
    }


    $(".pitch-booking-overview").html(oTable + headers + tBody + cTable);
});

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

    switch(type) {
        case "Tent":
            return tent;
            break;
        case "Caravan":
            return caravan  + " " + all_weather;
            break;
        case "Electrical":
            return tent + " " + caravan + " " + motorhome + " " + electrical;
            break;
        default:
            return "N/A";
    }
}

function getName() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
}


function formatDate(date) {
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
    if (paid) {
        return "Yes";
    }
    return "No";
}