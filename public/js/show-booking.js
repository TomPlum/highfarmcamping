$(document).ready(() => {
    console.log("THIS IS URL " + window.location.search.substring(4));
    //console.log("THIS IS ID: " + URLSearchParams.get(window.location));

    getBookingFromDB();
    //Ajax call to the DB to get customer to be deleted
    function getBookingFromDB() {
        $.ajax({
            type: 'POST',
            async: false,
            url: '/manage-booking/get-booking',
            data: {
                'ID': window.location.search.substring(4)
            },
            success: function (data) {
                //customer_to_be_deleted = JSON.stringify(data);
                //document.getElementById('customer').innerHTML = "THIS IS :" + customer_to_be_deleted;
                createTable(data);
            },
            error: function () {
                alert("I am sorry. Booking data cannot be accessed right now. Please contact IT support.");
            }
        });
    }
    // creates booking summary (customer details included)
    function createTable(data) {
        try {
            const bookingDetailsLabel = "<p> Booking details: </p>";
            //const customerLabel = "<p> Customer details related to the booking:</p>";
            const oTable = "<table class='table table-hover table-striped table-condensed'>";
            const cTable = "</table>";
            let tBody = "<tbody>";

            //Create Table Header
            let headers = "<thead>" +
                "<tr>" +
                "<th>Booking ID</th>" +
                "<th>Booking Duration</th>" +
                "<th>Payment Total in £</th>" +
                "<th>Payment Type</th>" +
                "<th>Booked Pitches</th>" +
                "<th>Number of dogs</th>" +
                "<th>Paid?</th>"
            "</tr>" +
            "</thead>";

            //Create Table Body
            tBody += "<tr>";
            tBody += "<td>" + data[0].booking_id + "</td>";
            tBody += "<td>" + formatDate(data[0].stay_start_date) + " - " + formatDate(data[0].stay_end_date) + "</td>";
            tBody += "<td>" + (data[0].payment_total).toFixed(2) + "</td>";
            tBody += "<td>" + ucFirst(data[0].payment_type) + "</td>";
            tBody += "<td>";
            // in case when one booking has several pitches:
            if (data.length > 1) {
                console.log(data.length);
                if(data.length===2)
                {
                    tBody += "Pitch " + data[0].pitch_id + " " +  getIcon(data[0].type) + " Pitch " + data[1].pitch_id + " " + getIcon(data[1].type);
                }
                else
                {
                    tBody += getIcon(data[0].type) + " Pitch " + data[0].pitch_id + "&nbsp &nbsp" +  getIcon(data[1].type) + " Pitch " + data[1].pitch_id + "<br>" + getIcon(data[2].type) + " Pitch " + data[2].pitch_id;
                }//tBody += "Pitch " + data[0].pitch_id + "<br>" + getIcon(data[i].type);
            }
            else {
                tBody += "Pitch " + data[0].pitch_id + "<br>" + getIcon(data[0].type);
            }
            tBody += "</td>";
            tBody += "<td>" + data[0].count_dogs + "</td>";
            tBody += "<td>" + formatPaid(data[0].paid) + "</td>";
            tBody += "</tr>";
            tBody += "</tbody>";

            let tBody2 = "<tbody>";

            const customerDetailsLabel = "<p> Customer identification data: </p>";

            //Create Table Header
            let headers2 = "<thead>" +
                "<tr>" +
                "<th>Customer ID</th>" +
                "<th>First Name</th>" +
                "<th>Surname</th>" +
                "<th>DOB</th>" +
                "<th>Registration</th>" +
                "</tr>" +
                "</thead>";

            //Create Table Body

            tBody2 += "<tr>";
            tBody2 += "<td>" + data[0].customer_id + "</td>";
            tBody2 += "<td>" + data[0].first_name + "</td>";
            tBody2 += "<td>" + data[0].last_name + "</td>";
            tBody2 += "<td>" + formatDate(data[0].date_of_birth) + "</td>";
            tBody2 += "<td>" + data[0].registration + "</td>";
            tBody2 += "</tr>";

            // To create a line to enclose booking confirmation:
           /* tBody2 += "<tr>";
            tBody2 += "<td></td>";
            tBody2 += "<td></td>";
            tBody2 += "<td></td>";
            tBody2 += "<td></td>";
            tBody2 += "</tr>";*/

            tBody2 += "</tbody>";

            let headers3 = "<thead>" +
                "<tr>" +
                "<th>E-Mail</th>" +
                "<th>Address</th>" +
                "<th>Home Phone</th>" +
                "<th>Mobile Phone</th>" +
                "</tr>" +
                "</thead>";

            const customerContactDataLabel = "<p> Customer contact data: </p>";
            //Create Table Body
            let tBody3 =  "<tbody>";;
            tBody3 += "<tr>";
            tBody3 += "<td>" + data[0].email_address + "</td>";
            tBody3 += "<td>" + data[0].address_line_1 + "<br>" + data[0].address_line_2 + "</td>";
            tBody3 += "<td>" + data[0].home_phone_number + "</td>";
            tBody3 += "<td>" + data[0].mobile_phone_number + "</td>";
            tBody3 += "</tr>";

            // To create a line to enclose booking confirmation:
           /* tBody3 += "<tr>";
            tBody3 += "<td></td>";
            tBody3 += "<td></td>";
            tBody3 += "<td></td>";
            tBody3 += "<td></td>";
            tBody3 += "</tbody>"; */


            document.getElementById('booking').innerHTML = bookingDetailsLabel + oTable + headers + tBody + cTable  + customerDetailsLabel + oTable + headers2 + tBody2 + cTable + customerContactDataLabel + oTable + headers3 + tBody3 + cTable;
        }
        catch (err)
        {
            console.log("Error in create table function of booking-confirmation.js: " + err.toString());
            alert("I am sorry. We have an error. Please contact your IT Support");
        }
    }
    // To make the payment type in first letter lowercased:
    function ucFirst(string) {
        return string.substring(0, 1).toUpperCase() + string.substring(1);
    }
    // Following functions from manage-booking.js:

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
    function formatPaid(paid) {
        if (paid === 1) {
            return "Yes";
        }
        return "No";
    }


});
