// file is for creating a booking confirmation from data of the database
$(document).ready(() => {

// Start Loading and stop Loading Animation for display a loading sign for the user before table is displayed
    startLoadingAnimation();

    getBookingFromDB();
    //Ajax call to the DB to get data for booking confirmation:
    function getBookingFromDB() {
        $.ajax({
            type: 'POST',
            async: false,
            url: '/manage-booking/get-booking',
            data: {
                'ID': window.location.search.substring(12)
            },
            success: function (data) {
                stopLoadingAnimation();
                createTable(data);
            },
            error: function () {
                console.log("We have an error in AJAX request for booking confirmation: " + err);
                alert(errorNotification);
            }
        });
    }
    // creates booking summary (=booking confirmation, customer details included)
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
                "<th>Booking Date</th>" +
                "<th>Booking Duration</th>" +
                "<th>Payment Total in £</th>" +
                "<th>Payment Type</th>" +
                "<th>Paid?</th>" +
                "<th>Booked Pitches</th>" +
                "<th>Dogs?</th>" +
            "</tr>" +
            "</thead>";

            //Create Table Body
            tBody += "<tr>";
            tBody += "<td>" + data[0].booking_id + "</td>";
            tBody += "<td>" + formatDate(data[0].booking_date) + "</td>";
            tBody += "<td>" + formatDate(data[0].stay_start_date) + " - " + formatDate(data[0].stay_end_date) + "</td>";
            tBody += "<td>" + (data[0].payment_total).toFixed(2) + "</td>";
            tBody += "<td>" + ucFirst(data[0].payment_type) + "</td>";
            tBody += "<td>" + formatPaid(data[0].paid) + "</td>";
            tBody += "<td>";
            // in case when one booking has several pitches:
            if (data.length > 1) {
                // one booking has two pitches:
                if(data.length===2)
                {
                    tBody += "Pitch " + data[0].pitch_id + " " + getIcon(data[0].type) + " &nbsp &nbsp" +  " Pitch " + data[1].pitch_id + " " + getIcon(data[1].type);
                }
                else
                    // one booking has three pitches:
                {
                    tBody += "Pitch " + data[0].pitch_id + " " + getIcon(data[0].type) + "&nbsp &nbsp" +  " Pitch " + data[1].pitch_id + " " + getIcon(data[0].type) + "<br> Pitch " + data[2].pitch_id + " " + getIcon(data[2].type);
                }//tBody += "Pitch " + data[0].pitch_id + "<br>" + getIcon(data[i].type);
            }
            // one booking has one pitch:
            else {
                tBody += "Pitch " + data[0].pitch_id + " " + getIcon(data[0].type) ;
            }
            tBody += "</td>";
            tBody += "<td>" + displayDogInformation(data[0].count_dogs) + "</td>";
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

            // Now display the created table in webpage:
            $("#booking").html(bookingDetailsLabel + oTable + headers + tBody + cTable  + customerDetailsLabel + oTable + headers2 + tBody2 + cTable + customerContactDataLabel + oTable + headers3 + tBody3 + cTable);
        }
        catch (err)
        {
            console.log("Error in create table function of booking-confirmation.js: " + err.toString());
            alert(errorNotification);
        }
    }
});
// Gives No when no dog; when dog is also booked, number of dogs will be returned
function displayDogInformation(data)
{
    if (data === 0)
    {
        return "No";
    }
    else return "Yes: " + data;

}
