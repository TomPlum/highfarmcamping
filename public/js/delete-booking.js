// This file is for displaying the customer to be deleted
$(document).ready(() => {

    // variable filters the customer ID from the URL:
    let booking_id = window.location.search.substring(13);

// We invoke Ajax call for getting a single customer
    getBookingFromDB();

// Listen on the "Delete Booking" button and invoke SQL delete statement when clicking
    $('#btnDeleteBooking').click(function () {
        try
        {
            $.ajax({
                url: "/delete-single-booking",
                type: "POST",
                data: {"ID": booking_id},
                success: function (err) {
                    console.log("Ajax Request successful");
                    if(JSON.stringify(err)==="\"\"")
                    {
                        $("#alertBoxContainer").css("visibility","visible");
                    }
                    // When delete Booking is not possible due to referential integrity we invoke a notification for the user:
                    else
                    {
                        $("#alertBoxContainer2").css("visibility", "visible");
                    }

                    $("#deleteBookingSection").css("visibility","hidden");
                },
                error: function (error) {
                    console.log("Ajax request error : " + error);
                    alert(errorNotification);
                }
            });
        }
        catch(err)
        {
            console.log("Error in delete Booking Ajax request: " + err.toString());
            alert(errorNotification);
        }
    });
//Ajax call for getting a single customer

    function getBookingFromDB() {
        try {
            $.ajax({
                url: "/get-booking",
                type: "POST",
                data: {"ID": booking_id},
                success: function (dataP) {
                    booking = dataP;
                    createTable();
                },
                error: function (error) {
                    console.log("Error receiving data from the database")
                }
            })
        }
        catch(err)
        {
            console.log("Error in getBookingFromDB(): " + err.toString());
            alert(errorNotification);
        }
    }

    function createTable() {
        try {

            const oTable = "<table class='table table-hover table-striped table-condensed'>";
            const cTable = "</table>";
            let tBody = "<tbody>";

            //Create Table Header
            let headers = "<thead>" +
                "<tr>" +
                "<th>Booking ID</th>" +
                "<th>Customer ID</th>" +
                "<th>Count Dogs</th>" +
                "<th>Stay Start Date</th>" +
                "<th>Stay End Date</th>" +
                "<th>Payment Type</th>" +
                "<th>Payment Total</th>" +
                "<th>Paid</th>" +
                "<th>Type</th>" +
                "<th>Booking Data</th>"+
                "</tr>" +
                "</thead>";

            //Create Table Body
            for (let i = 0; i < booking.length; i++) {
                tBody += "<tr>";
                tBody += "<td>" + booking[i].booking_id + "</td>";
                tBody += "<td>" + booking[i].customer_id + "</td>";
                tBody += "<td>" + booking[i].count_dogs + "</td>";
                tBody += "<td>" + formatDate(booking[i].stay_start_date) + "</td>";
                tBody += "<td>" + formatDate(booking[i].stay_end_date) + "</td>"
                tBody += "<td>" + booking[i].payment_type + "</td>";
                tBody += "<td>" + booking[i].payment_total + "</td>";
                tBody += "<td>" + booking[i].paid + "</td>";
                tBody += "<td>" + booking[i].type + "</td>";
                tBody += "<td>" + formatDate(booking[i].booking_date) + "</td>";
                tBody += "</tr>";
            }
            tBody += "</tbody>";
            $(".booking-to-be-deleted").html(oTable + headers + tBody + cTable);
        }
        catch(err)
        {
            console.log("Error in create table function: " + err.toString());
            alert(errorNotification);
        }
    }
});